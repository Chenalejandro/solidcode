import {
  type SubmissionData,
  getSubmission,
  type WrongAnswerDatas,
} from "@/app/[locale]/problems/[slug]/_actions/GetSubmissionAction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  invalidSubmissionSchemaError,
  notAuthenticatedError,
} from "@/app/[locale]/problems/[slug]/_errors";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Status } from "@/app/[locale]/problems/[slug]/_schemas/SubmissionSchema";
import { useEffect } from "react";
import { useUser } from "@stackframe/stack";

export function CodeSubmissionResult({
  submissionPublicId,
  onPoolingResultCompletes,
}: {
  submissionPublicId?: string;
  onPoolingResultCompletes: () => void;
}) {
  if (!submissionPublicId) {
    return <></>;
  }
  return (
    <Result
      submissionPublicId={submissionPublicId}
      onPoolingResultCompletes={onPoolingResultCompletes}
    />
  );
}

function Result({
  submissionPublicId,
  onPoolingResultCompletes,
}: {
  submissionPublicId: string;
  onPoolingResultCompletes: () => void;
}) {
  const queryClient = useQueryClient();
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["get-submission-status", submissionPublicId],
    queryFn: async () => await getSubmission(submissionPublicId),
    refetchInterval: (query) => {
      if (query.state.dataUpdateCount > 10) {
        throw new Error(
          "Cannot get the submission result, please contact us immediately",
        );
      }
      if (
        query.state.data?.submission.status === "queued" ||
        query.state.data?.submission.status === "processing"
      ) {
        return 1000;
      }
      return 0;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: (failureCount, error) => {
      if (
        error.message === notAuthenticatedError.message ||
        error.message === invalidSubmissionSchemaError.clientMessage
      ) {
        return false;
      } else if (failureCount > 2) {
        return false;
      }
      return true;
    },
    retryDelay: 500,
  });
  const user = useUser();
  // FIXME: We should be using revalidatePath() in the server action, but currently there are some issues
  useEffect(() => {
    if (
      !isError &&
      !isPending &&
      data.submission.status !== "queued" &&
      data.submission.status !== "processing"
    ) {
      onPoolingResultCompletes();
      void queryClient.invalidateQueries({
        queryKey: [`${user?.id}-submission-results`],
      });
    }
  }, [data, isError, isPending, queryClient, user, onPoolingResultCompletes]);
  if (isError) {
    if (error.message === notAuthenticatedError.message) {
      return <div>{notAuthenticatedError.clientMessage}</div>;
    } else if (error.message === invalidSubmissionSchemaError.message) {
      return <div>{invalidSubmissionSchemaError.clientMessage}</div>;
    }
    return (
      <div>
        Hubo un error, por favor intente de nuevo. Si el problema persiste,
        contacte con nosotros.
      </div>
    );
  }
  if (isPending) {
    return <div>Loading...</div>;
  }
  const { submission, testCasesCount } = data;
  if (submission.status === "queued" || submission.status === "processing") {
    return <div>Loading...</div>;
  }
  if (
    submission.status === "accepted" ||
    submission.status === "wrong_answer"
  ) {
    if (submission.wrongAnswerDatas.length === 0) {
      return (
        <>
          <CorrectAnswerCard
            submissionData={submission.submissionData}
            testCasesCount={testCasesCount}
          />
        </>
      );
    }
    return (
      <>
        <WrongAnswerCard
          // @ts-expect-error silencing the typescript error since
          // we already know that the array has at least one element
          wrongAnswerDatas={submission.wrongAnswerDatas}
          submissionData={submission.submissionData}
          testCasesCount={testCasesCount}
        />
      </>
    );
  }
  return (
    <>
      <SubmissionErrorCard
        submissionData={submission.submissionData}
        submissionStatus={submission.status}
      />
    </>
  );
}

function CorrectAnswerCard(props: {
  submissionData: SubmissionData;
  testCasesCount: number | undefined;
}) {
  const { submissionData, testCasesCount } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Respuesta correcta</CardTitle>
        <CardDescription>{`${testCasesCount}/${testCasesCount} casos de pruebas pasadas`}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{`Tiempo de ejecución: ${submissionData.executionTime} segundos`}</p>
        <p>{`Cantidad de memoria usada: ${submissionData.memoryUsage} kB`}</p>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

type NonEmptyWrongAnswerDatas = [WrongAnswerDatas[number], ...WrongAnswerDatas];

function WrongAnswerCard(props: {
  wrongAnswerDatas: NonEmptyWrongAnswerDatas;
  submissionData: SubmissionData;
  testCasesCount: number | undefined;
}) {
  const { wrongAnswerDatas, submissionData, testCasesCount } = props;
  const failedTestCaseOrderNumber = wrongAnswerDatas[0].testCase.orderNumber;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Respuesta incorrecta</CardTitle>
        <CardDescription>
          {`Falló el caso de prueba número ${failedTestCaseOrderNumber} (de ${testCasesCount})`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{`Entrada: ${wrongAnswerDatas[0].testCase.input}`}</p>
        {/* <p>{`Entrada: ${wrongAnswerDatas[0].testCase.input.split("\n")[1]}`}</p> */}
        <p>{`Salida: ${wrongAnswerDatas[0].output}`}</p>
        <p>{`Resultado esperado: ${wrongAnswerDatas[0].testCase.expectedResult}`}</p>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

type SubmissionErrorStatus = Exclude<
  Status,
  "accepted" | "queued" | "processing" | "wrong_answer"
>;

function SubmissionErrorCard(props: {
  submissionData: SubmissionData;
  submissionStatus: SubmissionErrorStatus;
}) {
  const { submissionData, submissionStatus } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <ErrorCardTitle submissionStatus={submissionStatus}></ErrorCardTitle>
        </CardTitle>
        <CardDescription>
          <ErrorCardDescription
            submissionStatus={submissionStatus}
          ></ErrorCardDescription>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ErrorCardContent
          submissionData={submissionData}
          submissionStatus={submissionStatus}
        ></ErrorCardContent>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

function ErrorCardContent(props: {
  submissionData: SubmissionData;
  submissionStatus: SubmissionErrorStatus;
}) {
  const { submissionData, submissionStatus } = props;
  switch (submissionStatus) {
    case "compilation_error":
      return <>{submissionData.compileOutput}</>;
    case "time_limit_exceeded":
      return <></>;
    default:
      return <></>;
  }
}

function ErrorCardTitle({
  submissionStatus,
}: {
  submissionStatus: SubmissionErrorStatus;
}) {
  switch (submissionStatus) {
    case "compilation_error":
      return <>Error de compilación</>;
    case "time_limit_exceeded":
      return <>Tiempo de ejecución exhaustado</>;
    default:
      return <>Error en la ejecución de su código</>;
  }
}

function ErrorCardDescription({
  submissionStatus,
}: {
  submissionStatus: SubmissionErrorStatus;
}) {
  console.error(submissionStatus);
  switch (submissionStatus) {
    case "compilation_error":
      return <>El sintaxis de su código es inválido</>;
    case "time_limit_exceeded":
      return <>Tu código tardó demasiado en ejecutar</>;
    default:
      return (
        <>
          No pudimos determinar el error exacto que hizo que la ejecución de su
          código falle. Por favor contácte con nosotros
        </>
      );
  }
}
