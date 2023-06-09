import chalk from "chalk";
import fs from "fs-extra";

import { cssSavePath } from "../utils/cssSavePath.js";
import { scssSavePath } from "../utils/scssSavePath.js";
import { scssRelativePath } from "../utils/scssRelativePath.js";

import { borderWidthObj } from "../types/borderWidthObj.js";

export function borderWidth(borderWidthObj: borderWidthObj) {
  console.log(chalk.blue.bold("Starting border width generator..."));

  let writeScssString = "";
  let writeCssString = "";

  writeCssString = `@use ${scssRelativePath("border-width")};\n\r`;
  writeCssString += `:root {`;

  Object.entries(borderWidthObj).forEach(([key, value]) => {
    key = key.toLowerCase().trimEnd().trimStart();

    if (key !== "unique") {
      writeScssString += `$border-width--${key}: ${value.value}px;\n`;
      writeCssString += `\n--border-width--${key}: #{border-width.$border-width--${key}};`;
    }
  });

  writeCssString += `\n}`;

  try {
    let cssSave = cssSavePath("border-width");
    let scssSave = scssSavePath("border-width");
    fs.outputFileSync(cssSave, writeCssString);
    fs.outputFileSync(scssSave, writeScssString);
    console.log(chalk.green.bold("Border Width generator finished"));
  } catch (e) {
    console.log(chalk.redBright.bold("Error in border-width generator"));
    console.log(e);
  }
}
