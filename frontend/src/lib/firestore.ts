import { firestore } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

export const getUserData = async (token: string, field: string | string[]) => {
  const usersRef = collection(firestore, "users");

  const q = query(usersRef, where("token", "==", token));
  const querySnap = await getDocs(q);

  if (querySnap.empty) {
    throw new Error(`No user found with token: ${token}`);
  }

  const docSnap = querySnap.docs[0];

  const userData: Record<string, any> = {
    docId: docSnap.id,
    ...docSnap.data(),
  };

  if (typeof field === "string") {
    return { [field]: userData[field], docId: userData.docId };
  }

  const result: Record<string, any> = { docId: userData.docId };

  field.forEach((key) => {
    if (key in userData) result[key] = userData[key];
  });

  return result;
};

export const upsertUserData = async (
  token: string,
  field: string | Record<string, any>,
  value?: any
) => {
  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("token", "==", token));
  const querySnap = await getDocs(q);

  const isEmpty = querySnap.empty;
  const docRef = isEmpty ? doc(usersRef) : querySnap.docs[0].ref;

  let data: Record<string, any>;

  if (typeof field === "string") {
    data = { [field]: value };
  } else {
    data = { ...field };
  }

  if (isEmpty) {
    await setDoc(docRef, {
      token,
      ...data,
    });
  } else {
    await updateDoc(docRef, data);
  }

  return {
    docId: docRef.id,
    token,
    ...(typeof field === "string" ? { [field]: value } : field),
  };
};

export const getAnalysisDocData = async (docId: string) => {
  const analysisDocRef = doc(firestore, "postAnalyses", docId);
  const analysisDocSnap = await getDoc(analysisDocRef);

  if (!analysisDocSnap.exists()) {
    throw new Error(`No analysis snapshot: ${docId}`);
  }

  return analysisDocSnap.data();
};
