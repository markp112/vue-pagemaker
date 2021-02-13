
interface RangeValuesInterface {
  start: number;
  end: number;
  selectedContent: string;
  startContent: string;
  endContent: string;
  selectionLength: number;
  ancestorNodeType: HTMLTags;
  ancestorHasChildren: boolean;
  firstChild: HTMLTags;
  startContainerNodeType: HTMLTags;
  endContainerNodeType: HTMLTags;
  ancestorContainsSpan: boolean;
  selectionSpansRows: boolean;
  startContainerParent: Node | null;
  endContainerParent: Node | null;
}
interface RHBaseInterface {
  range: Range;
  rangeValues: RangeValuesInterface;
  getNodeType: (node: Node) => HTMLTags;
}

export type HTMLTags =
  | "div"
  | "span"
  | "p"
  | "b"
  | "u"
  | "i"
  | "text"
  | "br"
  | "undefined";
interface KeyValueString {
  [key: string]: HTMLTags;
}

export type ClassOrStyle = "class" | "style";

export class RHBase implements RHBaseInterface {
  range: Range;
  rangeValues: RangeValuesInterface;
  fragment: DocumentFragment | null = null;

  constructor(range: Range) {
    console.clear();
    this.range = range;
    // console.log("%c⧭", "color: #cc0036", range);
    this.rangeValues = this.setSelection();
  }

  private setSelection(): RangeValuesInterface {
    if (!this.range) throw new Error("RH: Range not set");
    const rv: RangeValuesInterface = {
      start: this.range.startOffset,
      end: this.range.endOffset,
      startContent: "",
      endContent: "",
      selectedContent: "",
      ancestorHasChildren: (this.range
        .commonAncestorContainer as HTMLElement).hasChildNodes(),
      ancestorNodeType: this.getNodeType(this.range.commonAncestorContainer),
      startContainerNodeType: this.getNodeType(this.range.startContainer),
      startContainerParent: this.range.startContainer.parentNode,
      endContainerNodeType: this.getNodeType(this.range.endContainer),
      endContainerParent: this.range.endContainer.parentNode,
      firstChild: "undefined",
      ancestorContainsSpan: false,
      selectionLength: -1,
      selectionSpansRows: false
    };
    this.getSelectedTextElements(rv);
    if (this.range.commonAncestorContainer.hasChildNodes()) {
      this.range.commonAncestorContainer.childNodes.forEach(node => {
        if (this.getNodeType(node) === "span") rv.ancestorContainsSpan = true;
      });
    }
    if (this.range.commonAncestorContainer.firstChild)
      rv.firstChild = this.getNodeType(
        this.range.commonAncestorContainer.firstChild
      );
    if (rv.ancestorNodeType === "div") {
      rv.selectionSpansRows = true;
    }
    return rv;
  }

  // needs work to take into account spans between start and end container plus multi row selections
  private getSelectedTextElements(rv: RangeValuesInterface) {
    const startContainer = this.range.startContainer;
    const startContainerText = startContainer.textContent
      ? startContainer.textContent
      : "";
    const endContainerText = this.range.endContainer.textContent
      ? this.range.endContainer.textContent
      : "";
    const textLengthStart =
      this.range.startOffset === 0
        ? startContainerText.length
        : this.range.startOffset;
    rv.startContent = startContainerText.substring(0, textLengthStart);
    rv.endContent = endContainerText.substring(this.range.endOffset);
    rv.selectedContent = startContainerText.substring(
      this.range.startOffset,
      this.range.endOffset
    );
    if (
      this.range.endOffset > rv.selectedContent.length &&
      this.range.endOffset > startContainerText.length
    ) {
      rv.selectedContent = `${rv.selectedContent}${endContainerText.substring(
        0,
        this.range.endOffset
      )}`;
    }
  }

  public getNodeType(node: Node): HTMLTags {
    const nodeName = node.nodeName;
    const nodeMap: KeyValueString = {
      "#text": "text",
      SPAN: "span",
      P: "p",
      DIV: "div"
    };
    const value: HTMLTags = nodeMap[nodeName];
    return value === undefined ? "undefined" : value;
  }

  public setElementId(node: Node, id: string): void {
    const element = node as HTMLElement;
    element.id = id;
  }

  public checkForEmptySpan(node: Node): boolean {
    if (node.nodeName !== "SPAN") return false;
    const spanElement = node as HTMLSpanElement;
    return spanElement.className === "" && spanElement.style.length === 0;
  }

  public replaceEmptySpanWithTextNode(node: Node): Node {
    const content = node.textContent;
    const newNode = this.createWrapperNode("text");
    newNode.textContent = content;
    return newNode;
  }

  public createWrapperNode(htmlTag: HTMLTags): Node;
  public createWrapperNode(htmlTag: HTMLTags, textContent: string): Node;
  public createWrapperNode(htmlTag: HTMLTags, childNode: Node): Node;

  public createWrapperNode(htmlTag: HTMLTags, childNode?: Node | string): Node {
    const node = document.createElement(htmlTag);
    if (typeof childNode === "object") {
      node.appendChild(childNode);
    }
    if (typeof childNode === "string") {
      node.textContent = childNode;
    }
    return node;
  }

  public getTextNodeLength(node: Node): number {
    if (node.nodeName !== "#text") return -1;
    return (node as Text).length;
  }

  public insertNode(wrapperNode: Node) {
    if (this.range) {
      this.range.insertNode(wrapperNode);
    }
  }

  public findNextNodeofType(node: Node, nodeType: string): Node | null {
    if (node.nodeName === nodeType) return node;
    return node.parentNode
      ? this.findNextNodeofType(node.parentNode, nodeType)
      : null;
  }
}

export class Indents extends RHBase {
  INDENT = 1;

  constructor(range: Range) {
    super(range);
  }

  createIndent() {
    this.applyIndent("increase");
  }

  removeIndent() {
    this.applyIndent("decrease");
  }

  private applyIndent(direction: "increase" | "decrease") {
    if (!this.range) throw new Error("Range not set");
    const paraStartNode: Node | null = this.getParagraphStart(
      this.range.endContainer
    );
    if (!paraStartNode) return;
    let currentIndent: number = this.getCurrentIndent(paraStartNode);
    if (direction === "increase") currentIndent += this.INDENT;
    else currentIndent === 0 ? currentIndent : (currentIndent -= this.INDENT);
    (paraStartNode as HTMLElement).style.marginLeft = `${currentIndent}em`;
  }

  private getCurrentIndent(node: Node) {
    const currentMargin = (node as HTMLElement).style.marginLeft;
    if (currentMargin === "") return 0;
    return currentMargin.length > 3
      ? parseInt(currentMargin.substr(0, 2))
      : parseInt(currentMargin.substr(0, 1));
  }

  private getParagraphStart(node: Node): Node | null {
    if (!this.range) throw new Error("Range not set");
    if (node.nodeName !== "P") {
      const nextNode: Node | null = node.previousSibling
        ? node.previousSibling
        : node.parentNode;
      if (nextNode) return this.getParagraphStart(nextNode);
      else throw new Error("start of paragraph not found");
    }
    return node;
  }
}
