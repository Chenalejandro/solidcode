import { redirect } from "@/i18n/routing";
import { stackServerApp } from "@/stack";
import { SignUp } from "@stackframe/stack";
import { getLocale } from "next-intl/server";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return (
      <div className="flex flex-grow items-center justify-center">
        <SignUp></SignUp>
      </div>
    );
  }
  const locale = await getLocale();
  redirect({ href: "/", locale });
}
