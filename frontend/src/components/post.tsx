import { useParams } from "react-router";
import Header from "./header";
import { Toaster } from "./ui/sonner";
import { useEffect, useState } from "react";
import type { DocumentData } from "firebase/firestore";
import Footer from "./footer";
import { getAnalysisDocData } from "@/lib/firestore";
import { Spinner } from "./ui/spinner";

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

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-background w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="bg-background relative z-10 min-h-dvh flex flex-col">
        <Header />

        <main className="flex-1 flex flex-col h-full">
          <section className="my-auto flex flex-col items-center gap-2">
            {error && (
              <span className="text-muted-foreground text-sm">
                데이터를 불러오는 도중 에러가 발생했습니다. 주소를 다시
                확인해주세요.
              </span>
            )}

            {data && (
              <>
                <div className="flex flex-col gap-2 text-base text-foreground">
                  <span>{data.content}</span>
                  <span>키워드 평가: {data.matchedKeywords}</span>
                </div>

                <iframe src={data.link} className="w-full h-auto" />
              </>
            )}

            <Footer />
          </section>
        </main>
      </div>

      <Toaster />
    </>
  );
}
