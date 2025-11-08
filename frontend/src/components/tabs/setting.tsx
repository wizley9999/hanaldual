import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";
import { getCachedUserData } from "../../lib/user-cache";
import { auth } from "../../lib/firebase";
import AuthControl from "./auth-control";

export default function Setting() {
  const [loading, setLoading] = useState(true);
  const [lastActiveAt, setLastActiveAt] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!auth.currentUser) return;

      const result = await getCachedUserData(
        auth.currentUser.uid,
        "lastActiveAt"
      );

      if (!mounted) return;

      setLastActiveAt(result.lastActiveAt.toDate().toDateString());

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
    <div className="flex flex-col w-full h-full p-4 justify-between">
      <div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="uid">아이디</Label>
          <span className="text-xs font-normal text-muted-foreground break-all">
            {auth.currentUser.uid}
          </span>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Label htmlFor="last">마지막 활동 시각</Label>
          <span className="text-xs font-normal text-muted-foreground break-all">
            {lastActiveAt}
          </span>
        </div>
      </div>

      <AuthControl uid={auth.currentUser.uid} />
    </div>
  );
}
