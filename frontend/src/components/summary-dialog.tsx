import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";

export default function SummaryDialog({
  content,
  keywords,
}: {
  content: string;
  keywords: string[];
}) {
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

        {keywords.length !== 0 && (
          <div>
            <Label className="text-base">키워드</Label>
            <span className="text-xs font-normal text-muted-foreground break-all">
              {keywords.join(", ")}
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
