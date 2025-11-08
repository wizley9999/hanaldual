import { BanIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { updateUserData } from "../../lib/firestore";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";

export default function InputKeywords({
  uid,
  field,
  keywords,
  onCompleted,
}: {
  uid: string;
  field: string;
  keywords: string[];
  onCompleted: (keywords: string[]) => void;
}) {
  const [inputKeyword, setInputKeyword] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    const newKeyword = inputKeyword.trim();

    if (!newKeyword) {
      return;
    }

    if (keywords.includes(newKeyword)) {
      return;
    }

    const updated = [...keywords, newKeyword];

    setIsAdding(true);

    try {
      const result = await updateUserData(uid, {
        [field]: updated,
        lastActiveAt: Timestamp.fromDate(new Date()),
      });

      setInputKeyword("");
      onCompleted(result[field]);
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-center",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemove = async (target: string) => {
    const updated = keywords.filter((k) => k !== target);

    try {
      const result = await updateUserData(uid, {
        [field]: updated,
        lastActiveAt: Timestamp.fromDate(new Date()),
      });
      onCompleted(result[field]);
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-center",
      });
    }
  };

  return (
    <>
      <Label htmlFor="keyword">키워드</Label>

      <div className="flex items-center gap-2">
        <Input
          disabled={isAdding}
          id="keyword"
          type="text"
          className="text-xs"
          value={inputKeyword}
          maxLength={10}
          onChange={(e) => setInputKeyword(e.target.value)}
        />

        <Button disabled={isAdding} onClick={handleAdd}>
          {isAdding ? <Spinner /> : "추가"}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-1 sm:gap-2 content-start h-64 overflow-y-auto px-2">
        {keywords.map((element) => (
          <div
            key={element}
            className="flex items-center justify-between h-fit"
          >
            <span className="text-sm leading-none font-normal line-clamp-1">
              {element}
            </span>

            <Button
              onClick={() => {
                handleRemove(element);
              }}
              size="icon"
              variant="ghost"
              className="text-primary"
            >
              <BanIcon className="h-5 w-5 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
