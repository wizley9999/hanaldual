import { useEffect } from "react";
import { listenForegroundMessages } from "@/lib/messaging";
import hanaldualLogo from "@/assets/hanaldual.svg";
import githubLogo from "@/assets/github.svg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { ArrowRight } from "lucide-react";
import RegisterButton from "@/components/register-button";

function App() {
  useEffect(() => {
    listenForegroundMessages();
  }, []);

  return (
    <>
      <div className="bg-background relative z-10 min-h-dvh flex flex-col">
        {/* Header */}
        <header className="sticky top-0 h-14 w-full bg-background">
          <div className="max-w-6xl mx-auto w-full h-full px-6 flex justify-between items-center">
            <a href="/" className="flex items-center gap-2.5 py-0.5">
              <img src={hanaldualLogo} alt="Hanaldual logo" />

              <span className="text-lg leading-none font-medium">한알두알</span>
            </a>

            {/* GitHub */}
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com/wizley9999/hanaldual" target="_blank">
                <img src={githubLogo} alt="GitHub logo" />
              </a>
            </Button>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col h-full">
          <section className="my-auto flex flex-col items-center gap-2 px-4 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
            <Badge variant="secondary" className="bg-transparent" asChild>
              <a href="https://blog.wizley.io" target="_blank">
                <span className="flex size-2 rounded-full bg-blue-500" />

                <div className="text-[11px] sm:text-xs font-medium whitespace-nowrap text-secondary-foreground">
                  자세한 이야기와 기술 노트는 개발자 블로그에서 확인해보세요!
                </div>

                <ArrowRight />
              </a>
            </Badge>

            <h1 className="text-primary leading-tight max-w-2xl text-3xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-4xl xl:tracking-tighter break-keep">
              한성대학교 공지사항 알리미
            </h1>

            <p className="text-foreground max-w-3xl text-sm text-balance sm:text-base break-keep">
              새로운 공지사항을 실시간으로 수집하고 AI로 분석해 소식을
              전해드립니다.
              <br />
              모니터링 없이, 원클릭으로 새로운 소식만 정확하게 받아보세요.
            </p>

            <div className="pt-2 flex gap-2 items-center">
              <RegisterButton />

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  window.location.href = "mailto:wizley9999@gmail.com";
                }}
              >
                문의하기
              </Button>
            </div>
          </section>

          {/* Footer */}
          <footer className="h-14 w-full bg-background">
            <div className="w-full h-full px-6 flex justify-center items-center">
              <div className="text-muted-foreground w-full px-1 text-center text-xs leading-loose sm:text-sm">
                Built by
                <a
                  className="ml-1 font-medium underline underline-offset-4"
                  href="https://github.com/wizley9999"
                  target="_blank"
                >
                  Wizley
                </a>
                . The source code is available on
                <a
                  className="ml-1 font-medium underline underline-offset-4"
                  href="https://github.com/wizley9999/hanaldual"
                  target="_blank"
                >
                  GitHub
                </a>
                .
              </div>
            </div>
          </footer>
        </main>
      </div>

      <Toaster />
    </>
  );
}

export default App;
