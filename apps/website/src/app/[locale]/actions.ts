"use server";

import { subscribed } from "@/server/data/subscriptions-dto";
import { stackServerApp } from "@/stack";

export async function getUserInfo() {
  const user = await stackServerApp.getUser();
  if (!user) {
    return { id: null };
  }
  const isUserSubscribed = await subscribed(user.id);
  return {
    id: user.id,
    email: user.primaryEmail,
    profileImageUrl: user.profileImageUrl,
    displayName: user.displayName,
    isUserSubscribed,
  };
}
