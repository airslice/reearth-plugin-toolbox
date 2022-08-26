import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    (globalThis as any).addEventListener("message", (msg: any) => {
      if (msg.source !== (globalThis as any).parent) return;
      console.log("mousemove with react");
    });
  }, []);

  return <div>Event Tester</div>;
};

export default App;
