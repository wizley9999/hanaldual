import type { User } from "firebase/auth";
import { Compass, Heart, Settings } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import BrowserGate from "./tabs/browser-gate";
import Setting from "./tabs/setting";
import PopularKeywords from "./tabs/popular-keywords";

const tabs = [
  {
    name: "알림 등록",
    value: "compass",
    icon: Compass,
    content: <BrowserGate />,
  },
  {
    name: "인기 키워드",
    value: "heart",
    icon: Heart,
    content: <PopularKeywords />,
  },
  {
    name: "설정",
    value: "settings",
    icon: Settings,
    content: <Setting />,
  },
];

export default function User() {
  return (
    <div className="w-full sm:max-w-2xl">
      <Tabs defaultValue={tabs[0].value} className="gap-4">
        <TabsList className="w-full bg-background shadow-sm py-5">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-4"
            >
              <tab.icon className="h-5 w-5 sm:me-2" />
              <span className="sm:inline hidden">{tab.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <Card className="w-full h-150">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription className="break-keep">
              탭을 통해 알림 등록, 인기 키워드, 설정 정보를 손쉽게 이동하며
              한곳에서 관리할 수 있습니다.
            </CardDescription>
          </CardHeader>

          <div className="px-6">
            <Separator />
          </div>

          {tabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="flex h-full"
            >
              {tab.content}
            </TabsContent>
          ))}
        </Card>
      </Tabs>
    </div>
  );
}
