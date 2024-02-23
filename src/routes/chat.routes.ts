import express from "express";
import {
  initChatHandler,
  setupFileHandler,
  regularChatHandler,
} from "../controllers/chat.controllers";
import upload from "../middlewares/multer.middleware";

const router = express.Router();

router.post("/setup-file", upload.single("file"), setupFileHandler);
router.post("/init", initChatHandler);
router.post("/regular", regularChatHandler);
export { router as ChatRoutes };
