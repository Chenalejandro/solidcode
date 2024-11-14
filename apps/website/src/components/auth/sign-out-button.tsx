"use client";
import { useUser } from "@stackframe/stack";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const user = useUser();
  return (
    <button onClick={() => user?.signOut()} className="flex items-center">
      <LogOut className="mr-2 h-5 w-5" />
      <span>Cerrar sesión</span>
    </button>
  );
}
