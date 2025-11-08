import { useState } from "react";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Dialog,
  DialogTrigger,
} from "../ui/dialog";
import { deleteUserDoc } from "../../lib/firestore";
import { Spinner } from "../ui/spinner";
import { auth } from "../../lib/firebase";

export default function DeleteUserDialog({
  uid,
  operating,
  setOperating,
}: {
  uid: string;
  operating: boolean;
  setOperating: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="link"
          className="text-destructive text-xs"
          disabled={operating}
        >
          탈퇴
        </Button>
      </DialogTrigger>

      <DialogContent
        className="[&>button]:hidden"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          if (operating) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>회원 탈퇴</DialogTitle>
          <DialogDescription>
            탈퇴하시면 더 이상 알림을 받으실 수 없습니다.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={operating} variant="outline">
              취소
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            disabled={operating}
            onClick={async () => {
              setOperating(true);
              await deleteUserDoc(uid);
              await auth.currentUser?.delete();
              setOperating(false);
            }}
          >
            {operating ? <Spinner /> : "확인"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
