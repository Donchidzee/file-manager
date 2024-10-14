import fs from "fs/promises";
import path from "path";
import { displayInvalidInput, displayOperationFailed } from "./helpers.js";

export const handleNavigation = async (command, args, currentDir) => {
  switch (command) {
    case "up": {
      const rootDir = path.parse(currentDir).root;
      if (currentDir !== rootDir) {
        currentDir = path.dirname(currentDir);
      }
      return currentDir;
    }

    case "cd": {
      if (args.length === 0) {
        displayInvalidInput();
        return currentDir;
      }
      const targetPath = args[0];
      const newPath = path.isAbsolute(targetPath)
        ? targetPath
        : path.resolve(currentDir, targetPath);

      try {
        const stats = await fs.stat(newPath);
        if (stats.isDirectory()) {
          currentDir = newPath;
        } else {
          displayOperationFailed();
        }
      } catch (err) {
        displayOperationFailed();
      }
      return currentDir;
    }

    case "ls": {
      try {
        const dirents = await fs.readdir(currentDir, { withFileTypes: true });
        const files = [];
        const directories = [];

        dirents.forEach((dirent) => {
          if (dirent.isDirectory()) {
            directories.push({ Name: dirent.name, Type: "Directory" });
          } else if (dirent.isFile()) {
            files.push({ Name: dirent.name, Type: "File" });
          }
        });

        directories.sort((a, b) => a.Name.localeCompare(b.Name));
        files.sort((a, b) => a.Name.localeCompare(b.Name));

        const output = [...directories, ...files];
        console.table(output);
      } catch (err) {
        displayOperationFailed();
      }
      return currentDir;
    }

    default:
      displayInvalidInput();
      return currentDir;
  }
};
