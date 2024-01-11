import { Request, Response } from "express";
import axios from "axios";
export const setupFileHandler = async (req: Request, res: Response) => {
  try {
    console.log("initializing app with ");
    const [fileType, fileId] = [req.body.file_type, req.body.file_id];
    if (!fileType || !fileId) {
      throw new Error("Invalid data");
    }
    let response;
    switch (fileType) {
      case "pdf":
        console.log("pdf process");
        const [pdfDataB64, pdfFilename] = [
          req.body.pdf_data_b64,
          req.body.pdf_filename,
        ];
        response = await axios.post(
          "https://stage.aipdf.ai/ai-server/api/process-data-pdf",
          {
            file_id: fileId,
            pdf_data_b64: pdfDataB64,
            pdf_filename: pdfFilename,
          }
        );
        break;
      case "epub":
        const [epubDataB64, epubFilename] = [
          req.body.epub_data_b64,
          req.body.epub_filename,
        ];
        response = await axios.post(
          "https://stage.aipdf.ai/ai-server/api/process-data-epub",
          {
            file_id: fileId,
            epub_data_b64: epubDataB64,
            epub_filename: epubFilename,
          }
        );
        break;
      case "url":
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
    console.log(response?.status);
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
    };
    console.log(data);
    const response = await axios.post(
      "https://stage.aipdf.ai/ai-server/api/chat-initial",
      data
    );
    console.log("here is the result ");
    console.log(response.data);
    return res.status(200).send("Chat initialized");
  } catch (error: any) {
    console.log("there was an error");
    console.log(error);
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
    console.log("here is the result ");
    console.log(response.data);
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.log("there was an error");
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
