"use server";

import { revalidatePath } from "next/cache";
import { stackServerApp } from "@/stack";
import { updateProfileSchema, type UpdateProfileValues } from "./schema";

export async function updateProfile(values: UpdateProfileValues) {
  const user = await stackServerApp.getUser();

  if (!user) {
    throw Error("Unauthorized");
  }

  const { name } = updateProfileSchema.parse(values);

  await user.setDisplayName(name);

  revalidatePath("/settings");
}
