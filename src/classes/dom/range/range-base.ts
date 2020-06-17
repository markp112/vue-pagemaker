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

export type HTMLTags = 'div' | 'span' | 'p' | 'b' | 'u' | 'i' | 'text' | 'br' | 'undefined';
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
    if (rv.ancestorNodeType === 'div') {
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
  
  public setStyle(node: Node, style: Style): void {
    const element = node as HTMLElement;
    for (const key in element.style) {
      if (key === style.style) {
        element.style[key] = style.value;
        break;
      }
    }
  }
  
  public createWrapperNode(htmlTag: HTMLTags): Node {
    return document.createElement(htmlTag);
  }

  public clearExistingStyles(node: Node, style: Style): void {
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
export class Paragraph extends RHBase {

  constructor(range: Range) {
    super(range);
  }

  public newLine() {
    if(!this.range) throw new Error('Range not set');
    let node: Node | Text | null = null;
    if (this.isRowMiddle()) {
      node = this.getContent();
    }
    if (this.rangeValues.start === this.rangeValues.end) {
      const paraNode: Node = this.createWrapperNode('p');
      const element: HTMLElement = paraNode as HTMLElement;
      node !== null ? paraNode.appendChild(node) : element.innerText = ' ';
      // element.style.lineHeight = '1em';
      const parentNode: Node | null = this.findNextNodeofType(this.range.commonAncestorContainer, 'DIV');
      if (parentNode) {
        const node = this.range.commonAncestorContainer.parentNode 
          ?  this.findNextNodeofType(this.range.commonAncestorContainer, 'P')
          : null;
        const insertAfterNode: Node | null = node?.nextSibling ? node.nextSibling : null;
        // parentNode.appendChild(paraNode);
        parentNode.insertBefore(paraNode, insertAfterNode);
        console.log('%c⧭', 'color: #cc0036', paraNode);
        this.setParagrah(paraNode);
      }
    } else {
      throw new Error('Parent node not found');
    }
  }

  private isRowMiddle(): boolean {
    if(!this.range) throw new Error('Range not set');
    if (this.range.collapsed) {
      return !(this.range.startOffset === (this.range.commonAncestorContainer as Text).length)
    } 
    return false;
  }

  private getContent() {
    const textNode: Text = this.getTextToEndOfLine(); 
    const spanStyles: Style[] = [];
    if (this.getParentNodeType(this.range.commonAncestorContainer) === 'span') {
      const spanNode = this.createWrapperNode('span');
      this.getNodeStyles(this.range.commonAncestorContainer, spanStyles);
      this.applyStyles(spanNode, spanStyles);
      spanNode.appendChild(textNode);
      return spanNode;
    }
    return textNode;
  }


  private getTextToEndOfLine(): Text {
    return (this.range.commonAncestorContainer as Text).splitText(this.range.startOffset);
  }

  private getParentNodeType(node: Node): HTMLTags {
    if (node.parentNode) {
      return this.getNodeType(node.parentNode);
    }
    return 'undefined';
  }

  private getNodeStyles(node: Node | null, spanStyles: Style[]): void {
    if (!node) return;
    if (this.getParentNodeType(node) === 'span') {
      this.getNodeStyles(node.parentNode, spanStyles);
    }
    const styles = (node as HTMLSpanElement).style;
    if (styles) {
      for (let index = 0; index < styles.length; index++) {
        if(styles[index]) {
          const style: Style = {
            style: styles[index],
            value: styles.getPropertyValue(styles[index]),
          };
          if (style.style !=='') spanStyles.push(style);
        } else {
          break;
        }
      };
    }
  }

  applyStyles(spanNode: Node, styles: Style[]) {
    if (styles.length === 0) return
      styles.forEach(style => {
        this.cleanStyle(style);        
        this.setStyle(spanNode, style);
      })
  }

  private cleanStyle(style: Style) {
    if (!style.style.includes('-')) return;
    const index = style.style.indexOf('-');
    const  styleName = style.style.substring(0, index)
      + style.style.replace('-','').charAt(index).toUpperCase()
      + style.style.substring(index + 2);;
    style.style = styleName;
  }

  private findNextNodeofType(node: Node, nodeType: string): Node | null {
    if (node.nodeName === nodeType) return node;
    return node.parentNode ? this.findNextNodeofType(node.parentNode, nodeType) : null;
  }


  private setParagrah(node: Node) {
    console.log('%c⧭', 'color: #1d0957', node);
    const range = document.createRange();
    range.setStart(node, 0);
    const end = node.childNodes.length ? node.childNodes.length : ((node as Text).length ? (node as Text).length : 0);
    range.setEnd(node, end);
    range.collapse(true);
    const selection = window.getSelection() ? window.getSelection() : document.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
}