import { withAuth } from "next-auth/middleware";

const authSecret =
  process.env.NEXTAUTH_SECRET || "dev-only-nextauth-secret-change-me";

export default withAuth({
  secret: authSecret,
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized: ({ req, token }) => {
      if (req.nextUrl.pathname === "/admin/login") {
        return true;
      }

      return !!token;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
