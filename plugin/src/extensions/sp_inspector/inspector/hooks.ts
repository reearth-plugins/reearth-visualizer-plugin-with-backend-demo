import { useCallback } from "react";

import { postMsg } from "@/shared/utils";

export default () => {
  const handleAction = useCallback(() => {
    postMsg("action", { from: "inspector" });
  }, []);

  return {
    handleAction,
  };
};
