import { RHBase, HTMLTags, ClassOrStyle } from "./range/range-base";
import { Style } from "@/models/styles/styles";
import { RangeStyles } from "./range/rangeStyling/rangeStyles";

export class MultiRowBase extends RHBase {
  private nodeList: Node[] = [];
  private rangeStyling = new RangeStyles();

  constructor(range: Range) {
    super(range);
  }

  public applyStyle(
    htmlTag: HTMLTags,
    style: Style,
    classorStyle: ClassOrStyle
  ) {
    this.clearStylingFromExistingSpans(style, classorStyle);
    const node: ParentNode = this.fragment as ParentNode;
    this.nodeList = [];
    if (node.childElementCount === 0) {
      return;
    }
    const countOfChildNodes = node.childElementCount - 1;
    for (let index = 0; index <= countOfChildNodes; index++) {
      const childNode = node.children[index];
      if (childNode === node.firstElementChild) {
        this.extractTextFragmentToSpan(childNode, style, classorStyle);
        continue;
      }
      if (
        childNode === node.lastElementChild &&
        this.rangeValues.endContainerNodeType === "text"
      ) {
        this.extractTextFragmentToSpan(childNode, style, classorStyle);
        continue;
      }
      const nodeType: HTMLTags = this.getNodeType(childNode);
      if (nodeType === "p") {
        this.insertSpanInPara(childNode, style, classorStyle);
        // this.extractTextFragmentToSpan(childNode, style);
        continue;
      }
      if (nodeType === "text") {
        this.wrapTextNode(childNode, style, classorStyle);
        continue;
      }
    }
  }

  public reInsertNodes() {
    const nodeCount = this.nodeList.length - 1;
    let middleNodeOrder = nodeCount - 1;
    this.nodeList.forEach((node, index) => {
      if (index === 0) {
        if (this.rangeValues.startContainerParent) {
          this.rangeValues.startContainerParent.appendChild(node);
        }
      } else if (index === nodeCount) {
        if (this.rangeValues.endContainerParent) {
          this.rangeValues.endContainerParent.insertBefore(
            node,
            this.rangeValues.endContainerParent.childNodes[0]
          );
        }
      } else {
        const nodeToInsert = this.nodeList[middleNodeOrder];
        this.range.insertNode(nodeToInsert);
        middleNodeOrder--;
      }
    });
  }

  clearStylingFromExistingSpans(
    style: Style,
    ClassOrStyle: ClassOrStyle
  ): void {
    if (!this.fragment) {
      throw new Error("fragment not set");
    }
    const spanList: NodeList = this.fragment.querySelectorAll("span");
    if (this.rangeStyling.isStyleTag(ClassOrStyle)) {
      spanList.forEach(span =>
        this.rangeStyling.clearExistingStyles(span, style)
      );
    } else {
      spanList.forEach(span =>
        this.rangeStyling.clearExistingClasses(span, style)
      );
    }
  }

  insertSpanInPara(node: Node, style: Style, classOrStyle: ClassOrStyle): void {
    const spanNode = this.createWrapperNode("span");
    this.rangeStyling.setStyleOrClass(spanNode, style, classOrStyle);
    (spanNode as HTMLSpanElement).innerHTML = (node as HTMLElement).innerHTML;
    (node as HTMLElement).innerHTML = "";
    node.childNodes.forEach(node => node.remove);
    node.appendChild(spanNode);
    this.nodeList.push(node);
  }

  extractTextFragmentToSpan(
    node: Node,
    style: Style,
    classOrStyle: ClassOrStyle
  ) {
    const spanNode = this.createWrapperNode("span");
    this.rangeStyling.setStyleOrClass(spanNode, style, classOrStyle);
    (spanNode as HTMLSpanElement).innerHTML = (node as HTMLElement).innerHTML;
    this.nodeList.push(spanNode);
  }

  wrapTextNode(node: Node, style: Style, classOrStyle: ClassOrStyle) {
    const spanNode = this.createWrapperNode("span");
    this.rangeStyling.setStyleOrClass(spanNode, style, classOrStyle);
    spanNode.appendChild(node);
    this.nodeList.push(spanNode);
  }
}
