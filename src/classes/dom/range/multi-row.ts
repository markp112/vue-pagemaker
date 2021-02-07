import { Style } from "@/models/styles/styles";
import { RHBase, HTMLTags, ClassOrStyle } from "./range-base";
import { MultiRowUnderline } from "./commands/underline-multi-row";
import { MultiRowBase } from "../multi-row-base";

export class MultiRow extends MultiRowBase {
  constructor(range: Range) {
    super(range);
  }

  process(htmlTag: HTMLTags, style: Style, classorStyle: ClassOrStyle): void {
    if (!this.range) throw new Error("RH: Range not set");
    if (style.value.includes("underline")) {
      const multiRowUnderline = new MultiRowUnderline(this.range);
      // multiRowUnderline.process(htmlTag);
    } else {
      this.processMultiRowSelection(htmlTag, style, classorStyle);
    }
  }

  private processMultiRowSelection(
    htmlTag: HTMLTags,
    style: Style,
    classorStyle: ClassOrStyle
  ): void {
    if (!this.rangeValues) {
      throw new Error("RH: range values not set");
    }
    this.fragment = this.range.extractContents();
    this.applyStyle(htmlTag, style, classorStyle);
    this.reInsertNodes();
  }
}
