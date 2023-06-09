import chalk from "chalk";

import { borderRadius } from "../functions/borderRadius.js";
import { borderWidth } from "../functions/borderWidth.js";
import { boxShadow } from "../functions/boxShadow.js";
import { color } from "../functions/color.js";
import { spacing } from "../functions/spacing.js";

import { borderRadiusObj } from "../types/borderRadiusObj.js";
import { borderWidthObj } from "../types/borderWidthObj.js";
import { boxShadowObj } from "../types/boxShadowObj.js";
import { colorIndexes } from "../types/colorIndexes.js";
import { spacingIndexes } from "../types/spacingIndexes.js";

export async function parse(figma: any) {
  let colorIndexes: colorIndexes = {
    primary: undefined,
    secondary: undefined,
    gradient: undefined,
  };

  let spacingIndexes: spacingIndexes = [];
  let borderRadiusObj: borderRadiusObj;
  let borderWidthObj: borderWidthObj;
  let boxShadowObj: boxShadowObj;

  console.log(chalk.blue.bold("Collecting indexes..."));

  Object.entries(figma).forEach(([key, value], index) => {
    for (let [, innerObj] of Object.entries(value)) {
      if (innerObj.type === "color") {
        if (colorIndexes.secondary == undefined && key === "PRIMARY") {
          colorIndexes.primary = index;
        } else if (colorIndexes.secondary == undefined && key === "SECONDARY") {
          colorIndexes.secondary = index;
        } else if (colorIndexes.gradient == undefined && key === "GRADIENT") {
          colorIndexes.gradient = index;
        }
      } else if (value.type === "spacing") {
        spacingIndexes.push(index);
      } else if (innerObj.type == "borderRadius" && !borderRadiusObj) {
        borderRadiusObj = value;
      } else if (innerObj.type == "borderWidth" && !borderWidthObj) {
        borderWidthObj = value;
      } else if (innerObj.type == "boxShadow" && !boxShadowObj) {
        boxShadowObj = value;
      }
    }
  });

  console.log(chalk.green.bold("Finished collecting indexes"));

  color(colorIndexes, figma);
  spacing(spacingIndexes, figma);
  borderRadius(borderRadiusObj);
  borderWidth(borderWidthObj);
  boxShadow(boxShadowObj);
}
