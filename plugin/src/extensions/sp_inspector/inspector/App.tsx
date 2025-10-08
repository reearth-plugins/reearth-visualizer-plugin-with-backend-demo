import useHooks from "./hooks";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

function App() {
  const { handleAction } = useHooks();

  return (
    <Card>
      <CardHeader>
        <CardTitle>sp_inspector - inspector</CardTitle>
        <CardDescription>
          This is the inspector UI for sp_inspector extension
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleAction}>
          Perform Action
        </Button>
      </CardContent>
    </Card>
  );
}

export default App;
