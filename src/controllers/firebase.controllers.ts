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
    query
      .get()
      .then((snapshot) => {
        const results: any[] = [];
        snapshot.forEach((doc) => {
          results.push({ _id: doc.id, ...doc.data() });
        });
        // Send the results as a response
        res.status(200).json({
          data: results,
        });
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
        res.status(500).send(error);
      });
  } catch (error) {
    console.error("Error in findDataHandler: ", error);
    res.status(500).send(error);
  }
};
export const updateDataHandler = async (req: Request, res: Response) => {
  try {
    const [collectionName, docId, data] = [
      req.body.collectionName,
      req.body.docId,
      req.body.data,
    ];
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
    const docRef = firestore.collection(collectionName).doc(documentId);
    // Get the document
    const doc = await docRef.get();

    if (doc.exists) {
      return res.status(200).json({
        data: doc.data(),
      });
    } else {
      return res.status(404).json({
        message: "No such document!",
      });
    }
  } catch (error) {}
};
