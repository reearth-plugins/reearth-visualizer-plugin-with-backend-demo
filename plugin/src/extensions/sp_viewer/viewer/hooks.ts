import { useEffect } from "react";

import { initApiClient, photographsApi } from "@/shared/api";
import { postMsg } from "@/shared/utils";

export default () => {
  useEffect(() => {
    postMsg("init");
  }, []);

  const messageHandler = (e: MessageEvent) => {
    if (e.data.action === "init") {
      const { baseUrl: API_BASE_URL, apiKey: API_KEY } = e.data.payload;
      if (!API_BASE_URL || !API_KEY) {
        setTimeout(() => {
          postMsg("error", { error: "API_BASE_URL or API_KEY is not set" });
        }, 1000);
        return;
      }

      initApiClient(API_BASE_URL, API_KEY);

      photographsApi
        .getAll()
        .then((res) => {
          postMsg("data", res.data);
        })
        .catch(() => {
          postMsg("error", { error: "Failed to fetch data from the API" });
        });
    }
  };

  useEffect(() => {
    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, []);

  return null;
};
