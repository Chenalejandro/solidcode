"use client";
import { useQueryClient } from "@tanstack/react-query";
import { signOutAction } from "./actions";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const queryClient = useQueryClient();
  return (
    <button
      onClick={async () => {
        await signOutAction();
        void queryClient.invalidateQueries({
          queryKey: ["get-user"],
        });
      }}
      className="flex items-center"
    >
      <LogOut className="mr-2 h-5 w-5" />
      <span>Cerrar sesión</span>
    </button>
  );
}
