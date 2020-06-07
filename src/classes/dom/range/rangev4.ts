import { Style } from '@/models/styles/styles';

interface RangeValuesInterface {
  start: number;
  end: number;
  startContent: string,
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

type HTMLTags = 'div' | 'span' | 'p' | 'b' | 'u' | 'i' | 'text' | 'br' | 'undefined';
interface KeyValueString {
  [key: string]: HTMLTags;
}

export class RHBase implements RHBaseInterface {
  range: Range;
  rangeValues: RangeValuesInterface;

  constructor(range: Range) {
    this.range = range;
    this.rangeValues = this.setSelection();
    console.clear();
    console.log('%c⧭', 'color: #eeff00', this.range);
    console.log('%c⧭', 'color: #cc7033', this.rangeValues);

  }

  private setSelection(): RangeValuesInterface {
    if (!this.range) throw new Error('RH: Range not set');
    const rv: RangeValuesInterface = {
      start: this.range.startOffset,
      end: this.range.endOffset,
      startContent:'', 
      endContent:'', 
      ancestorHasChildren: this.range.commonAncestorContainer.hasChildNodes(),
      ancestorNodeType: this.getNodeType(this.range.commonAncestorContainer),
      startContainerNodeType: this.getNodeType(this.range.startContainer),
      startContainerParent: this.range.startContainer.parentNode,
      endContainerNodeType: this.getNodeType(this.range.endContainer),
      endContainerParent: this.range.endContainer.parentNode,
      firstChild: 'undefined',
      ancestorContainsSpan: false,
      selectionLength: -1,
      selectionSpansRows: false,
    };
    rv.startContent = this.range.startContainer.textContent ? this.range.startContainer.textContent?.substring(this.range.startOffset) : '';
    rv.endContent = this.range.endContainer.textContent ? this.range.endContainer.textContent.substring(0, this.range.endOffset) : '';

    if (this.range.commonAncestorContainer.childNodes.length > 0) {
      this.range.commonAncestorContainer.childNodes.forEach(node => {
        if (this.getNodeType(node) === 'span') rv.ancestorContainsSpan = true;
      })
    }
    if (this.range.commonAncestorContainer.firstChild)
        rv.firstChild = this.getNodeType(this.range.commonAncestorContainer.firstChild);
    if (rv.ancestorNodeType === 'p') {
      rv.selectionSpansRows = true;
    }
 
    return rv;
  }

  public getNodeType(node: Node): HTMLTags {
    const nodeName = node.nodeName;
    const nodeMap: KeyValueString = {
      '#text': 'text',
      'SPAN': 'span',
      'P': 'p',
      'DIV': 'div',
    };
    const value: HTMLTags = nodeMap[nodeName];
    return value === undefined ? 'undefined' : value;
  }
}

export class RH extends RHBase {
  private fragment: DocumentFragment | null = null;

  constructor(range: Range) {
    super(range);
  }

  applyStyle(htmlTag: HTMLTags, style: Style): void {
    if (!this.range) throw new Error('RH: Range not set');
    console.log('%c%s', 'color: #5200cc', this.rangeValues.ancestorNodeType);
    if (this.rangeValues.ancestorNodeType === 'div') {
      this.processMultiRowSelection(htmlTag, style)
    }
  }

  processMultiRowSelection(htmlTag: HTMLTags, style: Style): void {
    if (!this.rangeValues) { throw new Error('RH: range values not set')};
    this.fragment = this.range.extractContents();
    this.clearStyleFromExistingSpans(style);
    const node: Node = this.fragment as Node;
    const nodeList: Node[] = [];
    if (!node.hasChildNodes()){ return };
    node.childNodes.forEach(childNode => {
      const nodeType: HTMLTags = this.getNodeType(childNode)
      if (nodeType === 'p') {
        const updatedNode = this.insertSpanInPara(childNode, style);
        nodeList.push(updatedNode);
      }
      if (nodeType === 'text') {
        const spanNode = this.wrapTextNode(childNode, style);
        nodeList.push(spanNode);
      }
    })

    const nodeCount = nodeList.length - 1;
    nodeList.forEach((node,index) => { 
      console.log('%c⧭', 'color: #73998c', index);
      if (index === 0 && this.rangeValues.selectionSpansRows) {
        if (this.rangeValues.startContainerParent) {
          this.rangeValues.startContainerParent.appendChild(node);
        }
      } else if ( index === nodeCount && this.rangeValues.selectionSpansRows) {
        if (this.rangeValues.endContainerParent) {
          this.rangeValues.endContainerParent.insertBefore(node, this.rangeValues.endContainerParent.childNodes[0]);
        }
      }
      else {
        this.range.insertNode(node)
      }
  })

  }
  public createWrapperNode(htmlTag: HTMLTags): Node {
    return document.createElement(htmlTag);
  }

