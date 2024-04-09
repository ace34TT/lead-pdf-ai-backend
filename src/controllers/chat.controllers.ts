import { Request, Response } from "express";
import axios from "axios";
import { deleteFile, fileToBase64 } from "../helpers/file.helpers";
import { firebase } from "../configs/firebase.config";
import { publicca } from "googleapis/build/src/apis/publicca";
const firestore = firebase.firestore();
export const setupFileHandler = async (req: Request, res: Response) => {
  try {
    const [fileType, fileId, document, filename] = [
      req.body.file_type,
      req.body.file_id,
      req.file,
      req.body.filename,
    ];
    // console.log(document);
    if (!fileType || !fileId) {
      throw new Error("Invalid data");
    }
    let response;
    let base64 = "";
    switch (fileType) {
      case "pdf":
        if (!document) throw new Error("invalid data");
        base64 = await fileToBase64(document.filename);
        // console.log("la valeur en base 64 est : ", base64);
        response = await axios.post(
          "https://stage.aipdf.ai/ai-server/api/process-data-pdf",
          {
            file_id: fileId,
            pdf_data_b64: base64,
            pdf_filename: filename,
          }
        );
        break;
      case "epub":
        console.log("process epub");
        if (!document) throw new Error("invalid data");
        base64 = await fileToBase64(document.filename);
        response = await axios.post(
          "https://stage.aipdf.ai/ai-server/api/process-data-epub",
          {
            file_id: fileId,
            epub_data_b64: base64,
            epub_filename: filename,
          }
        );
        break;
      case "url":
        console.log("processing url");
        const url = req.body.url;
        response = await axios.post(
          "https://stage.aipdf.ai/ai-server/api/process-data-url",
          {
            file_id: fileId,
            url,
          }
        );
        break;
      default:
        break;
    }
    if (document) deleteFile(document.filename);
    console.log("Chat initialized");
    return res.status(200).send("Chat initialized");
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const initChatHandler = async (req: Request, res: Response) => {
  try {
    const data = {
      chat_id: req.body.chat_id,
      query: req.body.query,
      file_id: req.body.file_id,
      demo_chat: req.body.demo_chat,
      is_suggested_question: true,
    };
    console.log("initializing chat");
    console.log(data);
    const response = await axios.post(
      "https://stage.aipdf.ai/ai-server/api/chat-initial",
      data
    );
    console.log(response.data);
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.log("there was an error");
    // console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const regularChatHandler = async (req: Request, res: Response) => {
  try {
    const data = {
      chat_id: req.body.chat_id,
      query: req.body.query,
      file_id: req.body.file_id,
      doc_lang: req.body.doc_lang,
      conversation: req.body.conversation,
      is_suggested_question: req.body.is_suggested_question,
    };
    console.log(data);
    const response = await axios.post(
      "https://stage.aipdf.ai/ai-server/api/chat-continue",
      data
    );
    console.log("here is the result");
    console.log(response.data);
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.log("there was an error");
    // console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const getDocumentList = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email) throw new Error("invalide data ");
    console.log(email);

    const pdfsRef = firestore.collection("pdfs");
    const pdfsSnapshot = await pdfsRef.where("email_id", "==", email).get();

    const pdfDocs = pdfsSnapshot.docs;
    const pdfData: any[] = [];
    pdfDocs.forEach((element) => {
      pdfData.push({ ...element.data(), _id: element.id });
    });
    console.log(pdfData);
    return res.status(200).json(pdfData);
  } catch (error) {
    console.log("there was  an error ");
    console.error(error);
    return res.status(500).send("Failed processing this task ");
  }
};

export const getChatList = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email) throw new Error("invalide data ");
    console.log(email);

    const pdfsRef = firestore.collection("pdfs");
    const pdfsSnapshot = await pdfsRef.where("email_id", "==", email).get();

    let pdfIds = pdfsSnapshot.docs.map((doc) => doc.id);
    const pdfDocs = pdfsSnapshot.docs;
    const pdfData: any[] = [];
    pdfDocs.forEach((element) => {
      pdfData.push({ ...element.data(), _id: element.id });
    });
    console.log(pdfData);

    let results: any[] = [];
    let chunks = [];
    for (let i = 0; i < pdfIds.length; i += 10) {
      chunks.push(pdfIds.slice(i, i + 10));
    }
    for (let chunk of chunks) {
      const chatsRef = firestore.collection("chats");
      const chatSnapshot = await chatsRef.where("file_id", "in", chunk).get();
      chatSnapshot.forEach((chatDoc) => {
        const chatData = chatDoc.data();
        const docsData = pdfsSnapshot.docs
          .find((doc) => doc.id === chatData.file_id)!
          .data();
        let result = {
          docId: chatData.file_id,
          docName: docsData.pdf_filename,
          chatId: chatDoc.id,
          title: chatData.conversation
            ? chatData.conversation[1].title || ""
            : "",
          created_at: docsData.created_at,
        };
        results.push(result);
      });
    }
    console.log(results);
    return res.status(200).json(results);
  } catch (error) {
    console.log("there was  an error ");
    console.error(error);
    return res.status(500).send("Failed processing this task ");
  }
};
export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { docId } = req.query;
    console.log(docId);

    const docRef = firestore.collection("pdfs").doc(docId as string);
    let _query = firestore.collection("chats").where("file_id", "==", docId);
    let _snapshot = await _query.get();
    for (const _doc of _snapshot.docs) {
      try {
        await _doc.ref.delete();
        console.log(`Deleted document ${_doc.id}`);
      } catch (error) {
        console.log(`Error deleting document ${_doc.id}:`, error);
      }
    }
    docRef.delete();
  } catch (error) {
    console.log("there was  an error ");
    console.error(error);
    return res.status(500).send("Failed processing this task ");
  }
};
