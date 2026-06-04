import { Fragment, type ReactNode } from "react";
import type { Prisma } from "@prisma/client";
import type { PublicNewsItem } from "@/types/news";

type RichMark = {
  type?: string;
  attrs?: Record<string, unknown> | null;
};

type RichNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown> | null;
  marks?: RichMark[];
  content?: RichNode[];
};

type PublicNewsRecord = {
  slug: string;
  title: string;
  excerpt: string;
  content: Prisma.JsonValue;
  coverUrl: string | null;
  publishedAt: Date | null;
  createdAt: Date;
};

const BLOCK_TYPES = new Set([
  "paragraph",
  "heading",
  "blockquote",
  "listItem",
  "codeBlock",
]);

function isRichNode(value: unknown): value is RichNode {
  return typeof value === "object" && value !== null;
}

function toNodes(value: Prisma.JsonValue | null): RichNode[] {
  if (!isRichNode(value)) {
    return [];
  }

  if (Array.isArray(value.content)) {
    return value.content.filter(isRichNode);
  }

  return [];
}

function formatDate(value: Date | null) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(value);
}

function extractNodeText(node: RichNode): string {
  if (node.type === "text") {
    return node.text ?? "";
  }

  if (node.type === "hardBreak") {
    return "\n";
  }

  const children = (node.content ?? []).map(extractNodeText).join(" ");
  return BLOCK_TYPES.has(node.type ?? "") ? `${children}\n` : children;
}

function applyMarks(
  content: ReactNode,
  marks: RichMark[] | undefined,
  keyBase: string
): ReactNode {
  return (marks ?? []).reduce<ReactNode>((result, mark, index) => {
    const key = `${keyBase}-mark-${index}`;

    switch (mark.type) {
      case "bold":
        return <strong key={key}>{result}</strong>;
      case "italic":
        return <em key={key}>{result}</em>;
      case "underline":
        return <u key={key}>{result}</u>;
      case "strike":
        return <s key={key}>{result}</s>;
      case "code":
        return <code key={key}>{result}</code>;
      case "link": {
        const href =
          typeof mark.attrs?.href === "string" ? mark.attrs.href : undefined;

        if (!href) {
          return result;
        }

        return (
          <a key={key} href={href} target="_blank" rel="noreferrer">
            {result}
          </a>
        );
      }
      default:
        return result;
    }
  }, content);
}

function renderChildren(nodes: RichNode[] | undefined, keyBase: string) {
  return (nodes ?? []).map((node, index) => renderNode(node, `${keyBase}-${index}`));
}

function renderNode(node: RichNode, key: string): ReactNode {
  switch (node.type) {
    case "text":
      return <Fragment key={key}>{applyMarks(node.text ?? "", node.marks, key)}</Fragment>;
    case "paragraph":
      return <p key={key}>{renderChildren(node.content, key)}</p>;
    case "heading": {
      const level =
        typeof node.attrs?.level === "number"
          ? Math.min(Math.max(node.attrs.level, 2), 4)
          : 2;
      const Tag = `h${level}` as "h2" | "h3" | "h4";

      return <Tag key={key}>{renderChildren(node.content, key)}</Tag>;
    }
    case "bulletList":
      return <ul key={key}>{renderChildren(node.content, key)}</ul>;
    case "orderedList":
      return <ol key={key}>{renderChildren(node.content, key)}</ol>;
    case "listItem":
      return <li key={key}>{renderChildren(node.content, key)}</li>;
    case "blockquote":
      return <blockquote key={key}>{renderChildren(node.content, key)}</blockquote>;
    case "horizontalRule":
      return <hr key={key} />;
    case "hardBreak":
      return <br key={key} />;
    case "codeBlock":
      return (
        <pre key={key}>
          <code>{extractNodeText(node).trim()}</code>
        </pre>
      );
    default:
      if (node.content?.length) {
        return <Fragment key={key}>{renderChildren(node.content, key)}</Fragment>;
      }

      return null;
  }
}

export function extractTextFromRichContent(content: Prisma.JsonValue | null) {
  return toNodes(content)
    .map(extractNodeText)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function mapPublicNewsItem(item: PublicNewsRecord): PublicNewsItem {
  return {
    slug: item.slug,
    title: item.title,
    date: formatDate(item.publishedAt ?? item.createdAt),
    excerpt: item.excerpt,
    content: extractTextFromRichContent(item.content),
    coverImage: item.coverUrl,
  };
}

export function renderRichContent(content: Prisma.JsonValue | null) {
  return renderChildren(toNodes(content), "rich-content");
}
