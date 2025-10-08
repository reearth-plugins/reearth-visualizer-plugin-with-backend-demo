import html_loader from "@distui/sp_loader/loader/index.html?raw";

import { GlobalThis } from "@/shared/reearthTypes";

type WidgetProperty = { api?: { base_url?: string; api_key?: string } };
type UIMessage = {
  action: "init";
};

const reearth = (globalThis as unknown as GlobalThis).reearth;

const API_BASE_URL =
  (reearth.extension.widget?.property as WidgetProperty)?.api?.base_url || "";
const API_KEY =
  (reearth.extension.widget?.property as WidgetProperty)?.api?.api_key || "";

reearth.ui.show(html_loader);

reearth.extension.on("message", (message: unknown) => {
  const msg = message as UIMessage;

  if (msg.action === "init") {
    reearth.ui.postMessage({
      action: "init",
      payload: {
        baseUrl: API_BASE_URL,
        apiKey: API_KEY,
      },
    });
  }
});
