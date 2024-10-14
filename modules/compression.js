import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { createBrotliCompress, createBrotliDecompress } from "zlib";
import { displayInvalidInput, displayOperationFailed } from "./helpers.js";

export const handleCompression = async (command, args, currentDir) => {
  if (args.length < 2) {
    displayInvalidInput();
    return;
  }
  const sourcePath = path.isAbsolute(args[0])
    ? args[0]
    : path.resolve(currentDir, args[0]);
  const destPath = path.isAbsolute(args[1])
    ? args[1]
    : path.resolve(currentDir, args[1]);

  try {
    await fs.promises.access(sourcePath);
    await fs.promises.access(path.dirname(destPath));

    const readStream = fs.createReadStream(sourcePath);
    const writeStream = fs.createWriteStream(destPath);

    if (command === "compress") {
      const brotliCompress = createBrotliCompress();
      await pipeline(readStream, brotliCompress, writeStream);
    } else if (command === "decompress") {
      const brotliDecompress = createBrotliDecompress();
      await pipeline(readStream, brotliDecompress, writeStream);
    } else {
      displayInvalidInput();
    }
  } catch (err) {
    displayOperationFailed();
  }
};
