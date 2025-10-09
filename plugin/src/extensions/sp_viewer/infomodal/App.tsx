import useHooks from "./hooks";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

function App() {
  const { type, msg } = useHooks();

  return type === "msg" ? (
    <Card>
      <CardHeader>
        <CardTitle>Street Photograph</CardTitle>
      </CardHeader>
      <CardContent>{msg}</CardContent>
    </Card>
  ) : type === "loading" ? (
    <div className="h-10 w-10">
      <div className="flex items-center justify-center h-screen w-screen bg-transparent">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      </div>
    </div>
  ) : null;
}

export default App;
