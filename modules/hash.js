import fs from "fs";
import crypto from "crypto";
import path from "path";
import { displayInvalidInput, displayOperationFailed } from "./helpers.js";

export const calculateHash = async (args, currentDir) => {
  if (args.length === 0) {
    displayInvalidInput();
    return;
  }
  const filePath = path.isAbsolute(args[0])
    ? args[0]
    : path.resolve(currentDir, args[0]);

  try {
    await fs.promises.access(filePath);
    const hash = crypto.createHash("sha256");
    const readStream = fs.createReadStream(filePath);

    readStream.on("error", () => {
      displayOperationFailed();
    });

    readStream.on("data", (chunk) => {
      hash.update(chunk);
    });

    readStream.on("end", () => {
      const fileHash = hash.digest("hex");
      console.log(`Hash: ${fileHash}`);
    });
  } catch (err) {
    displayOperationFailed();
  }
};
