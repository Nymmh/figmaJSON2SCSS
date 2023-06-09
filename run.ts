import chalk from "chalk";
import fs from "fs-extra";

import { parse } from "./utils/parse.js";

async function generate() {
  console.log(chalk.green.bold("Starting foundations gen..."));

  try {
    const figma = fs.readJSONSync("./figma-foundations.json");

    if (fs.existsSync("./styles")) {
      console.log(chalk.yellow.bold("Styles folder found, removing..."));
      fs.rmSync("./styles", { recursive: true });
    }

    await parse(figma);
    fs.copySync("./copyFiles/reset", "./styles/");

    const files = await fs.readdirSync("./styles/css/foundations");

    let writeString = "";

    for (const fl of files) {
      if (fl.endsWith("scss")) {
        writeString += `@use './css/foundations/${fl}';\n`;
      }
    }

    fs.outputFileSync("./styles/main.scss", writeString);
  } catch (e) {
    console.log(chalk.redBright.bold("Error in the generate function"));
    console.log(e);
  }
}

generate();
