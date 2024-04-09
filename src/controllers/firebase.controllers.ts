import { Request, Response } from "express";
import { firebase } from "../configs/firebase.config";
import { Query } from "@google-cloud/firestore";
import { sendMail } from "../configs/nodemail.config";
const firestore = firebase.firestore();

export const insertDataHandler = async (req: Request, res: Response) => {
  try {
    const [collectionName, data] = [req.body.collectionName, req.body.data];
    if (!collectionName || !data) {
      throw new Error("Invalid data");
    }
    const docRef = await firestore.collection(collectionName).add(data);
    console.log("document inserted with id : ", docRef.id);
    return res.status(200).json({
      id: docRef.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
export const findDataHandler = async (req: Request, res: Response) => {
  try {
    console.log("finding");
    const [collectionName, conditions] = [
      req.body.collectionName,
      req.body.conditions,
    ];
    if (!collectionName) {
      throw new Error("Invalid data");
    }
    let query: Query = firestore.collection(collectionName);
    conditions.forEach((condition: any) => {
      query = query.where(condition.field, condition.operator, condition.value);
    });
    const snapshot = await query.get();
    const results: any[] = [];
    snapshot.forEach((doc) => {
      results.push({ _id: doc.id, ...doc.data() });
    });
    // console.log(results);
    // Send the results as a response
    res.status(200).json({
      results: results,
    });
  } catch (error) {
    console.error("Error in findDataHandler: ", error);
    res.status(500).send(error);
  }
};
export const updateDataHandler = async (req: Request, res: Response) => {
  try {
    console.log("updating");
    const [collectionName, docId, data] = [
      req.body.collectionName,
      req.body.docId,
      req.body.data,
    ];
    console.log(collectionName, docId, data);

    const docRef = firestore.collection(collectionName).doc(docId);
    // Update the document
    await docRef.update(data);

    return res.status(200).send("document updated successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
export const findDocumentById = async (req: Request, res: Response) => {
  try {
    const [collectionName, documentId] = [
      req.body.collectionName,
      req.body.docId,
    ];
    console.log(collectionName, documentId);

    const docRef = firestore.collection(collectionName).doc(documentId);
    // Get the document
    const doc = await docRef.get();

    if (doc.exists) {
      return res.status(200).json({
        data: doc.data(),
      });
    } else {
      return res.status(500).json({
        message: "No such document!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
export const deleteDocumentByIdHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const [collectionName, docId] = [req.body.collectionName, req.body.docId];
    const docRef = firestore.collection(collectionName).doc(docId);
    docRef.delete();
    return res.status(200).send("document deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
export const deleteUserHandler = async (req: Request, res: Response) => {
  const [uid, email] = [req.body.uid, req.body.email];
  try {
    let query = firestore.collection("pdfs").where("email_id", "==", email);
    let snapshot = await query.get();

    for (const doc of snapshot.docs) {
      let _query = firestore.collection("chats").where("file_id", "==", doc.id);
      let _snapshot = await _query.get();

      for (const _doc of _snapshot.docs) {
        console.log("--------" + _doc.id);
        try {
          await _doc.ref.delete();
          console.log(`Deleted document ${_doc.id}`);
        } catch (error) {
          console.log(`Error deleting document ${_doc.id}:`, error);
        }
      }
      try {
        await doc.ref.delete();
        console.log(`Deleted document ${doc.id}`);
      } catch (error) {
        console.log(`Error deleting document ${doc.id}:`, error);
      }
    }
    firebase.auth().deleteUser(uid);
    return res.status(200).send("user deleted successfully");
  } catch (error) {
    console.log("Error getting documents:", error);
  }
};
export const signInUserWithEmailLinkHandler = async (
  req: Request,
  res: Response
) => {
  const [email] = [req.body.email];
  console.log("processing with " + email);
  try {
    var link = await firebase.auth().generateSignInWithEmailLink(email, {
      url: "http://localhost:5173",
      handleCodeInApp: true,
      iOS: {
        bundleId: "com.shiftmadagascar.aipdf",
      },
      android: {
        packageName: "com.shiftmadagascar.aipdf",
        installApp: true,
        minimumVersion: "12",
      },
      dynamicLinkDomain: "shiftmadagascar.page.link",
    });
    console.log(link);
    sendMail(email, [link]);
    return res.status(200).send("process done");
  } catch (error) {
    console.log(error);
    return res.status(500).send("process error: " + error);
  }
};
