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
        <CardTitle>sp_submitter - submitter</CardTitle>
        <CardDescription>
          This is the submitter UI for sp_submitter extension
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
