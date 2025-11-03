import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import type { Timestamp } from "firebase/firestore";
import { Spinner } from "../ui/spinner";
import AuthControl from "./auth-control";
import { getCachedUserData } from "../../lib/user-cache";

export default function SettingContent({ uid }: { uid: string }) {
  const [loading, setLoading] = useState(true);
  const [last, setLast] = useState<Timestamp | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      const result = await getCachedUserData(uid, "lastActiveAt");
      if (!mounted) return;

      setLast(result.lastActiveAt);

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
    <div className="flex flex-col w-full h-full p-4 justify-between">
      <div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="uid">아이디</Label>
          <span className="text-xs font-normal text-muted-foreground break-all">
            {uid}
          </span>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Label htmlFor="last">마지막 활동 시각</Label>
          <span className="text-xs font-normal text-muted-foreground break-all">
            {last?.toDate().toDateString() ?? ""}
          </span>
        </div>
      </div>

      <AuthControl uid={uid} />
    </div>
  );
}
