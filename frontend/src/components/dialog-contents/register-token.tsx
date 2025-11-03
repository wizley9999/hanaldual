import { Key } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { getFCMToken } from "../../lib/messaging";
import { toast } from "sonner";
import { updateUserData } from "../../lib/firestore";

export default function RegisterToken({
  uid,
  onCompleted,
}: {
  uid: string;
  onCompleted: (token: string) => void;
}) {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <Button
      variant="secondary"
      className="rounded-l-none border border-l-0"
      disabled={isRegistering}
      onClick={async () => {
        setIsRegistering(true);

        try {
          const token = await getFCMToken();
          const result = await updateUserData(uid, "token", token);
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
