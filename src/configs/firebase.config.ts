import * as admin from "firebase-admin";
import path from "path";
import { getAssetsPath } from "../helpers/path.helpers";

var serviceAccount = require(getAssetsPath(
  "lead-aipdf-firebase-adminsdk-jwn2m-192503fe8f.json"
));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
