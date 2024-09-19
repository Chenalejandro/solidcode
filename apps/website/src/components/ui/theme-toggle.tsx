"use client";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const ThemeToggle = ({ className }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleCurrentTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  return (
    <button
      type="button"
      onClick={toggleCurrentTheme}
      className={cn(
        "size-9 rounded-md p-2 text-neutral-700 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800",
        className,
      )}
    >
      <MoonIcon className="block dark:hidden" height="20" />
      <SunIcon className="hidden dark:block" height="20" />
    </button>
  );
};

export default ThemeToggle;
