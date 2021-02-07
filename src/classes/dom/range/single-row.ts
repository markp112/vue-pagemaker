import { Style } from "@/models/styles/styles";
import { RHBase, HTMLTags, ClassOrStyle } from "./range-base";
import { Underline } from "./commands/underline/underline";
import { RangeStyles } from "./rangeStyling/rangeStyles";

export class RangeRow extends RHBase {
  private rangeStyling = new RangeStyles();
  constructor(range: Range) {
    super(range);
  }

  process(htmlTag: HTMLTags, style: Style, classOrStyle: ClassOrStyle) {
    if (!this.range) throw new Error("RH: Range not set");
    if (classOrStyle === "class") {
      if (style.value.includes("underline")) {
        const underLine = new Underline(this.range);
        underLine.process(htmlTag);
        return;
      }
    }
    console.log("%c%s", "color: #408059", this.rangeValues.ancestorHasChildren);
    this.rangeValues.ancestorHasChildren
      ? this.createWrapperWithChildren(htmlTag, style, classOrStyle)
      : this.createWrapperNoChildren(htmlTag, style, classOrStyle);
  }

  private createWrapperNoChildren(
    htmlTag: HTMLTags,
    style: Style,
    classOrStyle: ClassOrStyle
  ) {
    if (!this.range) throw new Error("Range not set");
    this.fragment = this.range.extractContents();
    const wrapperNode: Node = this.createWrapperNode(htmlTag);
    this.rangeStyling.setStyleOrClass(wrapperNode, style, classOrStyle);
    // add back the content contained when the fragment was extracted
    if (this.fragment) {
      wrapperNode.appendChild(this.fragment);
    }
    this.insertNode(wrapperNode);
  }

  private createWrapperWithChildren(
    htmlTag: HTMLTags,
    style: Style,
    classOrStyle: ClassOrStyle
  ) {
    if (!this.range) throw new Error("Range not set");
    if (
      this.range.commonAncestorContainer.isEqualNode(this.range.startContainer)
    ) {
      this.createNodeFromFragment(htmlTag, style, classOrStyle);
      return;
    }
    const firstNodeLength = this.getTextNodeLength(
      this.range.commonAncestorContainer.childNodes[0]
    );
    if (this.rangeValues.start === firstNodeLength) {
      this.createNodeFromFragment(htmlTag, style, classOrStyle);
      return;
    }
    this.fragment = this.range.extractContents();
    this.createNewNodeAsWrapper(htmlTag, style, classOrStyle);
  }

  createNodeFromFragment(
    htmlTag: HTMLTags,
    style: Style,
    classOrStyle: ClassOrStyle
  ) {
    if (!this.range) throw new Error("Range not set");
    this.fragment = this.range.extractContents();
    const wrapperNode: Node | null = this.fragment
      ? this.fragment.querySelector("span")
      : this.createWrapperNode(htmlTag);
    if (wrapperNode) {
      if (classOrStyle === "style") {
        this.rangeStyling.clearExistingStyles(wrapperNode, style);
        this.rangeStyling.setStyle(wrapperNode, style);
        wrapperNode.childNodes.forEach(node => {
          this.rangeStyling.removeNodesWithEmptyStyles(node);
        });
      } else {
        this.rangeStyling.clearExistingClasses(wrapperNode, style);
        this.rangeStyling.setClass(wrapperNode, style);
      }
      this.insertNode(wrapperNode);
    }
  }

  private createNewNodeAsWrapper(
    htmlTag: HTMLTags,
    style: Style,
    classOrStyle: ClassOrStyle
    ) {
    if (!this.range) throw new Error("Range not set");
    let wrapperNode = this.createWrapperNode(htmlTag);
    const fragmentNode: Node = this.fragment as Node;
    wrapperNode = this.rangeStyling.setStyleOrClass(wrapperNode, style, classOrStyle);
    if (classOrStyle === "style") {
      // this.rangeStyling.clearExistingStyles(fragmentNode, style);
      this.rangeStyling.removeNodesWithEmptyStyles(fragmentNode);
    } else {
      this.rangeStyling.clearExistingClasses(fragmentNode, style);
    }
    if (fragmentNode) wrapperNode.appendChild(fragmentNode);
    wrapperNode.childNodes.forEach(childNode => {
      this.rangeStyling.clearExistingStyles(childNode, style);
    });
    this.rangeStyling.removeNodesWithEmptyStyles(wrapperNode);
    console.log('%c⧭', 'color: #00258c', wrapperNode);
    this.insertNode(wrapperNode);
  }

}
