"use client";
import { type ReactNode } from "react";
import { SignInButton } from "@/components/auth/sign-in-button";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { getUserInfo } from "../[locale]/actions";

export default function RightContent({
  themeToggle,
  subscribeButton,
}: {
  themeToggle: ReactNode;
  subscribeButton: ReactNode;
}) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["get-user"],
    queryFn: async () => await getUserInfo(),
    refetchOnWindowFocus: false,
  });
  if (isError) {
    console.log(error);
    return (
      <>
        {themeToggle}
        <>Hubo un error</>
      </>
    );
  }
  if (isPending) {
    return (
      <>
        {themeToggle}
        <></>
      </>
    );
  }
  if (!data.id) {
    return (
      <>
        {themeToggle}
        <SignInButton></SignInButton>
      </>
    );
  }
  return (
    <>
      {!data.isUserSubscribed && subscribeButton}
      {themeToggle}
      <UserIcon
        profileImageUrl={data.profileImageUrl}
        displayName={data.displayName}
      ></UserIcon>
    </>
  );
}

export function UserIcon({
  profileImageUrl,
  displayName,
}: {
  profileImageUrl: string | null;
  displayName: string | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="flex-none rounded-full">
          <Avatar>
            <AvatarImage src={profileImageUrl ?? "/favicon.ico"} />
            <AvatarFallback>{displayName?.[0] ?? "?"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-5 w-5" />
              <span>Configuraciones</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
