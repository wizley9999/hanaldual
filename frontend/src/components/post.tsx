import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { serverTimestamp, type DocumentData } from "firebase/firestore";
import { Toaster } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import SummaryDialog from "@/components/summary-dialog";
import { getAnalysisDocData, upsertUserData } from "@/lib/firestore";

export default function Post() {
  const { analysisId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<DocumentData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!analysisId) {
          throw new Error("Missing analysis ID");
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
      if (!token) {
        return;
      }

      await upsertUserData(token, "lastActiveAt", serverTimestamp());
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
          <span>데이터를 불러오는 중 오류가 발생했습니다.</span>
        </div>
      )}

      {data && (
        <>
          <iframe src={data.link} className="w-full h-screen" />

          <SummaryDialog content={data.content} />
        </>
      )}

      <Toaster />
    </>
  );
}
