import express from "express";
import {
  initChatHandler,
  setupFileHandler,
  regularChatHandler,
} from "../controllers/chat.controllers";

const router = express.Router();

router.post("/setup-file", setupFileHandler);
router.post("/init", initChatHandler);
router.post("/regular", regularChatHandler);
export { router as ChatRoutes };
