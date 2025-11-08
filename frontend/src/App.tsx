import Header from "./components/header";
import Introduction from "./components/intoduction";
import { useEffect } from "react";
import { listenForegroundMessages } from "./lib/messaging";
import { Toaster } from "./components/ui/sonner";

function App() {
  useEffect(() => {
    listenForegroundMessages();
  }, []);

  return (
    <>
      <div className="bg-background relative z-10 min-h-dvh flex flex-col">
        <Header />
        <Introduction />
      </div>

      <Toaster />
    </>
  );
}

export default App;
