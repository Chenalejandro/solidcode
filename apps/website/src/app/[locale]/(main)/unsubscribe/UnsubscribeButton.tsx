"use client";
import { useMutation } from "@tanstack/react-query";
import { unsubscribe } from "./actions";
import { Button, type ButtonProps } from "@/components/ui/button";

export function UnsubscribeButton(
  props: Omit<ButtonProps, "onClick" | "disabled" | "variant">,
) {
  const { data, error, mutate, isPending } = useMutation({
    mutationKey: ["unsubscribe"],
    mutationFn: async () => {
      await unsubscribe();
    },
  });
  return (
    <>
      <Button
        onClick={() => mutate()}
        disabled={isPending}
        variant="secondary"
        {...props}
      >
        Desuscribir
      </Button>
      <ErrorMessage error={error}></ErrorMessage>
    </>
  );
}

function ErrorMessage({ error }: { error: Error | null }) {
  if (!error) {
    return <></>;
  }
  if (error.message === "NEXT_REDIRECT") {
    console.log('ignoring redirect error');
    return <></>;
  }
  return (
    <div>
      Hubo un error, por favor inténtelo de nuevo. Si el problema persiste, por
      favor contacte con nosotros.
    </div>
  );
}
