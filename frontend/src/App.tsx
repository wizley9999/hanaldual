import { Toaster } from "sonner";
import Header from "./components/header";
import Introduction from "./components/intoduction";
import { useEffect } from "react";
import { listenForegroundMessages } from "./lib/messaging";

function App() {
  useEffect(() => {
    listenForegroundMessages();
  }, []);

  return (
    <>
      <div className="bg-background relative z-10 min-h-svh">
        <Header />
        <Introduction />
      </div>
      <Toaster />
    </>
  );
}

export default App;
