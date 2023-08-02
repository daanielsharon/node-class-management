import { app } from "./app/web.ts";

const port: number = 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
