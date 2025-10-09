import { useEffect } from "react";

import { initApiClient } from "@/shared/api";
import { postMsg } from "@/shared/utils";

export default () => {
  useEffect(() => {
    postMsg("init");
  }, []);

  const messageHandler = (e: MessageEvent) => {
    if (e.data.action === "init") {
      const { baseUrl: API_BASE_URL, apiKey: API_KEY } = e.data.payload;
      if (!API_BASE_URL || !API_KEY) {
        console.error("API_BASE_URL or API_KEY is not set");
        return;
      }

      initApiClient(API_BASE_URL, API_KEY);
    }
  };

  useEffect(() => {
    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, []);

  return null;
};
