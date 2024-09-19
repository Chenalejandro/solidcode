import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack";
import { SignUp } from "@stackframe/stack";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <SignUp></SignUp>
      </div>
    );
  }
  redirect("/");
}
