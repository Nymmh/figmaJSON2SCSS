import chalk from "chalk";
import fs from "fs-extra";

import { cssSavePath } from "../utils/cssSavePath.js";
import { scssSavePath } from "../utils/scssSavePath.js";
import { scssRelativePath } from "../utils/scssRelativePath.js";

import { colorIndexes } from "../types/colorIndexes.js";

export async function color(colorIndexes: colorIndexes, figma: any) {
  console.log(chalk.blue.bold("Starting color generator..."));

  let writeScssString = "";
  let writeCssString = "";

  writeCssString = `@use ${scssRelativePath("color")};\n\r`;
  writeCssString += `:root {`;

  Object.entries(figma).forEach(([key, value], index) => {
    key = key.toLowerCase();
    if (
      index == colorIndexes.primary ||
      index == colorIndexes.secondary ||
      index == colorIndexes.gradient
    ) {
      for (let [innerKey, innerObj] of Object.entries(value)) {
        innerKey = innerKey.toLowerCase().trimEnd().trimStart();
        writeScssString += `$color--${key}-${innerKey}: ${innerObj.value};\n`;
        writeCssString += `\n--color--${key}-${innerKey}: #{color.$color--${key}-${innerKey}};`;
      }
    }
  });

  writeCssString += `\n}`;

  try {
    let cssSave = cssSavePath("color");
    let scssSave = scssSavePath("color");
    fs.outputFileSync(cssSave, writeCssString);
    fs.outputFileSync(scssSave, writeScssString);
    console.log(chalk.green.bold("Color generator finished"));
  } catch (e) {
    console.log(chalk.redBright.bold("Error in color generator"));
    console.log(e);
  }
}
