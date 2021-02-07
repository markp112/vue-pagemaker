import { RHBase, HTMLTags, ClassOrStyle } from "@/classes/dom/range/range-base";
import { Style } from "@/models/styles/styles";
import { RangeStyles } from "../../rangeStyling/rangeStyles";
import { RemoveUnderline } from "./remove-underline";

export interface SelectedContent {
  startContent: boolean;
  selectedContent: boolean;
  endContent: boolean;
}

export class Underline extends RHBase {
  private underline: Style = {
    style: "text-decoration",
    value: "underline"
  };
  private isElementUnderlined: SelectedContent = {
    startContent: false,
    selectedContent: false,
    endContent: false
  };
  private rangeStyling = new RangeStyles();

  constructor(range: Range) {
    super(range);
  }

  public process(htmlTag: HTMLTags) {
    this.isElementUnderlined = this.getNodesInSelectionUnderlineStatus();
    const hasUnderline =
      this.isElementUnderlined.startContent &&
      this.isElementUnderlined.endContent &&
      this.isAllUnderlined();
    if (hasUnderline) {
      this.removeUnderline();
    } else {
      this.addUnderline(htmlTag);
    }
  }

  getNodesInSelectionUnderlineStatus(): SelectedContent {
    const selectedContent: SelectedContent = {
      startContent: this.isParentUnderlined(this.range.startContainer),
      endContent: this.isParentUnderlined(this.range.endContainer),
      selectedContent: this.isParentUnderlined(
        this.range.commonAncestorContainer
      )
    };
    return selectedContent;
  }

  isParentUnderlined(node: Node | null): boolean {
    if (!node) return false;
    if (node.nodeName !== "P") {
      if (node.nodeName === "SPAN") {
        if (this.hasClassUnderline(node)) {
          return true;
        }
      }
      return this.isParentUnderlined(node.parentNode);
    }
    return false;
  }

  private hasClassUnderline(node: Node): boolean {
    const spanElement = node as HTMLSpanElement;
    const className = spanElement.className;
    if (className) {
      return className.includes("underline");
    }
    return false;
  }

  // remove the underline if present
  private removeUnderline() {
    const removeUnderline = new RemoveUnderline(this.range);
    removeUnderline.process();
  }

  isAllUnderlined(): boolean {
    return this.range.commonAncestorContainer.nodeName !== "P";
  }

  private getParentNodeWithUnderline(node: Node | null): Node | null {
    if (!node) return null;
    if (node.nodeName === "P") return null;
    if (node.nodeName === "SPAN") {
      if (
        this.hasClassUnderline(node) ||
        (node as HTMLSpanElement).innerHTML.includes("underline")
      ) {
        return node;
      }
    }
    return this.getParentNodeWithUnderline(node.parentNode);
  }

  addUnderline(htmlTag: HTMLTags) {
    // five scenarios
    // nothing underlined
    // start not underlined rest is underlined
    // start is underlined end is not underlined
    // start is underlined middle is not underlined end is underlined
    // start is not underlined middle is underlined end if not underlined
    if (
      !this.isElementUnderlined.startContent &&
      !this.isElementUnderlined.selectedContent &&
      !this.isElementUnderlined.endContent
    ) {
      this.rangeValues.ancestorHasChildren
        ? this.createWrapperWithChildren(htmlTag)
        : this.createWrapperNoChildren(htmlTag);
      return;
    }
    if (
      !this.isElementUnderlined.startContent &&
      this.isElementUnderlined.endContent
    ) {
      const nodeWithUnderline = this.getParentNodeWithUnderline(
        this.range.endContainer
      )!;
      const fragment = this.range.extractContents();
      nodeWithUnderline.insertBefore(fragment, nodeWithUnderline.childNodes[0]);
      return;
    }
    if (this.isElementUnderlined.startContent) {
      const nodeWithUnderline = this.getParentNodeWithUnderline(
        this.range.startContainer
      )!;
      const fragment = this.range.extractContents();
      nodeWithUnderline.appendChild(fragment);
      return;
    }
  }

  private createWrapperWithChildren(htmlTag: HTMLTags) {
    if (this.range.commonAncestorContainer === this.range.startContainer) {
      this.createNodeFromFragment(htmlTag);
      return;
    }
    const firstNodeLength = this.getTextNodeLength(
      this.range.commonAncestorContainer.childNodes[0]
    );
    if (this.rangeValues.start === firstNodeLength) {
      this.createNodeFromFragment(htmlTag);
      return;
    }
    this.fragment = this.range.extractContents();
    this.createNewNodeAsWrapper(htmlTag, this.underline, "class");
  }

  private createNodeFromFragment(htmlTag: HTMLTags) {
    if (!this.range) throw new Error("Range not set");
    this.fragment = this.range.extractContents();
    const wrapperNode: Node | null = this.fragment
      ? this.fragment.querySelector("span")
      : this.createWrapperNode(htmlTag);
    if (wrapperNode) {
      this.rangeStyling.clearExistingClasses(wrapperNode, this.underline);
      this.rangeStyling.setClass(wrapperNode, this.underline);
      this.insertNode(wrapperNode);
    }
  }

  private createNewNodeAsWrapper(
    htmlTag: HTMLTags,
    style: Style,
    classOrStyle: ClassOrStyle
  ) {
    if (!this.range) throw new Error("Range not set");
    const wrapperNode = this.createWrapperNode(htmlTag);
    const fragmentNode: Node = this.fragment as Node;
    this.rangeStyling.setStyleOrClass(wrapperNode, style, classOrStyle);
    this.rangeStyling.clearExistingClasses(fragmentNode, style);
    if (fragmentNode) wrapperNode.appendChild(fragmentNode);
    this.insertNode(wrapperNode);
  }

  private createWrapperNoChildren(htmlTag: HTMLTags) {
    this.fragment = this.range.extractContents();
    const wrapperNode = this.createWrapperNode(htmlTag);
    const fragmentNode: Node = this.fragment as Node;
    if (wrapperNode) {
      this.rangeStyling.clearExistingClasses(wrapperNode, this.underline);
      this.rangeStyling.setClass(wrapperNode, this.underline);
      if (fragmentNode) wrapperNode.appendChild(fragmentNode);
      if (this.range) {
        this.range.insertNode(wrapperNode);
      }
    }
  }
}
