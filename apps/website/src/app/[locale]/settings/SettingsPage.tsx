"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateProfile } from "./actions";
import { useQueryClient } from "@tanstack/react-query";
import { UnsubscribeButton } from "../unsubscribe/UnsubscribeButton";
import { updateProfileSchema, type UpdateProfileValues } from "./schema";

export default function SettingsPage(props: {
  user: { userName: string; userId: string };
  isSubscribed: boolean;
}) {
  const { user, isSubscribed } = props;

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user.userName },
  });

  async function onSubmit(data: UpdateProfileValues) {
    try {
      await updateProfile(data);
      void queryClient.invalidateQueries({
        queryKey: ["get-user"],
      });
      toast({ description: "Profile updated." });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "An error occurred. Please try again.",
      });
    }
  }

  return (
    <main className="px-3 py-10">
      <section className="mx-auto max-w-7xl space-y-6">
        <h1 className="text-3xl font-bold">Configuraciones</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-sm space-y-2.5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresa un nombre de usuario"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Tu nombre de usuario</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Guardar
            </Button>
          </form>
        </Form>
        <SubscriptionSection isSubscribed={isSubscribed} />
      </section>
    </main>
  );
}

function SubscriptionSection(props: { isSubscribed: boolean }) {
  return (
    <>
      <h2 className="text-bold text-2xl">Mi suscripción</h2>
      {props.isSubscribed ? (
        <UnsubscribeButton size="sm" />
      ) : (
        <p>No tienes ninguna suscripción activa</p>
      )}
    </>
  );
}
