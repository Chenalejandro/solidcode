"use client";

import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { type IPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/payment/type";
import { useEffect, useState } from "react";
import { processPayment } from "../action";
import { useTheme } from "next-themes";
import { env } from "@/env";

interface IPaymentForm {
  amount: number;
  email?: string;
  preferenceId?: string;
}

export default function PaymentForm({
  amount,
  email,
  preferenceId,
}: IPaymentForm) {
  const [submitError, setSubmitError] = useState<boolean>(false);
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    // Inicializamos el SDK
    initMercadoPago(env.NEXT_PUBLIC_MELI_PUBLIC_KEY);

    // Desmontamos el componente de bricks cuando se desmonte el componente
    return () => {
      // @ts-expect-error ignoring type error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      window?.cardPaymentBrickController?.unmount();
    };
  }, []);
  const onSubmit = async (formData: IPaymentFormData) => {
    try {
      await processPayment(formData);
    } catch (error) {
      // @ts-expect-error "ignoring type errors"
      if (error?.message === "NEXT_REDIRECT") {
        console.log("ignoring redirect error");
        return;
      }
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
    <Payment
      initialization={{
        amount,
        payer: { email },
        preferenceId,
      }}
      onSubmit={onSubmit}
      customization={{
        visual: {
          style: {
            theme: resolvedTheme === "dark" ? "dark" : "bootstrap",
          },
        },
        paymentMethods: {
          creditCard: "all",
          prepaidCard: "all",
          debitCard: "all",
          mercadoPago: ["wallet_purchase"],
        },
      }}
      onReady={onReady}
      onError={onError}
    />
  );
}
