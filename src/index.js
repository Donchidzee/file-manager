const args = process.argv.slice(2);
let username = "User";

args.forEach((arg) => {
  if (arg.startsWith("--username=")) {
    username = arg.split("=")[1];
  }
});

console.log(`Welcome to the File Manager, ${username}!`);
