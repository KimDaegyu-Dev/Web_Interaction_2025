import { useEffect, useState } from "react";
import { useDebugMode } from "../utils";

async function initMsw() {
  if (typeof window !== "undefined") {
    const { worker } = await import("./browser");
    await worker.start();
  } else {
    // const { server } = await import("./server");
    // server.listen();
    const { worker } = await import("./browser");
    await worker.start();
  }
}

export default function WithMockServer() {
  const [ready, setReady] = useState(false);
  const debugMode = useDebugMode();

  // debugMode가 false로 변경되면 ready 상태를 초기화
  useEffect(() => {
    if (!debugMode) {
      setReady(false);
    }
  }, [debugMode]);

  useEffect(() => {
    const shouldMock = import.meta.env.MODE === "development" && debugMode;

    if (!shouldMock) return;

    const init = async () => {
      await initMsw();
      setReady(true);
    };

    if (!ready) {
      init();
    }
  }, [ready, debugMode]);

  if (!ready && import.meta.env.MODE === "development" && debugMode) {
    return (
      <p className="text-sm text-gray-500">🧪 Mock server initializing...</p>
    );
  }

  if (ready && import.meta.env.MODE === "development" && debugMode) {
    return <p className="text-sm text-gray-500">🎉 Mock server initialized</p>;
  }

  return null;
}
