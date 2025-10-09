import html_submitter from "@distui/sp_submitter/submitter/index.html?raw";

import { GlobalThis, MouseEventProps } from "@/shared/reearthTypes";

type WidgetProperty = { api?: { base_url?: string; api_key?: string } };
type UIMessage =
  | {
      action: "init";
    }
  | {
      action: "startPickLocation";
    }
  | {
      action: "cleanup";
    };

const reearth = (globalThis as unknown as GlobalThis).reearth;

const API_BASE_URL =
  (reearth.extension.widget?.property as WidgetProperty)?.api?.base_url || "";
const API_KEY =
  (reearth.extension.widget?.property as WidgetProperty)?.api?.api_key || "";

reearth.ui.show(html_submitter);

let tempLayerId: string | undefined = undefined;

const locationPicker = (e: MouseEventProps) => {
  reearth.ui.postMessage({
    action: "locationPicked",
    payload: { lng: e.lng, lat: e.lat },
  });

  if (tempLayerId) {
    reearth.layers.delete?.(tempLayerId);
    tempLayerId = undefined;
  }

  tempLayerId = reearth.layers.add({
    type: "simple",
    data: {
      type: "geojson",
      value: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              coordinates: [e.lng, e.lat],
              type: "Point",
            },
          },
        ],
      },
    },
    marker: {},
  });
};

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
  } else if (msg.action === "startPickLocation") {
    reearth.viewer.on("click", locationPicker, { once: true });
  } else if (msg.action === "cleanup") {
    if (tempLayerId) {
      reearth.layers.delete?.(tempLayerId);
      tempLayerId = undefined;
    }

    // post message to viewer to reload
    const extensions = reearth.extension.list;
    const target = extensions.find((ext) => ext.extensionId === "sp_viewer");
    if (target) {
      reearth.extension.postMessage?.(target.id, "reload");
    }
  }
});
