import { useEffect, useState } from "react";

export default () => {
  const [type, setType] = useState<"empty" | "loading" | "msg">("loading");
  const [msg, setMsg] = useState<string>("");

  const messageHandler = (e: MessageEvent) => {
    if (e.data.action === "update") {
      const { type, msg } = e.data.payload;
      setType(type);
      setMsg(msg);
    }
  };

  useEffect(() => {
    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, []);

  return {
    type,
    msg,
  };
};
