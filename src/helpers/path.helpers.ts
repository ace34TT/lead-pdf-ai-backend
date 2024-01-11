import path from "path";
export const assetsDirectory = path.resolve(__dirname, "../assets/");
export const getAssetsPath = (file: string) => {
  return path.resolve(assetsDirectory, file);
};
