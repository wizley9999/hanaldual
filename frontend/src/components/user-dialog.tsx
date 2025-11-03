import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Settings, Mail, Compass } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import type { User } from "firebase/auth";
import EmailContent from "./dialog-contents/email-content";
import SettingContent from "./dialog-contents/setting-content";
import BrowserGate from "./dialog-contents/browser-gate";

export default function UserDialog({
  user,
  open,
  onOpenChange,
}: {
  user: User;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const tabs = [
    {
      name: "이메일",
      value: "email",
      icon: Mail,
      content: <EmailContent uid={user.uid} />,
    },
    {
      name: "브라우저",
      value: "browser",
      icon: Compass,
      content: <BrowserGate uid={user.uid} />,
    },
    {
      name: "설정",
      value: "settings",
      icon: Settings,
      content: <SettingContent uid={user.uid} />,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" sm:max-w-2xl">
        <DialogTitle>Profile</DialogTitle>
        <DialogDescription className="break-keep">
          이메일 알림과 웹 푸시 알림, 그리고 계정 관련 설정을 한 곳에서 관리할
          수 있습니다.
        </DialogDescription>
        <Tabs
          orientation="vertical"
          defaultValue={tabs[0].value}
          className="w-full flex flex-row items-start gap-4 justify-center pt-2"
        >
          <TabsList className="shrink-0 grid grid-cols-1 gap-1 bg-background">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground justify-start px-3 py-1.5"
              >
                <tab.icon className="h-5 w-5 sm:me-2" />
                <span className="sm:inline hidden">{tab.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="h-110 flex items-center justify-center w-full border rounded-md font-medium">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="h-full flex items-start"
              >
                {tab.content}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
