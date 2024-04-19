import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { ChatRoutes } from "./routes/chat.routes";
import { FirebaseRoutes } from "./routes/firebase.routes";
// import { OAuth2Client } from "./configs/googlecloud.config";

const app = express();
app.use(
  cors({
    // credentials: true,
    origin: true,
  })
);
app.use(bodyParser.json());
app.get("/", async (req: Request, res: Response) => {
  return res.json({
    message: "Hello world",
  });
});
app.use("/api/chat/", ChatRoutes);
app.use("/api/firebase", FirebaseRoutes);
// app.get("/auth/google/callback", async (req, res) => {
//   try {
//     const { code } = req.query;
//     const { tokens } = await OAuth2Client.getToken(code as string);
//     OAuth2Client.setCredentials(tokens);
//     res.send("Authentication successful");
//   } catch (error) {
//     console.error("Error during authentication", error);
//     res.status(500).send("Error during authentication");
//   }
// });
export { app };
