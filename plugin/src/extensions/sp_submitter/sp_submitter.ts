import html_submitter from "@distui/sp_submitter/submitter/index.html?raw";

import { GlobalThis } from "@/shared/reearthTypes";

type WidgetProperty = { appearance?: { primary_color?: string } };

const reearth = (globalThis as unknown as GlobalThis).reearth;
reearth.ui.show(html_submitter);

// Get message from UI
reearth.extension.on("message", (message: unknown) => {
  const msg = message as { action: string; payload?: any };
  
  // Handle messages from UI components
  console.log("Received message:", msg);
});
