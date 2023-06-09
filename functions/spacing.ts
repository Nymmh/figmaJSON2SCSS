import chalk from "chalk";
import fs from "fs-extra";

import { cssSavePath } from "../utils/cssSavePath.js";
import { scssSavePath } from "../utils/scssSavePath.js";
import { scssRelativePath } from "../utils/scssRelativePath.js";

import { spacingIndexes } from "../types/spacingIndexes.js";

export function spacing(spacingIndexes: spacingIndexes, figma: any) {
  console.log(chalk.blue.bold("Starting spacing generator..."));

  let usedIndexes: number[] = [];

  let writeScssString = "";
  let writeCssString = "";

  writeCssString = `@use ${scssRelativePath("spacing")};\n\r`;
  writeCssString += `:root {`;

  Object.entries(figma).forEach(([key, value], index) => {
    key = key.toLowerCase();
    if (!usedIndexes.includes(index) && spacingIndexes.includes(index)) {
      usedIndexes.push(index);
      writeScssString += `$spacing--horizontal-${key}: ${value.value}px;\n`;
      writeScssString += `$spacing--vertical-${key}: ${value.value}px;\n`;
      writeCssString += `\n--spacing--horizontal-${key}: #{spacing.$spacing--horizontal-${key}};`;
      writeCssString += `\n--spacing--vertical-${key}: #{spacing.$spacing--vertical-${key}};`;
    }
  });

  writeCssString += `\n}`;

  writeScssString += `
  \n\r@mixin spacing($size: 1, $property: 'margin', $directions...) {
    @each $direction in $directions {
      #{$property}-#{$direction}: var(--spacing--#{$size});
    }
  }
  
  @mixin generate-spacing-classes($sizes, $properties, $directions) {
    @for $i from 1 through length($properties) {
      @for $j from 1 through length($directions) {
        @for $k from 1 through length($sizes) {
          $property: nth($properties, $i);
          $direction: nth($directions, $j);
          $size: nth($sizes, $k);
          .#{$property}-#{$direction}--#{$size} {
            @include spacing($size, $property, $direction);
          }
        }
      }
    }
  }`;

  try {
    let cssSave = cssSavePath("spacing");
    let scssSave = scssSavePath("spacing");
    fs.outputFileSync(cssSave, writeCssString);
    fs.outputFileSync(scssSave, writeScssString);
    console.log(chalk.green.bold("Spacing generator finished"));
  } catch (e) {
    console.log(chalk.redBright.bold("Error in spacing generator"));
    console.log(e);
  }
}
