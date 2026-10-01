import { useEffect, useState } from "react";

const POLLING_INTERVAL = 30 * 1000;

// 대기 일감 개수를 주기적으로 가져오는 훅.
// - 탭이 숨겨져 있으면 요청하지 않고, 다시 보이면 즉시 한 번 가져옴
// - refreshKey(현재 경로)가 바뀌면 즉시 다시 가져옴
// - initialCount는 서버(layout)에서 계산한 값. Server Action의 revalidatePath로 layout이 다시 렌더링되면 그 값으로 맞춤
export const usePendingCount = (initialCount: number, enabled: boolean, refreshKey?: string | null) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    if (!enabled) return;

    const fetchCount = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/pending-count", { cache: "no-store" });
        if (!res.ok) return;
        const data: { count: number } = await res.json();
        setCount(data.count);
      } catch (e) {
        console.error("대기 일감 개수 조회 실패:", e);
      }
    };

    fetchCount();
    const timer = setInterval(fetchCount, POLLING_INTERVAL);
    document.addEventListener("visibilitychange", fetchCount);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", fetchCount);
    };
  }, [enabled, refreshKey]);

  return count;
};