  clearStyleFromExistingSpans(style: Style): void {
    if (!this.fragment) { throw new Error("fragment not set") }
    const spanList: NodeList = this.fragment?.querySelectorAll('span');
    spanList.forEach(span => this.clearExistingStyles(span, style))
  }

  private setStyle(node: Node, style: Style): void {
    const element = node as HTMLElement;
    for (const key in element.style) {
      if (key === style.style) {
        element.style[key] = style.value;
        break;
      }
    }
  }

  private clearExistingStyles(node: Node, style: Style): void {
    if (node.hasChildNodes()) {
      node.childNodes.forEach(node => {
        this.clearExistingStyles(node, style)
      });
    }
    const element: HTMLElement = node as HTMLElement;
    if (node.nodeName === '#text') return;
    if (element.style) {
      if (element.style.length > 0) {
        
        this.setStyle(element, style);
      }
    }
  }

  insertSpanInPara(node: Node, style: Style): Node {
    const spanNode = this.createWrapperNode('span');
    this.setStyle(spanNode, style);
    node.childNodes.forEach(childNode =>{
      spanNode.appendChild(childNode);
    })
    node.childNodes.forEach(node => node.remove);
    node.appendChild(spanNode);
    return node;
  }

  wrapTextNode(node: Node, style: Style) {
    const spanNode = this.createWrapperNode('span');
    this.setStyle(spanNode, style);
    spanNode.appendChild(node);
    return spanNode;
  }
  
}


export class Indents extends RHBase {
  INDENT = 1;

  constructor(range: Range) {
    super(range);
  }

  createIndent() {
    this.applyIndent('increase');
  }

  removeIndent() {
    this.applyIndent('decrease');
  }

  private applyIndent(direction: 'increase' | 'decrease') {
    if(!this.range) throw new Error('Range not set');
    const paraStartNode: Node | null = this.getParagraphStart(this.range.endContainer);
    if (!paraStartNode) return;
    let currentIndent: number = this.getCurrentIndent(paraStartNode);
    if (direction === 'increase')  currentIndent += this.INDENT
    else currentIndent === 0 ? currentIndent : currentIndent -= this.INDENT;
    (paraStartNode as HTMLElement).style.marginLeft = `${currentIndent}em`;
  }
  private getCurrentIndent(node: Node) {
    const currentMargin = (node as HTMLElement).style.marginLeft;
    if (currentMargin === '') return 0;
    return currentMargin.length > 3 ? parseInt(currentMargin.substr(0,2)) : parseInt(currentMargin.substr(0,1))
  }

  private getParagraphStart(node: Node): Node | null {
    if(!this.range) throw new Error('Range not set');
    if (node.nodeName !== 'P' ) {
      const nextNode: Node | null = node.previousSibling ? node.previousSibling : node.parentNode;
      if (nextNode)  return this.getParagraphStart(nextNode) 
      else throw new Error('start of paragraph not found');
    }
    return node;
  }
  

}


export class Paragraph extends RH{

  constructor(range: Range) {
    super(range);
  }

  public newLine() {
    if(!this.range) throw new Error('Range not set');
    if (this.rangeValues.start === this.rangeValues.end) {
      const paraNode: Node = this.createWrapperNode('p');
      const element: HTMLElement = paraNode as HTMLElement;
      element.contentEditable = 'plaintext-only';
      element.innerText = ' ';
      element.style.lineHeight = '0.8em';
      const parentNode: Node | null = this.getNodeToAppendTo(this.range.commonAncestorContainer);
      if (parentNode) {
        parentNode.appendChild(paraNode);
        const newSelection = document.createRange();
        newSelection.setStart((paraNode as Node),0);
        newSelection.setEnd(paraNode as Node, 0);
        const selection = window.getSelection ? window.getSelection() : document.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(newSelection);
        selection?.focusNode;
      }
    } else {
      throw new Error('Parent node not found');
    }
  }

  private getNodeToAppendTo(node: Node): Node | null {
    if (node.nodeName === 'DIV') return node;
    return node.parentNode ? this.getNodeToAppendTo(node.parentNode) : null;
  }
}
