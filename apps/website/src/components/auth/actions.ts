"use server";

import { stackServerApp } from "@/stack";

export async function signOutAction() {
  const user = await stackServerApp.getUser();
  await user?.signOut();
}
