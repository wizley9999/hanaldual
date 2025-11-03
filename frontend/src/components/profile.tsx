import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import React, { useEffect, useState } from "react";
import { signInAndSaveUser } from "../lib/firestore";
import UserDialog from "./user-dialog";
import { invalidateUserCache } from "../lib/user-cache";

export default function Profile({
  loading: Loading,
  signIn: SignIn,
  signedIn: SignedIn,
}: {
  loading: React.ComponentType<{}>;
  signIn: React.ComponentType<{ onClick?: () => void }>;
  signedIn: React.ComponentType<{ onClick?: () => void }>;
}) {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

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

  async function handleSignIn() {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    await signInAndSaveUser(userCredential);

    setUser(userCredential.user);
  }

  async function handleSignedIn() {
    setOpen(true);
  }

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <SignIn onClick={handleSignIn} />;
  }

  return (
    <>
      <UserDialog user={user} open={open} onOpenChange={setOpen} />
      <SignedIn onClick={handleSignedIn} />
    </>
  );
}
