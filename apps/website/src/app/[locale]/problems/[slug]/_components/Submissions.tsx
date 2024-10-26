import { stackServerApp } from "@/stack";
import { submissionColumns } from "./SubmissionColumns";
import { SubmissionDataTable } from "./SubmissionDataTable";
import { getSubmissions } from "@/server/data/submissions-dto";

export async function Submissions(props: { problemId: number }) {
  const { problemId } = props;
  const user = await stackServerApp.getUser();
  if (!user) {
    return (
      <div>Tenés que estar loggeado para ver tus ejecuciones del código</div>
    );
  }
  const userSubmissions = await getSubmissions(problemId, user.id);
  return (
    <>
      <SubmissionDataTable columns={submissionColumns} data={userSubmissions} />
    </>
  );
}
