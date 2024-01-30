import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLOUD_CLIENT_ID,
  process.env.GOOGLE_CLOUD_SECRET_KEY,
  "https://749d-197-158-81-123.ngrok-free.app/auth/google/callback"
);

export { oauth2Client as OAuth2Client };
