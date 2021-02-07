import { Style } from "@/models/styles/styles";
import { RHBase } from "../../range-base";
import { RangeStyles } from "../../rangeStyling/rangeStyles";
import { CurrentStyling } from "../current-styles/currentStyles";

type nodeOrNull = Node | null;

export class RemoveUnderline extends RHBase {
  private currentStyles: CurrentStyling = new CurrentStyling();
  private rangeStyles: RangeStyles = new RangeStyles();
  private underlineNode: nodeOrNull = null;
  private parentOfUnderline: nodeOrNull = null;
  private underlineNodeNextSibling: nodeOrNull = null;
  private previousSiblings: nodeOrNull = null;
  private additionalSiblings: nodeOrNull = null;
  private selectedContentNode: nodeOrNull = null;
  private startingContentNode: nodeOrNull = null;
  private remainingContentNode: nodeOrNull = null;
  private UNDERLINE: Style = { style: "textDecoration", value: "underline" };

  constructor(range: Range) {
    super(range);
  }

  process() {
    this.underlineNode = this.getParentNodeWithUnderline(
      this.range.commonAncestorContainer
    );
    if (this.underlineNode) {
      this.initialiseNodes();
      this.extractSelectedNode();
      this.reApplyStyling();
      if (this.additionalSiblings) {
        this.additionalSiblings = this.rangeStyles.setClass(
          this.additionalSiblings,
          this.UNDERLINE
        );
      }
      this.reAttachNode(this.previousSiblings);
      this.reAttachNode(this.startingContentNode);
      this.reAttachNode(this.selectedContentNode);
      this.reAttachNode(this.remainingContentNode);
      this.reAttachNode(this.additionalSiblings);
      let node = this.underlineNode.childNodes[0];
      while (node) {
        this.underlineNode.removeChild(node);
        node = this.underlineNode.childNodes[0];
      }
      const paraNode = this.findNextNodeofType(this.underlineNode, "P")!;
      this.removeEmptySpans(paraNode);
    }
  }

  extractSelectedNode() {
    const underlinedContent = this.range.extractContents();
    this.selectedContentNode = this.createWrapperNode(
      "span",
      underlinedContent
    ) as HTMLSpanElement;
  }

  reApplyStyling() {
    const styles: Style[] = this.currentStyles.getStyles(
      "Parent",
      "style"
    ) as Style[];
    let classes = this.currentStyles.getStyles(
      "Parent",
      "class",
      "textDecoration underline"
    ) as string;
    if (this.selectedContentNode) {
      this.selectedContentNode = this.rangeStyles.setStyles(
        this.selectedContentNode,
        styles
      );
      this.selectedContentNode = this.rangeStyles.setClass(
        this.selectedContentNode,
        classes
      );
    }
    if (this.startingContentNode) {
      this.startingContentNode = this.rangeStyles.setClass(
        this.startingContentNode,
        classes
      );
      this.startingContentNode = this.rangeStyles.setStyles(
        this.startingContentNode,
        styles
      );
    }
    if (this.remainingContentNode) {
      classes = this.currentStyles.getStyles(
        "Sibling",
        "class",
        "textDecoration underline"
      ) as string;
      this.remainingContentNode = this.rangeStyles.setClass(
        this.remainingContentNode,
        classes
      );
      this.remainingContentNode = this.rangeStyles.setStyles(
        this.remainingContentNode,
        styles
      );
    }
    if (this.previousSiblings) {
      this.previousSiblings = this.rangeStyles.setStyles(
        this.previousSiblings,
        styles
      );
    }
  }

  private initialiseNodes() {
    if (!this.underlineNode) return;
    this.parentOfUnderline = this.underlineNode.parentNode!;
    this.underlineNodeNextSibling = this.getInsertNodeBefore();
    this.previousSiblings = this.getPreviousSiblings();
    this.startingContentNode = this.getStartNodeStartContent();
    this.remainingContentNode = this.getEndNodeRemainingTextContent();
    this.additionalSiblings = this.getAdditionalSiblings();
    this.currentStyles.setClassesFromNodeHiearchy(
      this.range.startContainer,
      this.underlineNode,
      "Parent"
    );
    this.currentStyles.setStylesFromNodeHeirarchy(
      this.range.startContainer,
      this.underlineNode,
      "Parent"
    );
  }

  getSelectedContent(): string {
    let nextSibling = this.range.startContainer.nextSibling;
    if (!nextSibling) return "";
    let textContent = "";
    if (!this.range.startContainer.isSameNode(this.range.endContainer)) {
      textContent = this.range.startContainer.textContent!.substring(
        this.range.startOffset
      )!;
      while (!this.range.endContainer.isSameNode(nextSibling)) {
        textContent += nextSibling.textContent;
        if (nextSibling.nextSibling) {
          nextSibling = nextSibling.nextSibling;
        }
      }
      textContent += this.range.endContainer.textContent!.substring(
        0,
        this.range.endOffset
      );
    } else {
      textContent = this.range.startContainer.textContent!.substring(
        this.range.startOffset,
        this.range.endOffset
      )!;
    }
    return textContent;
  }

