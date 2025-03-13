import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";

export function SignInButton({
  afterAuthReturnTo = "/",
}: {
  afterAuthReturnTo?: string;
}) {
  return (
    <Button asChild>
      <Link href={`/signin?after_auth_return_to=${afterAuthReturnTo}`}>
        Iniciar sessión
      </Link>
    </Button>
  );
}
