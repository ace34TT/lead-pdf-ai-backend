import expressListRoutes from "express-list-routes";
import { app } from "./app";
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log("api is deployed");

  expressListRoutes(app);
});
