/**
 * @description : if the entire selection is underlined remove it otherwise underline the selection taking into account parts may aleady be underlined
 *
 */

import { HTMLTags } from "../range-base";
import { MultiRowBase } from "../../multi-row-base";
import { Style } from "@/models/styles/styles";

export class MultiRowUnderline extends MultiRowBase {
  private isUnderlined = false;
  private hasTextNode = false;
  private hasSpanNodeNoUnderline = false;
  private underline: Style = {
    style: "text-decoration",
    value: "underline"
  };

  constructor(range: Range) {
    super(range);
  }

  public process(htmlTag: HTMLTags) {
    if (!this.rangeValues) {
      throw new Error("RH: range values not set");
    }
    this.fragment = this.range.extractContents();
    const node: ParentNode = this.fragment as ParentNode;

    this.isUnderlined = this.checkForUnderline(node);
    if (this.isUnderlined) {
      this.hasTextNode = this.checkForTextNode(node);
    }
    if (!this.hasTextNode) {
      this.hasSpanNodeNoUnderline = this.checkForSpanNodeWithoutUnderline(node);
    }
    // this.isUnderlined && !this.hasSpanNodeNoUnderline && !this.hasTextNode
    //   ? this.removeUnderline(node)
    //   : this.addUnderline(node, htmlTag);
  }

  /**
   * @description check if there is an underline class present on any of the child nodes of the parent
   * @param parentNode
   */
  private checkForUnderline(node: ParentNode): boolean {
    for (let index = 0; index < node.childElementCount; index++) {
      const parentNode = node.children[index];
      return this.findUnderlineInChildren(parentNode);
    }
    return false;
  }

  private findUnderlineInChildren(parentNode: Node): boolean {
    for (let index = 0; index < parentNode.childNodes.length; index++) {
      const childNode = parentNode.childNodes[index];
      if (childNode.nodeName === "SPAN") {
        const spanElement = childNode as HTMLSpanElement;
        if (spanElement.className.includes("underline")) {
          return true;
        }
      }
      if (childNode.hasChildNodes()) {
        return this.findUnderlineInChildren(childNode);
      }
    }
    return false;
  }

  /**
   * @description check for the presence of text node in the first children of each
   * @param parentNode
   */
  private checkForTextNode(node: ParentNode): boolean {
    for (let index = 0; index < node.childElementCount; index++) {
      const parentNode = node.children[index];
      for (let index = 0; index < parentNode.childNodes.length; index++) {
        const childNode = parentNode.childNodes[index];
        if (childNode.nodeName === "#text") {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * @description check if there are any span nodes at the first level of child nodes for
   *  that node do not have a class underline
   *
   * @param parentNode
   */
  private checkForSpanNodeWithoutUnderline(node: ParentNode): boolean {
    for (let index = 0; index < node.childElementCount; index++) {
      const parentNode = node.children[index];
      for (let index = 0; index < parentNode.childNodes.length; index++) {
        const childNode = parentNode.childNodes[index];
        if (childNode.nodeName === "SPAN") {
          if (!(childNode as HTMLSpanElement).className.includes("underline")) {
            return true;
          }
        }
      }
    }
    return false;
  }

  

  addUnderlineToSelection(parentNode: ParentNode, htmlTag: HTMLTags) {
    this.applyStyle(htmlTag, this.underline, "class");
    this.reInsertNodes();
  }

}
