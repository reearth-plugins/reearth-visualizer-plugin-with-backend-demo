import html_infomodal from "@distui/sp_viewer/infomodal/index.html?raw";

import { GlobalThis } from "@/shared/reearthTypes";

let infomodalVisible = false;

const reearth = (globalThis as unknown as GlobalThis).reearth;

export const showInfomodal = () => {
  if (!infomodalVisible) {
    reearth.modal.show(html_infomodal, {
      background: "#00000080",
    });
    infomodalVisible = true;
  }
};

export const hideInfomodal = () => {
  if (infomodalVisible) {
    reearth.modal.close();
    infomodalVisible = false;
  }
};

export const showLoading = () => {
  showInfomodal();
};

export const hideLoading = () => {
  hideInfomodal();
};

export const showError = (error: string) => {
  showInfomodal();
  reearth.modal.postMessage({
    action: "update",
    payload: { type: "msg", msg: error },
  });
};
