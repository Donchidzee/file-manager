import os from "os";
import { createInterface } from "readline";
import { handleInput } from "./modules/cli.js";

const args = process.argv.slice(2);
let username = "User";

args.forEach((arg) => {
  if (arg.startsWith("--username=")) {
    username = arg.split("=")[1];
  }
});

console.log(`Welcome to the File Manager, ${username}!`);

let currentDir = os.homedir();

const displayCurrentDir = (dir) => {
  console.log(`\nYou are currently in ${dir}`);
};

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

displayCurrentDir(currentDir);
rl.prompt();

rl.on("line", async (input) => {
  const result = await handleInput(input.trim(), currentDir);
  if (result.exit) {
    rl.close();
  } else {
    currentDir = result.currentDir;
    displayCurrentDir(currentDir);
    rl.prompt();
  }
}).on("close", () => {
  console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
});

rl.on("SIGINT", () => {
  rl.close();
});
