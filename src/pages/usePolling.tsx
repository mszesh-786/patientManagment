import { set } from "date-fns";
import { abort } from "process";
import React, { useEffect } from "react";
type Trade = { id: string; symbol: string; pnl: number; updatedAt: number };
type ApiResponse = { trades: Trade[] };
const mockTrades: Trade[] = [
  { id: "1", symbol: "AAPL", pnl: 150,  updatedAt: Date.now() },
  { id: "2", symbol: "TSLA", pnl: -320, updatedAt: Date.now() },
  { id: "3", symbol: "MSFT", pnl: 80,   updatedAt: Date.now() },
];

// override fetch globally
window.fetch = (url: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        json: async () => ({ trades: mockTrades }),
      } as Response);
    }, 300); // simulate 300ms network delay
  });
};
function usePolling(url: string, intervalMs: number) {
    const [data, setData] = React.useState<ApiResponse>({ trades: [] });
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

useEffect(() => {
    let isFirst=false;
                const controller = new AbortController();

    const fetchData = async () => {
        try {
            const response = await fetch(url, { signal: controller.signal });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            setLoading(true);
            const jsonData: ApiResponse = await response.json();
            setData(jsonData);
            setError(null);
        }
        catch(err: any)
        {
            setError(err.message);
        } finally {
            setLoading(false);
            isFirst=false;
        }
    }
    fetchData();
    const interval = setInterval(fetchData, intervalMs);
    return () => {
        clearInterval(interval);
        controller.abort();
    };

},[url, intervalMs]);


return {
    data, 
    error, 
    loading
}
}

export default usePolling;