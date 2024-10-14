import { handleNavigation } from "./navigation.js";
import { handleFileOperations } from "./fileOperations.js";
import { handleOsOperations } from "./osOperations.js";
import { calculateHash } from "./hash.js";
import { handleCompression } from "./compression.js";
import { displayInvalidInput, displayOperationFailed } from "./helpers.js";

export const handleInput = async (input, currentDir) => {
  const args = input.split(" ");
  const command = args[0];

  try {
    switch (command) {
      case ".exit":
        return { exit: true };

      case "up":
      case "cd":
      case "ls":
        currentDir = await handleNavigation(command, args.slice(1), currentDir);
        return { currentDir };

      case "cat":
      case "add":
      case "rn":
      case "cp":
      case "mv":
      case "rm":
        currentDir = await handleFileOperations(
          command,
          args.slice(1),
          currentDir
        );
        return { currentDir };

      case "os":
        await handleOsOperations(args.slice(1));
        return { currentDir };

      case "hash":
        await calculateHash(args.slice(1), currentDir);
        return { currentDir };

      case "compress":
      case "decompress":
        await handleCompression(command, args.slice(1), currentDir);
        return { currentDir };

      default:
        displayInvalidInput();
        return { currentDir };
    }
  } catch (error) {
    displayOperationFailed();
    return { currentDir };
  }
};
