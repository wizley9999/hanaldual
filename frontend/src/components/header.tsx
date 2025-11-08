import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import hanaldualLogo from "../assets/hanaldual.svg";
import githubLogo from "../assets/github.svg";
import { Spinner } from "./ui/spinner";
import AuthButton from "./auth-button";

export default function Header() {
  return (
    <header className="sticky top-0 h-14 w-full bg-background">
      <div className="max-w-6xl mx-auto w-full h-full px-6 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2.5 py-0.5">
          <img src={hanaldualLogo} alt="Hanaldual logo" />

          <span className="text-lg leading-none font-medium">한알두알</span>
        </a>

        <div className="flex items-center gap-2">
          {/* GitHub */}
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com/wizley9999/hanaldual" target="_blank">
              <img src={githubLogo} alt="GitHub logo" />
            </a>
          </Button>

          <div className="h-4">
            <Separator orientation="vertical" />
          </div>

          {/* Auth */}
          <AuthButton
            spinner={() => (
              <div className="w-9 h-9 flex items-center justify-center">
                <Spinner />
              </div>
            )}
            signIn={({ onClick }) => (
              <Button onClick={onClick} size="sm">
                <span className="text-primary-foreground whitespace-nowrap text-sm font-medium">
                  로그인 하기
                </span>
              </Button>
            )}
            authorized={({ onClick }) => (
              <Button
                onClick={onClick}
                size="sm"
                className="bg-blue-500 hover:bg-blue-400"
              >
                <span className="text-primary-foreground whitespace-nowrap text-sm font-medium">
                  시작하기
                </span>
              </Button>
            )}
          />
        </div>
      </div>
    </header>
  );
}
