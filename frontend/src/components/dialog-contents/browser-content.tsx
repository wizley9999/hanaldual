import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import InputKeywords from "./input-keywords";
import RegisterToken from "./register-token";
import { getCachedUserData } from "../../lib/user-cache";
import { getFCMToken } from "../../lib/messaging";
import { toast } from "sonner";

export default function BrowserContent({ uid }: { uid: string }) {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      const result = await getCachedUserData(uid, ["token", "t_keywords"]);
      if (!mounted) return;

      if (result) {
        setToken(result.token);
        setKeywords(result.t_keywords);
      }

      try {
        const currentToken = await getFCMToken();
        setCurrentToken(currentToken);
      } catch (error: any) {
        toast.error(error.message, {
          position: "top-center",
        });
      }

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
      {/* Token */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 items-end">
            <Label htmlFor="token">토큰</Label>
            <span
              className={`text-xs leading-none font-normal ${
                token === currentToken ? "text-green-600" : "text-destructive"
              }`}
            >
              {token === currentToken ? "(일치)" : "(불일치)"}
            </span>
          </div>

          {/* How to use */}
          <a
            href="https://blog.wizley.io/how-to-setup-hanaldual-for-mobile"
            target="_blank"
            className="text-xs leading-none font-normal underline underline-offset-3 text-blue-400"
          >
            모바일 설정
          </a>
        </div>

        <div className="flex">
          <Input
            disabled
            id="token"
            type="text"
            placeholder="등록된 토큰이 여기에 표시됩니다."
            className="rounded-r-none text-xs"
            value={token || ""}
          />

          <RegisterToken
            uid={uid}
            onCompleted={(token) => {
              setToken(token);
            }}
          />
        </div>
      </div>

      {/* Keywords */}
      <div className="flex flex-col gap-3 pt-4 h-full">
        <InputKeywords
          uid={uid}
          field="t_keywords"
          keywords={keywords}
          onCompleted={(keywords) => {
            setKeywords(keywords);
          }}
        />
      </div>
    </div>
  );
}
