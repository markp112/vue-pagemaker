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


export class Paragraph extends RHBase{

  constructor(range: Range) {
    super(range);
  }

  public newLine() {
    if(!this.range) throw new Error('Range not set');
    if (this.isRowMiddle()) {
      const textToEndofLine: Text = this.getTextToEndOfLine(); 
      const spanNode = this.createWrapperNode('span');
      if (this.getParentNodeType(this.range.commonAncestorContainer) === 'span') {
        
        const node = this.getNodeStyles(this.range.commonAncestorContainer, spanNode);
        const styles = (spanNode as HTMLSpanElement).style
        if (styles.cssText !=='') spanNode.appendChild(textToEndofLine);

      }
      
    }
    if (this.rangeValues.start === this.rangeValues.end) {
      const paraNode: Node = this.createWrapperNode('p');
      const element: HTMLElement = paraNode as HTMLElement;
      element.contentEditable = 'plaintext-only';
      element.innerText = ' ';
      element.style.lineHeight = '0.8em';
      const parentNode: Node | null = this.getNodeToAppendTo(this.range.commonAncestorContainer);
      if (parentNode) {
        const insertAfterNode = this.range.commonAncestorContainer.parentNode 
          ?  this.range.commonAncestorContainer.parentNode.nextSibling
          : null;
        // parentNode.appendChild(paraNode);
        parentNode.insertBefore(paraNode, insertAfterNode);
        const newSelection = document.createRange();
        newSelection.setStart((paraNode as Node),0);
        newSelection.setEnd(paraNode as Node, 0);
        const selection = window.getSelection ? window.getSelection() : document.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(newSelection);
        selection?.focusNode;
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

  private getTextToEndOfLine(): Text {
    return (this.range.commonAncestorContainer as Text).splitText(this.range.startOffset);
  }

  private getParentNodeType(node: Node): HTMLTags {
    if (node.parentNode) {
      return this.getNodeType(node.parentNode);
    }
    return 'undefined';
  }

  getNodeStyles(node: Node | null, spanNode: Node): Node {
    if (!node) return spanNode;
    console.log('%c%s', 'color: #735656', 'getNodeStyles');
    if (this.getParentNodeType(node) === 'span') {
      return this.getNodeStyles(node.parentNode, spanNode);
    }
    console.log((node as HTMLSpanElement).style)
    const styles = (node as HTMLSpanElement).style;
    
    for (let index = 0; index < styles.length; index++) {
      if(styles[index]) {
        const style: Style = {
          style: styles[index],
          value: styles.getPropertyValue(styles[index]),
        };
        this.setStyle(spanNode, style);
      } else {
        break;
      }
    }
    return spanNode;
  }


  private getNodeToAppendTo(node: Node): Node | null {
    if (node.nodeName === 'DIV') return node;
    return node.parentNode ? this.getNodeToAppendTo(node.parentNode) : null;
  }




  private setParagrah(node: Node) {
    // document.createRange() creates new range object
const rangeobj = document.createRange();
console.log('%c⧭', 'color: #bfffc8', rangeobj);

// Here 'rangeobj' is created Range Object
const selectobj = window.getSelection();

// Here 'selectobj' is created object for window
// get selected or caret current position.
// Setting start position of a Range
rangeobj.setStart(node, 1);

// Setting End position of a Range
rangeobj.setEnd(node, 1);

// Collapses the Range to one of its
// boundary points
rangeobj.collapse(true);

// Removes all ranges from the selection
// except Anchor Node and Focus Node
if (selectobj) {
selectobj.removeAllRanges();

// Adds a Range to a Selection
selectobj.addRange(rangeobj);
}
  }
}