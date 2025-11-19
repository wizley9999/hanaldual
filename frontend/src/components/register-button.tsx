import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { getFCMToken } from "@/lib/messaging";
import { upsertUserData } from "@/lib/firestore";
import { toast } from "sonner";
import { serverTimestamp } from "firebase/firestore";

export default function RegisterButton() {
  const isAndroid = /Android/.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isInStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone;

  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && <Spinner />}

      {!loading && (
        <Button
          onClick={async () => {
            setLoading(true);

            if (!isInStandalone) {
              if (isIOS) {
                alert(
                  "홈 화면에 추가 후 다시 실행해주세요.\n브라우저 공유 버튼 > '홈 화면에 추가'"
                );

                setLoading(false);
                return;
              }

              if (isAndroid) {
                const installPrompt = (window as any).deferredInstallPrompt;

                if (installPrompt) {
                  await installPrompt.prompt();
                } else {
                  alert(
                    "홈 화면에 추가 후 다시 실행해주세요.\n브라우저 공유 버튼 > '홈 화면에 추가'"
                  );
                }

                setLoading(false);
                return;
              }
            }

            try {
              const token = await getFCMToken();
              await upsertUserData(token, "lastActiveAt", serverTimestamp());

              toast.success("만나서 반가워요!", {
                description: "토큰 등록이 완료되었어요.",
                position: "top-center",
                action: {
                  label: "준비완료",
                  onClick: () => {},
                },
              });
            } catch (error: any) {
              toast.error(error.message, {
                position: "top-center",
              });
            } finally {
              setLoading(false);
            }
          }}
          size="sm"
          className="bg-blue-500 hover:bg-blue-400"
        >
          <div className="flex gap-1 items-center animate-pulse">
            <ArrowRight className="size-3" />
            <span>누르면 끝</span>
            <ArrowLeft className="size-3" />
          </div>
        </Button>
      )}
    </>
  );
}
