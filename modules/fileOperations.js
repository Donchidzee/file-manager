import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { pipeline } from "stream/promises";
import { displayInvalidInput, displayOperationFailed } from "./helpers.js";

export const handleFileOperations = async (command, args, currentDir) => {
  switch (command) {
    case "cat":
      return await cat(args, currentDir);

    case "add":
      return await add(args, currentDir);

    case "rn":
      return await rn(args, currentDir);

    case "cp":
      return await cp(args, currentDir);

    case "mv":
      return await mv(args, currentDir);

    case "rm":
      return await rm(args, currentDir);

    default:
      displayInvalidInput();
      return currentDir;
  }
};

const cat = async (args, currentDir) => {
  if (args.length === 0) {
    displayInvalidInput();
    return currentDir;
  }
  const filePath = path.isAbsolute(args[0])
    ? args[0]
    : path.resolve(currentDir, args[0]);

  try {
    await fsPromises.access(filePath);
    const readStream = fs.createReadStream(filePath, "utf8");

    readStream.on("data", (chunk) => {
      console.log(chunk);
    });

    await new Promise((resolve, reject) => {
      readStream.on("end", resolve);
      readStream.on("error", reject);
    });
  } catch (err) {
    displayOperationFailed();
  }
  return currentDir;
};

const add = async (args, currentDir) => {
  if (args.length === 0) {
    displayInvalidInput();
    return currentDir;
  }
  const fileName = args[0];
  const filePath = path.resolve(currentDir, fileName);

  try {
    await fsPromises.writeFile(filePath, "", { flag: "wx" });
  } catch (err) {
    displayOperationFailed();
  }
  return currentDir;
};

const rn = async (args, currentDir) => {
  if (args.length < 2) {
    displayInvalidInput();
    return currentDir;
  }
  const oldPath = path.isAbsolute(args[0])
    ? args[0]
    : path.resolve(currentDir, args[0]);
  const newName = args[1];
  const newPath = path.join(path.dirname(oldPath), newName);

  try {
    await fsPromises.rename(oldPath, newPath);
  } catch (err) {
    displayOperationFailed();
  }
  return currentDir;
};

const cp = async (args, currentDir) => {
  if (args.length < 2) {
    displayInvalidInput();
    return currentDir;
  }
  const sourcePath = path.isAbsolute(args[0])
    ? args[0]
    : path.resolve(currentDir, args[0]);
  const destDir = path.isAbsolute(args[1])
    ? args[1]
    : path.resolve(currentDir, args[1]);
  const fileName = path.basename(sourcePath);
  const destPath = path.join(destDir, fileName);

  try {
    await fsPromises.access(sourcePath);
    await fsPromises.access(destDir);

    const readStream = fs.createReadStream(sourcePath);
    const writeStream = fs.createWriteStream(destPath, { flags: "wx" });

    await pipeline(readStream, writeStream);
  } catch (err) {
    displayOperationFailed();
  }
  return currentDir;
};

const mv = async (args, currentDir) => {
  await cp(args, currentDir);
  const sourcePath = path.isAbsolute(args[0])
    ? args[0]
    : path.resolve(currentDir, args[0]);
  try {
    await fsPromises.unlink(sourcePath);
  } catch (err) {
    displayOperationFailed();
  }
  return currentDir;
};

const rm = async (args, currentDir) => {
  if (args.length === 0) {
    displayInvalidInput();
    return currentDir;
  }
  const filePath = path.isAbsolute(args[0])
    ? args[0]
    : path.resolve(currentDir, args[0]);

  try {
    await fsPromises.unlink(filePath);
  } catch (err) {
    displayOperationFailed();
  }
  return currentDir;
};
