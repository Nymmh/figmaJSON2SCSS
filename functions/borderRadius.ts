import chalk from "chalk";
import fs from "fs-extra";

import { cssSavePath } from "../utils/cssSavePath.js";
import { scssSavePath } from "../utils/scssSavePath.js";
import { scssRelativePath } from "../utils/scssRelativePath.js";

import { borderRadiusObj } from "../types/borderRadiusObj.js";

export function borderRadius(borderRadiusObj: borderRadiusObj) {
  console.log(chalk.blue.bold("Starting border radius generator..."));

  let writeScssString = "";
  let writeCssString = "";

  writeCssString = `@use ${scssRelativePath("border-radius")};\n\r`;
  writeCssString += `:root {`;

  Object.entries(borderRadiusObj).forEach(([key, value]) => {
    key = key.toLowerCase().trimEnd().trimStart();

    if (key !== "unique") {
      writeScssString += `$border-radius--${key}: ${value.value}px;\n`;
      writeCssString += `\n--border-radius--${key}: #{border-radius.$border-radius--${key}};`;
    }
  });

  writeScssString += `\n\r@mixin border-radius($style: 'small') {
    border-radius: var(--border-radius--#{$style});
  }
  
  @mixin generate-border-radius-classes($styles) {
    @each $style in $styles {
      .border-radius--#{$style} {
        @include border-radius($style);
        overflow: hidden;
      }
    }
  }`;

  writeCssString += `\n}`;

  try {
    let cssSave = cssSavePath("border-radius");
    let scssSave = scssSavePath("border-radius");
    fs.outputFileSync(cssSave, writeCssString);
    fs.outputFileSync(scssSave, writeScssString);
    console.log(chalk.green.bold("Border Radius generator finished"));
  } catch (e) {
    console.log(chalk.redBright.bold("Error in border-radius generator"));
    console.log(e);
  }
}
