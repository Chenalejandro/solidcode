import { redirect } from "@/i18n/routing";
import { stackServerApp } from "@/stack";
import { SignIn } from "@stackframe/stack";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <SignIn></SignIn>
      </div>
    );
  }
  redirect("/");
}
