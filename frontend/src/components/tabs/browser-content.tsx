import { getFCMToken } from "../../lib/messaging";
import { auth } from "../../lib/firebase";
import { getCachedUserData } from "../../lib/user-cache";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import RegisterToken from "./register-token";
import InputKeywords from "./input-keywords";

export default function BrowserContent() {
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState<string | null>(null); // DB
  const [currentToken, setCurrentToken] = useState<string | null>(null); // getFCMToken
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!auth.currentUser) return;

      const result = await getCachedUserData(auth.currentUser.uid, [
        "token",
        "keywords",
      ]);

      if (!mounted) return;

      if (result) {
        setToken(result.token);
        setKeywords(result.keywords);
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
  }, []);

  if (loading || !auth.currentUser) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full px-4 pt-4">
      {/* Token */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 items-end">
            <Label htmlFor="token">토큰</Label>
            <span
              className={`text-xs leading-none font-normal ${
                token && currentToken === token
                  ? "text-green-600"
                  : "text-destructive"
              }`}
            >
              {token && currentToken === token ? "(일치)" : "(불일치)"}
            </span>
          </div>

          {/* How to use */}
          <a
            href="https://blog.wizley.io/how-to-setup-hanaldual"
            target="_blank"
            className="text-xs leading-none font-normal underline underline-offset-3 text-blue-400"
          >
            설정 방법
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
            uid={auth.currentUser.uid}
            disabled={token != null && currentToken === token}
            onCompleted={(token) => {
              setToken(token);
            }}
          />
        </div>
      </div>

      {/* Keywords */}
      <div className="flex flex-col gap-3 pt-4 h-full">
        <InputKeywords
          uid={auth.currentUser.uid}
          field="keywords"
          keywords={keywords}
          onCompleted={(keywords) => {
            setKeywords(keywords);
          }}
        />
      </div>
    </div>
  );
}
