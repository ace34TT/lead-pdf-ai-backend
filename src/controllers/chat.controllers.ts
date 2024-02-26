import { Request, Response } from "express";
import axios from "axios";
import { deleteFile, fileToBase64 } from "../helpers/file.helpers";
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
    return res.status(200).send("Chat initialized");
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
