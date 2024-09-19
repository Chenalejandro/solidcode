"use client";

import { initMercadoPago } from "@mercadopago/sdk-react";
import { CardPayment } from "@mercadopago/sdk-react";
import {
  type ICardPaymentBrickPayer,
  type ICardPaymentFormData,
} from "@mercadopago/sdk-react/bricks/cardPayment/type";
import { useState } from "react";
import { processPayment } from "../action";
import { useTheme } from "next-themes";
import { env } from "@/env";
import { useQueryClient } from "@tanstack/react-query";

if (typeof window !== "undefined") {
  initMercadoPago(env.NEXT_PUBLIC_MELI_PUBLIC_KEY);
}

interface IPaymentForm {
  amount: number;
  email?: string;
}

export default function PaymentForm({ amount, email }: IPaymentForm) {
  const [submitError, setSubmitError] = useState<boolean>(false);
  const { resolvedTheme } = useTheme();
  const queryClient = useQueryClient();
  const onSubmit = async (
    formData: ICardPaymentFormData<ICardPaymentBrickPayer>,
  ) => {
    try {
      await processPayment(formData);
      void queryClient.invalidateQueries({
        queryKey: ["get-user"],
      });
    } catch (error) {
      console.error(error);
      setSubmitError(true);
    }
  };

  const onError = async (error: unknown) => {
    // callback llamado para todos los casos de error de Brick
    console.error(error);
  };

  const onReady = async () => {
    /*
    Callback llamado cuando Brick está listo.
    Aquí puedes ocultar cargamentos de su sitio, por ejemplo.
  */
  };

  if (submitError) {
    // FIXME: We should be using a modal
    return (
      <>
        Hubo un error, por favor refresque la página y pruebe de nuevo. Si el
        problema persiste por favor contacte con nosotros.
      </>
    );
  }

  return (
    <CardPayment
      initialization={{ amount, payer: { email } }}
      onSubmit={onSubmit}
      onReady={onReady}
      onError={onError}
      customization={{
        visual: {
          style: {
            theme: resolvedTheme === "dark" ? "dark" : "bootstrap",
          },
        },
      }}
    />
  );
}
