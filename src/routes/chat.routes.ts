import express from "express";
import {
  initChatHandler,
  setupFileHandler,
  regularChatHandler,
  getChatList,
} from "../controllers/chat.controllers";
import upload from "../middlewares/multer.middleware";
import { speechToTextHandler } from "../controllers/replicates.controllers";

const router = express.Router();

router.post("/setup-file", upload.single("file"), setupFileHandler);
router.post("/init", initChatHandler);
router.post("/regular", regularChatHandler);
router.get("/", getChatList);
router.post("/speech-to-text", speechToTextHandler);

export { router as ChatRoutes };
