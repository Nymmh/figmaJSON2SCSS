import chalk from "chalk";
import fs from "fs-extra";

import { cssSavePath } from "../utils/cssSavePath.js";
import { scssSavePath } from "../utils/scssSavePath.js";
import { scssRelativePath } from "../utils/scssRelativePath.js";

import { boxShadowObj } from "../types/boxShadowObj.js";

export function boxShadow(boxShadowObj: boxShadowObj) {
  console.log(chalk.blue.bold("Starting box shadow generator..."));

  let writeScssString = "";
  let writeCssString = "";

  writeCssString = `@use ${scssRelativePath("box-shadow")};\n\r`;
  writeCssString += `:root {`;

  Object.entries(boxShadowObj).forEach(([key, value]) => {
    key = key.toLowerCase().trimEnd().trimStart();

    if (key !== "unique") {
      writeScssString += `$border-width--${key}: ${value.value.x}px ${value.value.y}px ${value.value.blur}px ${value.value.spread}px ${value.value.color};\n`;
      writeCssString += `\n--border-width--${key}: #{border-width.$border-width--${key}};`;
    }
  });

  writeCssString += `\n}`;

  try {
    let cssSave = cssSavePath("box-shadow");
    let scssSave = scssSavePath("box-shadow");
    fs.outputFileSync(cssSave, writeCssString);
    fs.outputFileSync(scssSave, writeScssString);
    console.log(chalk.green.bold("Box Shadow generator finished"));
  } catch (e) {
    console.log(chalk.redBright.bold("Error in box-shadow generator"));
    console.log(e);
  }
}
