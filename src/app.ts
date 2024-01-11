import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { ChatRoutes } from "./routes/chat.routes";

const app = express();
app.use(
  cors({
    // credentials: true,
    // origin: true,
  })
);
app.use(bodyParser.json());
app.get("/", async (req: Request, res: Response) => {
  return res.json({
    message: "Hello world",
  });
});
app.use("/api/chat/", ChatRoutes);

export { app };