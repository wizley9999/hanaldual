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
import { Input } from "../ui/input";
import { updateUserData } from "../../lib/firestore";
import { Spinner } from "../ui/spinner";
import { SquarePen } from "lucide-react";
import { toast } from "sonner";

export default function EditEmailDialog({
  uid,
  email,
  onCompleted,
}: {
  uid: string;
  email: string | null;
  onCompleted: (email: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [inputEmail, setInputEmail] = useState(email ?? "");
  const [isSending, setIsSending] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="rounded-l-none border border-l-0"
        >
          <SquarePen />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="[&>button]:hidden"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          if (isSending) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>이메일 등록</DialogTitle>
          <DialogDescription>
            알림을 받으실 이메일 주소를 등록해주세요.
          </DialogDescription>
        </DialogHeader>

        <Input
          id="input_email"
          type="email"
          className="text-xs"
          disabled={isSending}
          value={inputEmail}
          onChange={(e) => setInputEmail(e.target.value)}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={isSending} variant="outline">
              취소
            </Button>
          </DialogClose>

          <Button
            disabled={isSending}
            onClick={async () => {
              const input = document.getElementById(
                "input_email"
              ) as HTMLInputElement;

              if (!input.reportValidity()) {
                return;
              }

              const newEmail = inputEmail.trim();

              if (!newEmail) {
                return;
              }

              setIsSending(true);

              try {
                const result = await updateUserData(uid, "email", inputEmail);
                setOpen(false);
                onCompleted(result.email);
              } catch (error: any) {
                toast.error(error.message, {
                  position: "top-center",
                });
              } finally {
                setIsSending(false);
              }
            }}
          >
            {isSending ? <Spinner /> : "등록"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
