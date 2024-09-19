"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unsubscribe } from "./actions";
import { Button, type ButtonProps } from "@/components/ui/button";

export function UnsubscribeButton(
  props: Omit<ButtonProps, "onClick" | "disabled" | "variant">,
) {
  const queryClient = useQueryClient();
  const { data, error, mutate, isPending } = useMutation({
    mutationKey: ["unsubscribe"],
    mutationFn: async () => {
      await unsubscribe();
      void queryClient.invalidateQueries({
        queryKey: ["get-user"],
      });
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
  return (
    <div>
      Hubo un error, por favor inténtelo de nuevo. Si el problema persiste, por
      favor contacte con nosotros.
    </div>
  );
}
