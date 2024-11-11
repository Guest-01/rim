import { useEffect, useRef } from "react";

export const useSSE = (onData: (data: string) => void) => {
  const evtSource = useRef<EventSource | null>(null);

  useEffect(() => {
    evtSource.current = new EventSource('/api/sse');

    evtSource.current.addEventListener("message", ({ data }) => {
      console.log("evtSource msg:", data);
      onData(data); // 전달된 함수를 호출하여 데이터를 처리
    });

    evtSource.current.addEventListener("error", (ev) => {
      console.error("SSE error:", ev);
    });

    return () => {
      console.log("SSE closed");
      evtSource.current?.close();
    };
  }, [onData]);
};
