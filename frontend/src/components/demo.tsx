import { Compass, Mail, Settings } from "lucide-react";
import { Card, CardDescription, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function Demo() {
  const tabs = [
    {
      name: "이메일",
      value: "email",
      icon: Mail,
      content: (
        <div className="flex flex-col w-full h-full items-center justify-center font-normal text-xs gap-2 text-muted-foreground text-center break-keep px-4">
          <span className="block">
            AI가 분석한 공지사항 중 관심 키워드에 맞는 내용만 이메일로
            전달합니다.
          </span>

          <span className="block">
            원하는 키워드를 자유롭게 등록하고, 불필요한 알림은 즉시 구독 해제할
            수 있습니다.
          </span>

          <span className="block">
            매번 사이트를 확인할 필요 없이, 중요한 공지만 깔끔하게 메일함에서
            받아보세요.
          </span>
        </div>
      ),
    },
    {
      name: "브라우저",
      value: "browser",
      icon: Compass,
      content: (
        <div className="flex flex-col w-full h-full items-center justify-center font-normal text-xs gap-1 text-muted-foreground text-center break-keep px-4">
          <span className="block">
            공지사항이 올라오면 푸시 알림으로 받아볼 수 있습니다.
          </span>

          <span className="block">
            PWA 기반으로 작동하며 PC의 경우 별도 앱 설치 없이 크롬, 엣지, 사파리
            등 주요 브라우저에서 바로 동작합니다.
          </span>

          <span className="block">
            (모바일의 경우 설치가 필요합니다. 브라우저 공유 버튼 &gt; '홈 화면에
            추가')
          </span>
        </div>
      ),
    },
    {
      name: "설정",
      value: "settings",
      icon: Settings,
      content: (
        <div className="flex flex-col w-full h-full items-center justify-center font-normal text-xs gap-1 text-muted-foreground text-center break-keep px-4">
          <span className="block">저는 아샷추 좋아합니다.</span>
        </div>
      ),
    },
  ];

  return (
    <Card className="w-full sm:max-w-2xl p-6">
      <CardTitle>Demo</CardTitle>
      <CardDescription className="break-keep">
        이메일 알림과 웹 푸시 알림, 그리고 계정 관련 설정을 한 곳에서 관리할 수
        있습니다.
      </CardDescription>

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
    </Card>
  );
}
