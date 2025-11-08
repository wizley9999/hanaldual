import { signInAndSaveUser } from "../lib/firestore";
import { auth } from "../lib/firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { useEffect, useState } from "react";

export default function AuthButton({
  spinner: Spinner,
  signIn: SignIn,
  authorized: Authorized,
}: {
  spinner: React.ComponentType<{}>;
  signIn: React.ComponentType<{ onClick?: () => void }>;
  authorized: React.ComponentType<{ onClick?: () => void }>;
}) {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (obUser) => {
      setUser(obUser);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    await signInAndSaveUser(userCredential);
  };

  const handleAuthorized = () => {
    window.location.href = "/my";
  };

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <SignIn onClick={handleSignIn} />;
  }

  return <Authorized onClick={handleAuthorized} />;
}
