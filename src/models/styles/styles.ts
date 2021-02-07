import { DimensionInterface } from "../components/box-dimension";

export type StyleTags =
  | "color"
  | "background-color"
  | "font-family"
  | "font-size"
  | "font-weight"
  | "font-style"
  | "text-decoration"
  | "border-width"
  | "border-radius"
  | "border-left"
  | "border-right"
  | "border-top"
  | "border-bottom"
  | "height"
  | "width"
  | "margin-left"
  | "margin-right"
  | "margin-top"
  | "margin-bottom"
  | "background-image"
  | "background-position"
  | "background-position-x"
  | "background-position-y"
  | "background-size"
  | "background-repeat"
  | "";

export const StylesMap = new Map([
  ["color", "color"],
  ["background-color", "backgroundColor"],
  ["font-family", "fontFamily"],
  ["font-size", "fontSize"],
  ["font-weight", "fontWeight"],
  ["font-style", "fontStyle"],
  ["text-decoration", "textDecoration"]
]);

export interface Style {
  style: string;
  value: string;
}

export type BorderDirections =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "border"
  | null;
export type BorderStyle =
  | "solid"
  | "dashed"
  | "dotted"
  | "double"
  | "groove"
  | "ridge"
  | "inset"
  | "outset"
  | "hidden"
  | "none";

export interface BorderInterface {
  borderDirection: BorderDirections;
  colour: string;
  style: BorderStyle;
  width: DimensionInterface;
  borderRadius: DimensionInterface;
}
