import { invalidateUserCache } from "../lib/user-cache";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { Spinner } from "./ui/spinner";
import { listenForegroundMessages } from "../lib/messaging";
import hanaldualLogo from "../assets/hanaldual.svg";
import User from "./user";
import { Toaster } from "./ui/sonner";

export default function My() {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (obUser) => {
      if (user?.uid && (!obUser || obUser.uid !== user.uid)) {
        invalidateUserCache(user.uid);
      }

      setUser(obUser);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    listenForegroundMessages();
  }, []);

  if (loading) {
    return (
      <div className="bg-muted min-h-dvh flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/";
    return <></>;
  }

  return (
    <>
      <div className="bg-muted flex flex-col gap-6 min-h-dvh items-center justify-center p-4">
        <a href="/" className="flex gap-2 items-center">
          <img
            src={hanaldualLogo}
            width={24}
            height={24}
            alt="Hanaldual logo"
          />

          <span className="font-medium">한알두알</span>
        </a>

        <User />
      </div>

      <Toaster />
    </>
  );
}
