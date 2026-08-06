import { useEffect, useState } from "react";

interface HealthResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

function App() {
  const [status, setStatus] = useState("Checking API connection...");

  useEffect(() => {
    const controller = new AbortController();

    async function checkApi(): Promise<void> {
      try {
        const response = await fetch(`${apiUrl}/health`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = (await response.json()) as HealthResponse;
        setStatus(`${data.message} — ${data.timestamp}`);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setStatus(
          error instanceof Error
            ? `API unavailable: ${error.message}`
            : "API unavailable"
        );
      }
    }

    void checkApi();

    return () => controller.abort();
  }, []);

  return (
    <main className="app">
      <section className="app__card">
        <h1>MERN TypeScript Starter</h1>
        <p>
          React and Sass are running. The message below verifies the Express and
          MongoDB backend.
        </p>
        <p className="app__status">{status}</p>
      </section>
    </main>
  );
}

export default App;