  private reAttachNode(node: nodeOrNull) {
    if (!node || !this.parentOfUnderline) return;
    if (this.underlineNodeNextSibling) {
      this.parentOfUnderline.insertBefore(node, this.underlineNodeNextSibling);
    } else {
      this.parentOfUnderline.appendChild(node);
    }
  }

  getAdditionalSiblings(): nodeOrNull {
    if (!this.underlineNode) return null;
    const wrapperNode = this.createWrapperNode("span");
    let parentNode = this.range.endContainer.parentNode!;
    let nextSibling = this.range.endContainer.nextSibling;
    this.iterateAndAppendNodes(nextSibling, wrapperNode);
    while (!this.underlineNode.isEqualNode(parentNode)) {
      nextSibling = parentNode.nextSibling;
      this.iterateAndAppendNodes(nextSibling, wrapperNode);
      parentNode = parentNode.parentNode!;
    }
    if (wrapperNode.hasChildNodes()) {
      return wrapperNode;
    }
    return null;
  }

  private iterateAndAppendNodes(startNode: nodeOrNull, wrapperNode: Node) {
    while (startNode) {
      const tempSibling = startNode.nextSibling;
      wrapperNode.appendChild(startNode);
      startNode = tempSibling;
    }
  }

  private iterateAndAppendPreviousNodes(
    startNode: nodeOrNull,
    wrapperNode: Node
  ) {
    while (startNode) {
      const tempSibling = startNode.previousSibling;
      wrapperNode.appendChild(startNode);
      startNode = tempSibling;
    }
  }

  private getPreviousSiblings(): nodeOrNull {
    if (!this.underlineNode) return null;
    const wrapperNode = this.createWrapperNode("span");
    let parentNode = this.range.startContainer.parentNode!;
    let lastInsertedNode: nodeOrNull = null;
    let previousSibling = this.range.startContainer.previousSibling;
    this.iterateAndAppendPreviousNodes(previousSibling, wrapperNode);
    lastInsertedNode = previousSibling;
    while (!this.underlineNode.isEqualNode(parentNode)) {
      previousSibling = parentNode.previousSibling;
      while (previousSibling) {
        const tempSibling = previousSibling.previousSibling;
        if (wrapperNode.hasChildNodes()) {
          wrapperNode.insertBefore(previousSibling, lastInsertedNode);
        } else {
          wrapperNode.appendChild(previousSibling);
        }
        lastInsertedNode = previousSibling;
        previousSibling = tempSibling;
      }
      parentNode = parentNode.parentNode!;
    }
    if (wrapperNode.hasChildNodes()) {
      return this.rangeStyles.setClass(wrapperNode, this.UNDERLINE);
    }
    return null;
  }

  private getParentNodeWithUnderline(node: nodeOrNull): nodeOrNull {
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

  private hasClassUnderline(node: Node): boolean {
    const spanElement = node as HTMLSpanElement;
    const className = spanElement.className;
    return className.includes("underline");
  }

  private getStartNodeStartContent(): nodeOrNull {
    if (this.range.startOffset > 0) {
      const textContent = this.range.startContainer.textContent!.substring(
        0,
        this.range.startOffset
      )!;
      return this.wrapExistingTextContent(
        textContent,
        this.range.startContainer
      );
    }
    return null;
  }

  private getEndNodeRemainingTextContent(): nodeOrNull {
    let textContent = this.range.endContainer.textContent;
    this.currentStyles.setClassesFromNodeHiearchy(
      this.range.endContainer,
      this.underlineNode!,
      "Sibling"
    );
    if (textContent) {
      textContent = textContent.substring(this.range.endOffset);
      return this.wrapExistingTextContent(textContent, this.range.endContainer);
    }
    return null;
  }

  private wrapExistingTextContent(
    textContent: string,
    startNode: Node
  ): nodeOrNull {
    const styles: Style[] = this.rangeStyles.getStylesFromNodeHeirarchy(
      startNode,
      this.underlineNode!
    );
    const textNode = this.createWrapperNode("text", textContent);
    let wrapperNode = this.createWrapperNode("span", textNode);
    wrapperNode = this.rangeStyles.setClass(wrapperNode, this.UNDERLINE);
    return this.rangeStyles.setStyles(wrapperNode, styles);
  }

  private getInsertNodeBefore(): nodeOrNull {
    if (!this.underlineNode) return null;
    if (this.underlineNode.nextSibling) return this.underlineNode.nextSibling;
    if (this.underlineNode.parentNode) {
      for (const childNode of this.underlineNode.parentNode.childNodes) {
        if (this.underlineNode.isSameNode(childNode)) {
          if (childNode.nextSibling) {
            return childNode.nextSibling;
          }
        }
      }
    }
    return null;
  }

  private removeEmptySpans(node: Node) {
    if (node.textContent === "" && !node.hasChildNodes()) {
      const parentNode = node.parentNode;
      if (parentNode) {
        parentNode.removeChild(node);
      }
    }
    if (node.hasChildNodes()) {
      for (const childNode of node.childNodes) {
        this.removeEmptySpans(childNode);
      }
    }
  }
}
