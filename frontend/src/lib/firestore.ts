import type { UserCredential } from "firebase/auth";
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "./firebase";
import { invalidateUserCache } from "./user-cache";

export const signInAndSaveUser = async (userCredential: UserCredential) => {
  const user = userCredential.user;
  if (!user) {
    throw new Error("No user returned from signInWithPopup");
  }

  const userDocRef = doc(firestore, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  const now = Timestamp.fromDate(new Date());

  if (userDocSnap.exists()) {
    await updateDoc(userDocRef, {
      lastLoginAt: now,
    });
  } else {
    await setDoc(userDocRef, {
      createdAt: now,
      keywords: [],
      lastActiveAt: now,
      lastLoginAt: now,
      received: [],
      token: null,
    });
  }
};

export const getUserData = async (userId: string, field: string | string[]) => {
  const userDocRef = doc(firestore, "users", userId);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    throw new Error("No user snapshot");
  }

  const userData = userDocSnap.data();

  if (typeof field === "string") {
    return { [field]: userData[field] };
  }

  const result: Record<string, any> = {};

  field.forEach((key) => {
    if (key in userData) result[key] = userData[key];
  });

  return result;
};

export const updateUserData = async (
  userId: string,
  field: string | Record<string, any>,
  value?: any
) => {
  const validate = (key: string, val: any) => {
    if (key === "token" && (val === null || val === "")) {
      throw new Error("토큰 등록 중 오류가 발생했습니다.");
    }

    if (key === "keywords" && Array.isArray(val) && val.length > 10) {
      throw new Error("키워드는 10개를 초과할 수 없습니다.");
    }
  };

  const userDocRef = doc(firestore, "users", userId);

  if (typeof field === "string") {
    validate(field, value);
    await updateDoc(userDocRef, { [field]: value });
    invalidateUserCache(userId);
    return { [field]: value };
  }

  Object.entries(field).forEach(([key, val]) => validate(key, val));
  await updateDoc(userDocRef, field);

  invalidateUserCache(userId);
  return field;
};

export const deleteUserDoc = async (userId: string) => {
  const userDocRef = doc(firestore, "users", userId);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    throw new Error("No user snapshot");
  }

  await deleteDoc(userDocRef);
};

export const getSavedKeywords = async (limitCount: number = 10) => {
  const keywordsRef = collection(firestore, "keywords");
  const q = query(keywordsRef, orderBy("count", "desc"), limit(limitCount));

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return [];
  }

  const keywords = snapshot.docs.map((docSnap) => {
    const data = docSnap.data();

    const subs = data.subscribers;
    const count = data.count;

    return {
      keyword: docSnap.id,
      subscribers: subs,
      count,
    };
  });

  return keywords;
};

export const getAnalysisDocData = async (docId: string) => {
  const analysisDocRef = doc(firestore, "postAnalyses", docId);
  const analysisDocSnap = await getDoc(analysisDocRef);

  if (!analysisDocSnap.exists()) {
    throw new Error("No analysis snapshot");
  }

  return analysisDocSnap.data();
};
