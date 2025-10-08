import { useEffect } from "react";

import { initApiClient, photographsApi } from "@/shared/api";
import { postMsg } from "@/shared/utils";

export default () => {
  useEffect(() => {
    postMsg("init");
  }, []);

  useEffect(() => {
    return window.addEventListener("message", (e) => {
      if (e.data.action === "init") {
        console.log("Initialized with payload:", e.data.payload);
        const { baseUrl: API_BASE_URL, apiKey: API_KEY } = e.data.payload;
        if (!API_BASE_URL || !API_KEY) {
          console.warn(
            "Street Photography Loader: API_BASE_URL or API_KEY is not set in the widget properties."
          );
          return;
        }
        initApiClient(API_BASE_URL, API_KEY);
        photographsApi.getAll().then((res) => {
          console.log("Fetched photographs:", res);
        });
      }
    });
  }, []);

  return null;
};
