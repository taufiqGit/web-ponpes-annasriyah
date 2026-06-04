"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminLogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await signOut({
      callbackUrl: "/admin/login",
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleLogout}
      disabled={loading}
      className="border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
    >
      <LogOut className="size-4" />
      {loading ? "Keluar..." : "Logout"}
    </Button>
  );
}
