import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import EditEmailDialog from "./edit-email-dialog";
import InputKeywords from "./input-keywords";
import { getCachedUserData } from "../../lib/user-cache";

export default function EmailContent({ uid }: { uid: string }) {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      const result = await getCachedUserData(uid, ["email", "e_keywords"]);
      if (!mounted) return;

      setEmail(result.email);
      setKeywords(result.e_keywords);

      if (mounted) setLoading(false);
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [uid]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-4">
      {/* Email */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="email">이메일</Label>

        <div className="flex">
          <Input
            disabled
            id="email"
            type="email"
            placeholder="이메일을 등록해주세요."
            className="rounded-r-none text-xs"
            value={email || ""}
          />

          <EditEmailDialog
            uid={uid}
            email={email}
            onCompleted={(email) => {
              setEmail(email);
            }}
          />
        </div>
      </div>

      {/* Keywords */}
      <div className="flex flex-col gap-3 pt-4 h-full">
        <InputKeywords
          uid={uid}
          field="e_keywords"
          keywords={keywords}
          onCompleted={(keywords) => {
            setKeywords(keywords);
          }}
        />
      </div>
    </div>
  );
}
