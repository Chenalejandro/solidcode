import { redirect } from "@/i18n/navigation";
import { stackServerApp } from "@/stack";
import { SignIn } from "@stackframe/stack";
import { getLocale } from "next-intl/server";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return (
      <div className="flex grow items-center justify-center">
        <SignIn></SignIn>
      </div>
    );
  }
  const locale = await getLocale();
  redirect({ href: "/", locale });
}
