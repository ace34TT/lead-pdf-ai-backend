import express from "express";
import {
  deleteDocumentByIdHandler,
  deleteUserHandler,
  findDataHandler,
  findDocumentById,
  insertDataHandler,
  // signInUserWithEmailLinkHandler,
  updateDataHandler,
} from "../controllers/firebase.controllers";

const router = express.Router();

router.post("/insert-document", insertDataHandler);
router.post("/find-documents", findDataHandler);
router.post("/update-document", updateDataHandler);
router.post("/find-document", findDocumentById);
router.post("/delete-document", deleteDocumentByIdHandler);
router.post("/delete-user", deleteUserHandler);
// router.post("/sign-in-with-mail", signInUserWithEmailLinkHandler);
export { router as FirebaseRoutes };
