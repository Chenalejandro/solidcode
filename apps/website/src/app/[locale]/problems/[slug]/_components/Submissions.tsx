"use client";
import { useQuery } from "@tanstack/react-query";
import { getUserSubmissions } from "../actions";
import { submissionColumns } from "./SubmissionColumns";
import { SubmissionDataTable } from "./SubmissionDataTable";

export function Submissions(props: { problemId: number; userId: string }) {
  const { problemId, userId } = props;
  const { data, isError, isPending } = useQuery({
    queryKey: [`${userId}-submission-results`, problemId],
    queryFn: async () => await getUserSubmissions(problemId),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  if (isPending) {
    return <div>Cargando los resultados...</div>;
  }
  if (isError) {
    return <div>Hubo un error</div>;
  }
  return (
    <>
      <SubmissionDataTable columns={submissionColumns} data={data} />
    </>
  );
}
