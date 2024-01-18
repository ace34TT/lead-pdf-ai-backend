import { Request, Response } from "express";
import { firebase } from "../configs/firebase.config";
import { Query } from "@google-cloud/firestore";
const firestore = firebase.firestore();

export const insertDataHandler = async (req: Request, res: Response) => {
  try {
    const [collectionName, data] = [req.body.collectionName, req.body.data];
    if (!collectionName || !data) {
      throw new Error("Invalid data");
    }
    const docRef = await firestore.collection(collectionName).add(data);
    return res.status(200).json({
      id: docRef.id,
    });
  } catch (error) {
    console.log(error);
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
  } catch (error) {}
};
