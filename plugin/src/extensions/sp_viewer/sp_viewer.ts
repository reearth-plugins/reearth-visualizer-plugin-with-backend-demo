import html_viewer from "@distui/sp_viewer/viewer/index.html?raw";

import { hideLoading, showError, showLoading } from "./infomodal";
import { addLayersByData } from "./layers";

import { Photograph } from "@/shared/api";
import { GlobalThis } from "@/shared/reearthTypes";

type WidgetProperty = { api?: { base_url?: string; api_key?: string } };
type UIMessage =
  | {
      action: "init";
    }
  | {
      action: "data";
      payload: Photograph[] | undefined;
    }
  | { action: "error"; payload: { error: string } };

const reearth = (globalThis as unknown as GlobalThis).reearth;

const API_BASE_URL =
  (reearth.extension.widget?.property as WidgetProperty)?.api?.base_url || "";
const API_KEY =
  (reearth.extension.widget?.property as WidgetProperty)?.api?.api_key || "";

reearth.ui.show(html_viewer);

reearth.extension.on("message", (message: unknown) => {
  const msg = message as UIMessage;
  showLoading();

  if (msg.action === "init") {
    reearth.ui.postMessage({
      action: "init",
      payload: {
        baseUrl: API_BASE_URL,
        apiKey: API_KEY,
      },
    });
  } else if (msg.action === "data") {
    hideLoading();

    const data = msg.payload;
    addLayersByData(data);
  } else if (msg.action === "error") {
    showError(msg.payload.error);
  }
});

reearth.extension.on("extensionMessage", (msg) => {
  if (msg.data === "reload") {
    reearth.ui.postMessage({
      action: "init",
      payload: {
        baseUrl: API_BASE_URL,
        apiKey: API_KEY,
      },
    });
  }
});
