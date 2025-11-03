import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import hanaldualLogo from "../assets/hanaldual.svg";
import githubLogo from "../assets/github.svg";
import Profile from "./profile";
import { UserIcon } from "lucide-react";
import { Spinner } from "./ui/spinner";

export default function Header() {
  return (
    <header className="sticky top-0 h-14 w-full bg-background">
      <div className="w-full h-full px-6 flex justify-between items-center">
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

          {/* Login */}
          <Profile
            loading={() => (
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
            signedIn={({ onClick }) => (
              <Button onClick={onClick} variant="ghost" size="icon">
                <UserIcon />
              </Button>
            )}
          />
        </div>
      </div>
    </header>
  );
}
