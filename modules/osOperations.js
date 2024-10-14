import os from "os";
import { displayInvalidInput } from "./helpers.js";

export const handleOsOperations = async (args) => {
  if (args.length === 0 || !args[0].startsWith("--")) {
    displayInvalidInput();
    return;
  }

  switch (args[0]) {
    case "--EOL":
      console.log(JSON.stringify(os.EOL));
      break;

    case "--cpus":
      const cpus = os.cpus();
      console.log(`Total CPUs: ${cpus.length}`);
      const cpuInfo = cpus.map((cpu, index) => ({
        Model: cpu.model,
        Speed: `${(cpu.speed / 1000).toFixed(2)} GHz`,
      }));
      console.table(cpuInfo);
      break;

    case "--homedir":
      console.log(os.homedir());
      break;

    case "--username":
      console.log(os.userInfo().username);
      break;

    case "--architecture":
      console.log(process.arch);
      break;

    default:
      displayInvalidInput();
      break;
  }
};
