import { type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { SignInButton } from "./auth/sign-in-button";
import { usePathname } from "next/navigation";
// import Image from "next/image";

const LoginModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="absolute z-[9999999]">
        <DialogHeader>
          {/*<div className="relative mx-auto mb-2 h-24 w-24">*/}
          {/*  <Image*/}
          {/*    src="/snake-1.png"*/}
          {/*    alt="snake image"*/}
          {/*    className="object-contain"*/}
          {/*    fill*/}
          {/*  />*/}
          {/*</div>*/}
          <DialogTitle className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-200">
            Inicia la sesión para continuar
          </DialogTitle>
          <DialogDescription className="py-2 text-center text-base">
            <span className="font-medium text-zinc-900 dark:text-gray-200">
              Tu código ha sido guardado!
            </span>{" "}
            Inicie sesión o cree una cuenta para enviar el código.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <SignInButton afterAuthReturnTo={pathname}/>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
