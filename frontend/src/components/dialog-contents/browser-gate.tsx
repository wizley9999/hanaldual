import { useEffect, useState } from "react";
import BrowserContent from "./browser-content";
import { Button } from "../ui/button";

export default function BrowserGate({ uid }: { uid: string }) {
  const [canRender, setCanRender] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  const isAndroid = /Android/.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isInStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone;

  useEffect(() => {
    if (isIOS && !isInStandalone) {
      alert(
        "홈 화면에 추가 후 다시 실행해주세요.\n브라우저 공유 버튼 > '홈 화면에 추가'"
      );
      return;
    }

    window.addEventListener("beforeinstallprompt", (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    });

    if (isInStandalone || !isAndroid) {
      setCanRender(true);
    }
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
  };

  if (!canRender) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="flex flex-col gap-1 items-center justify-center text-xs font-normal text-muted-foreground px-4 break-keep text-center">
            <span>모바일에서는 앱 설치 후</span>
            <span>푸시 알림을 받을 수 있습니다.</span>

            <span className="pt-2">설치가 되지 않을 경우</span>
            <span>수동으로 '홈 화면에 추가'를 해주세요.</span>
          </div>

          {isAndroid ? (
            <Button onClick={handleInstall} size="sm">
              설치하기
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }

  return <BrowserContent uid={uid} />;
}
