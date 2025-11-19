import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function SummaryDialog({ content }: { content: string }) {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI 요약</DialogTitle>
        </DialogHeader>

        <div>
          <Label className="text-base">내용</Label>
          <span className="text-sm font-normal text-muted-foreground break-all">
            {content}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
