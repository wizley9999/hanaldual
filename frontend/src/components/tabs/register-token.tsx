import { Key } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { getFCMToken } from "../../lib/messaging";
import { toast } from "sonner";
import { updateUserData } from "../../lib/firestore";

export default function RegisterToken({
  uid,
  disabled,
  onCompleted,
}: {
  uid: string;
  disabled: boolean;
  onCompleted: (token: string) => void;
}) {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <Button
      variant={disabled ? "secondary" : "default"}
      className="rounded-l-none border border-l-0"
      disabled={disabled || isRegistering}
      onClick={async () => {
        setIsRegistering(true);

        try {
          const currentToken = await getFCMToken();
          const result = await updateUserData(uid, "token", currentToken);
          onCompleted(result.token);
        } catch (error: any) {
          toast.error(error.message, {
            position: "top-center",
          });
        } finally {
          setIsRegistering(false);
        }
      }}
    >
      {isRegistering ? <Spinner /> : <Key />}
    </Button>
  );
}
