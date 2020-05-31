import { Style } from '@/models/styles/styles';

interface RangeValuesInterface {
  start: number;
  end: number;
  selectionLength: number;
  ancestorNode: HTMLTags;
  ancestorHasChildren: boolean;
  firstChild: HTMLTags;
  startContainer: HTMLTags;
  ancestorContainsSpan: boolean;
}
interface RHBaseInterface {
  range: Range;
  rangeValues: RangeValuesInterface;
  getNodeType: (nodeName: string) => HTMLTags;
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
  }

  private setSelection(): RangeValuesInterface {
    if (!this.range) throw new Error('RH: Range not set');
    const rv: RangeValuesInterface = {
      start: this.range.startOffset,
      end: this.range.endOffset,
      ancestorHasChildren: this.range.commonAncestorContainer.hasChildNodes(),
      ancestorNode: this.getNodeType(this.range.commonAncestorContainer.nodeName),
      startContainer: this.getNodeType(this.range.startContainer.nodeName),
      firstChild: 'undefined',
      ancestorContainsSpan: false,
      selectionLength: -1,
    }
    if (this.range.commonAncestorContainer.childNodes.length > 0) {
      this.range.commonAncestorContainer.childNodes.forEach(node => {
        if (this.getNodeType(node.nodeName) === 'span') rv.ancestorContainsSpan = true;
      })
    }
    if (this.range.commonAncestorContainer.firstChild)
        rv.firstChild = this.getNodeType(this.range.commonAncestorContainer.firstChild.nodeName);
    return rv;
  }

  public getNodeType(nodeName: string): HTMLTags {
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

  applyStyle(htmlTag: HTMLTags, style: Style) {
    if (!this.range) throw new Error('RH: Range not set');
    console.log('%c⧭', 'color: #eeff00', this.range);
    if (!this.rangeValues.ancestorHasChildren) {
      this.createWrapperNoChildren(htmlTag, style);
    }
    if (this.rangeValues.ancestorHasChildren) {
        this.createWrapperWithChildren(htmlTag, style);
    }
  }

  private getTextNodeLength(node: Node): number {
    if (node.nodeName !=='#text') return -1;
    return (node as Text).length;
  }

  private createWrapperNoChildren(htmlTag: HTMLTags, style: Style) {
    if(!this.range) throw new Error('Range not set');
    this.fragment = this.range.extractContents();
    const wrapperNode: Node = this.createWrapperNode(htmlTag);
    this.setStyle(wrapperNode, style.style, style.value);
    if (this.fragment) wrapperNode.appendChild(this.fragment)
    this.insertNode(wrapperNode);
  }

  private createWrapperWithChildren(htmlTag: HTMLTags, style: Style) {
    if(!this.range) throw new Error('Range not set');
    if (this.range.commonAncestorContainer === this.range.startContainer) {
      this.createNodeFromFragment(htmlTag, style)
      return;
    }
    const firstNodeLength = this.getTextNodeLength(this.range.commonAncestorContainer.childNodes[0]);
    if (this.rangeValues.start === firstNodeLength) {
      this.createNodeFromFragment(htmlTag, style)
      return;
    }
    this.createNewNodeAsWrapper(htmlTag, style);
  }

  createNodeFromFragment(htmlTag: HTMLTags, style: Style) {
    if(!this.range) throw new Error('Range not set');
    this.fragment = this.range.extractContents();
    const wrapperNode = this.fragment ? this.fragment.querySelector('span') : this.createWrapperNode(htmlTag);
    if (wrapperNode) {
      this.clearExistingStyles(wrapperNode, style.style, htmlTag)
      this.setStyle(wrapperNode, style.style, style.value);
      wrapperNode.childNodes.forEach(node => {this.removeNodesWithEmptyStyles(node);})
      this.insertNode(wrapperNode);
    }
  }

  private createNewNodeAsWrapper(htmlTag: HTMLTags, style: Style) {
    if(!this.range) throw new Error('Range not set');
    this.fragment = this.range.extractContents();
    const wrapperNode = this.createWrapperNode(htmlTag);
    this.setStyle(wrapperNode, style.style, style.value);
    const fragmentNode: Node = this.fragment as Node;
    this.clearExistingStyles(fragmentNode, style.style, htmlTag)
    this.removeNodesWithEmptyStyles(fragmentNode);
    if (fragmentNode) wrapperNode.appendChild(fragmentNode);
    this.insertNode(wrapperNode);
  }

  public createWrapperNode(htmlTag: HTMLTags): Node {
    return document.createElement(htmlTag);
  }

  private setStyle(node: Node, styleName: string, value: string): void {
    const element = node as HTMLElement;
    for (const key in element.style) {
      if (key === styleName) {
        element.style[key] = value;
        break;
      }
    }
  }

  private clearExistingStyles(nodeList: Node, styleName: string, htmlTag: HTMLTags): void {
    if (nodeList.hasChildNodes()) {
      nodeList.childNodes.forEach(node => {
        this.clearExistingStyles(node, styleName, htmlTag)
      });
    }
    const element: HTMLElement = nodeList as HTMLElement;
    if (nodeList.nodeName === '#text') return;
    if (element.style) {
      if (element.style.length > 0) {
        this.setStyle(element, styleName, '');
      }
    }
  }

  private removeNodesWithEmptyStyles(node: Node) {
    if (!node.hasChildNodes()) return;
    node.childNodes.forEach(childNode => {
      if (childNode.hasChildNodes()) this.removeNodesWithEmptyStyles(childNode);
      if (childNode.nodeName === '#text') return;
      const element: HTMLElement = childNode as HTMLElement;
      if (!element) return;
      if (element.style.length > 0) return;
        const innerText: string = element.innerText;
        if (element.previousSibling) {
          element.previousSibling.textContent  += innerText;
        } else if (element.parentNode) {
          element.parentNode.textContent += innerText;
        }
        childNode.remove();
    })
  }

  private insertNode(wrapperNode: Node) {
    this.range?.insertNode(wrapperNode);
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
      element.id = 'p1';
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

