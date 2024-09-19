import ThemeToggle from "@/components/ui/theme-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
const RightContent = dynamic(() => import("./RightContent"), { ssr: false });

export async function TopNav() {
  const t = await getTranslations("App");
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
      <Link href="/" className="flex h-10 items-center justify-center">
        <h1 className="font-semibold">{t("title")}</h1>
      </Link>
      <div className="flex items-center">
        <RightContent
          subscribeButton={<SubscribeButton />}
          themeToggle={<ThemeToggle className="mr-5" />}
        ></RightContent>
      </div>
    </nav>
  );
}

async function SubscribeButton() {
  const t = await getTranslations("App");
  return (
    <Button asChild className="mr-5 whitespace-pre-wrap">
      <Link href="/subscription">
        {t("Buy")} <span className="font-bold">{t("name")}</span>
      </Link>
    </Button>
  );
}
