"use server";

import { getSubmissions } from "@/server/data/submissions-dto";
import { stackServerApp } from "@/stack";
import { z } from "zod";

const problemIdSchema = z.number();

export async function getUserSubmissions(problemIdNotParsed: unknown) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("unauthenticated");
  }
  const problemId = problemIdSchema.parse(problemIdNotParsed);
  return await getSubmissions(problemId, user.id);
}
