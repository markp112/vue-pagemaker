import { RangeRow } from "./single-row";
import { MultiRow } from "./multi-row";
import { HTMLTags, ClassOrStyle } from "./range-base";
import { Style } from "@/models/styles/styles";

export class RH {
  range: Range;
  constructor(range: Range) {
    this.range = range;
  }

  applyStyle(
    htmlTag: HTMLTags,
    style: Style,
    classOrStyle: ClassOrStyle
  ): void {
    if (!this.range) throw new Error("RH: Range not set");
    if (this.range.commonAncestorContainer.nodeName === "DIV") {
      const multiRow = new MultiRow(this.range);
      multiRow.process(htmlTag, style, classOrStyle);
    } else {
      const singleRow: RangeRow = new RangeRow(this.range);
      singleRow.process(htmlTag, style, classOrStyle);
    }
  }
}
