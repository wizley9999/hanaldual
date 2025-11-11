import { useParams } from "react-router";
import { Toaster } from "./ui/sonner";
import { useEffect, useState } from "react";
import { Timestamp, type DocumentData } from "firebase/firestore";
import { getAnalysisDocData, updateUserData } from "@/lib/firestore";
import { Spinner } from "./ui/spinner";
import SummaryDialog from "./summary-dialog";
import { auth } from "@/lib/firebase";

export default function Post() {
  const { analysisId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<DocumentData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!analysisId) {
          setError(true);
          return;
        }
        const data = await getAnalysisDocData(analysisId);
        setData(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    const updateLastActive = async () => {
      if (!auth.currentUser) {
        return;
      }

      await updateUserData(
        auth.currentUser.uid,
        "lastActiveAt",
        Timestamp.fromDate(new Date())
      );
    };

    fetchData();
    updateLastActive();
  }, []);

  if (loading) {
    return (
      <div className="bg-background w-full min-h-dvh flex flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="px-6 text-muted-foreground text-sm text-center flex flex-col min-h-dvh items-center justify-center">
          <span>데이터를 불러오는 중에 오류가 발생했습니다.</span>
        </div>
      )}

      {data && (
        <>
          <iframe src={data.link} className="w-full h-screen" />

          <SummaryDialog
            content={data.content}
            keywords={data.matchedKeywords}
          />
        </>
      )}

      <Toaster />
    </>
  );
}
