import { useState } from "react";
import { auth } from "../../lib/firebase";
import { Button } from "../ui/button";
import DeleteUserDialog from "./delete-user-dialog";

export default function AuthControl({ uid }: { uid: string }) {
  const [operating, setOperating] = useState(false);

  return (
    <div className="flex w-full justify-end items-center gap-1">
      <DeleteUserDialog
        uid={uid}
        operating={operating}
        setOperating={setOperating}
      />

      <Button
        disabled={operating}
        variant="outline"
        size="sm"
        onClick={async () => {
          setOperating(true);
          await auth.signOut();
          setOperating(false);
        }}
      >
        로그아웃
      </Button>
    </div>
  );
}
