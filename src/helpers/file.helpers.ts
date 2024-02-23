import fs from "fs";
import path from "path";

const tempDirectory = path.resolve(__dirname, "../tmp/");

export const fileToBase64 = async (filename: string) => {
  try {
    const fileBuffer = await fs.promises.readFile(
      path.resolve(tempDirectory, filename)
    );
    const base64String = fileBuffer.toString("base64");
    return base64String;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const folderGuard = () => {
  if (!fs.existsSync(tempDirectory)) {
    fs.mkdirSync(tempDirectory, { recursive: true });
  }
};
export const deleteFile = async (filename: string) => {
  console.log("deleting : " + path.resolve(tempDirectory, filename));
  fs.unlinkSync(path.resolve(tempDirectory, filename));
};
export const generateRandomString = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
