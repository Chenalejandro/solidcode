import ThemeToggle from "@/components/ui/theme-toggle";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import RightContentWrapper from "./RightContentWrapper";

export async function TopNav() {
  const t = await getTranslations("App");
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
      <Link href="/" className="flex h-10 items-center justify-center">
        <h1 className="font-semibold">{t("title")}</h1>
      </Link>
      <div className="flex items-center">
        <RightContentWrapper
          subscribeButton={<SubscribeButton />}
          themeToggle={<ThemeToggle className="mr-5" />}
        ></RightContentWrapper>
      </div>
    </nav>
  );
}

async function SubscribeButton() {
  const t = await getTranslations("App");
  return (
    <Button className="mr-5 whitespace-pre-wrap">
      <Link href="/subscription">
        <div>
          {t("Buy")} <span className="inline-block font-bold">{t("name")}</span>
        </div>
      </Link>
    </Button>
  );
}
