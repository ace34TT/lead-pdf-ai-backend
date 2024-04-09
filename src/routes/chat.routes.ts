import express from "express";
import {
  initChatHandler,
  setupFileHandler,
  regularChatHandler,
  getDocumentList,
  getChatList,
  deleteDocument,
} from "../controllers/chat.controllers";
import upload from "../middlewares/multer.middleware";
import { speechToTextHandler } from "../controllers/replicates.controllers";

const router = express.Router();

router.post("/setup-file", upload.single("file"), setupFileHandler);
router.post("/init", initChatHandler);
router.post("/regular", regularChatHandler);
router.get("/documents", getDocumentList);
router.get("/chats", getChatList);
router.post("/speech-to-text", speechToTextHandler);
router.delete("/", deleteDocument);
export { router as ChatRoutes };
