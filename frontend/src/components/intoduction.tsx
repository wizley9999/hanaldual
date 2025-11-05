import { ArrowRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Profile from "./profile";
import Footer from "./footer";
import Demo from "./demo";
import PopularKeywords from "./popular-keywords";

export default function Introduction() {
  return (
    <main>
      <section className="flex flex-col items-center gap-2 px-4 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
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
          AI가 새로운 공지사항을 실시간으로 수집하고 분석해, 중요한 소식을
          자동으로 알려드립니다.
          <br />
          복잡한 설정 없이, 필요한 정보만 정확하게 받아보세요.
        </p>

        <div className="pt-2 flex gap-2">
          <Profile
            loading={() => <Button size="sm">바로 시작하기</Button>}
            signIn={({ onClick }) => (
              <Button onClick={onClick} size="sm">
                바로 시작하기
              </Button>
            )}
            signedIn={({ onClick }) => (
              <Button onClick={onClick} size="sm">
                바로 시작하기
              </Button>
            )}
          />

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

      <div className="px-4 w-full flex flex-col items-center pt-2">
        <Demo />
      </div>

      <div className="px-4 w-full flex flex-col items-center pt-18 pb-12">
        <PopularKeywords />
      </div>

      <Footer />
    </main>
  );
}
