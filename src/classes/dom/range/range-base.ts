import { Style, StyleTags, StylesMap } from '@/models/styles/styles';


interface RangeValuesInterface {
  start: number;
  end: number;
  selectedContent: string;
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

export type ClassOrStyle = 'class' | 'style';

export class RHBase implements RHBaseInterface {
  range: Range;
  rangeValues: RangeValuesInterface;
  fragment: DocumentFragment | null = null;

  constructor(range: Range) {
    console.clear();
    this.range = range;
    console.log('%c⧭', 'color: #cc0036', range);
    this.rangeValues = this.setSelection();
  }

  private setSelection(): RangeValuesInterface {
    if (!this.range) throw new Error('RH: Range not set');
    const rv: RangeValuesInterface = {
      start: this.range.startOffset,
      end: this.range.endOffset,
      startContent: '', 
      endContent: '', 
      selectedContent: '',
      ancestorHasChildren: (this.range.commonAncestorContainer as HTMLElement).hasChildNodes(),
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
    this.getSelectedTextElements(rv);
    if (this.range.commonAncestorContainer.hasChildNodes()) {
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
  
  // needs work to take into account spans between start and end container plus multi row selections
  private getSelectedTextElements(rv: RangeValuesInterface) {
    const startContainer = this.range.startContainer;
    const startContainerText = startContainer.textContent ? startContainer.textContent : '';
    const endContainerText = this.range.endContainer.textContent ? this.range.endContainer.textContent : '';
    const textLengthStart = this.range.startOffset === 0 ? startContainerText.length : this.range.startOffset;
    rv.startContent = startContainerText.substring(0, textLengthStart);
    rv.endContent = endContainerText.substring(this.range.endOffset);
    rv.selectedContent = startContainerText.substring(this.range.startOffset, this.range.endOffset);
    if (this.range.endOffset > rv.selectedContent.length && this.range.endOffset > startContainerText.length) {
      rv.selectedContent = `${rv.selectedContent}${endContainerText.substring(0, this.range.endOffset)}`;
    }
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
  
  public isStyleTag(classOrStyle: ClassOrStyle): boolean {
    return classOrStyle === 'style';
  }

  public setStyleOrClass(node: Node, style: Style, classOrStyle: ClassOrStyle ) {
    if (this.isStyleTag(classOrStyle)) {
      this.setStyle(node, style);
    } else {
      this.setClass(node, style);
    }
  }

  public setStyles(node: Node, styles: Style[]) {
    styles.forEach(style => {
      this.setStyle(node, style);
    })
  }

  public setStyle(node: Node, style: Style): void {
    const element = node as HTMLElement;
    element.style.setProperty(style.style, style.value)
  }
  
  public setClass(node: Node, style: Style): void;

  public setClass(node: Node, style: string): void;
  
  public setClass(node: Node, styleOrString: string | Style): void {
    const element = node as HTMLElement;
    if (typeof(styleOrString) == 'string' ) {
      element.className = styleOrString;
    } else {
      element.className = `${styleOrString.style} ${styleOrString.value}`;
    }
  }

  public setElementId(node: Node, id: string): void {
    const element = node as HTMLElement;
    element.id = id;
  }
  
  public clearExistingClasses(node: Node, style: Style) {
    if (node.hasChildNodes()) {
      node.childNodes.forEach(node => {
        this.clearExistingClasses(node, style);
      })
    }
    // each class will have a style name (which does nothing)
    // followed by the actual Tailwind class
    // style.style is used to identify if there is already 
    // a style defined of the same class family e.g. font weight
    const element: HTMLElement = node as HTMLElement;
    if (element.className) {
      if (element.className.includes(style.style)) {
        const classes = element.className.split(' ');
          let itemPos = 0;
          classes.forEach((item, index) => {
            if (item === style.style) {
              itemPos = index;
            }
          })
          classes[itemPos] = '';
          classes[itemPos + 1] = '';
          element.className = classes.filter(item => item !== '').join(' ');
      }
    }
  }
  
  public checkForEmptySpan(node: Node): boolean {
    if (node.nodeName !== 'SPAN') return false;
    const spanElement = node as HTMLSpanElement;
    return spanElement.className === '' && spanElement.style.length === 0;
  }

  public removeEmptySpan(node: Node): Node {
    const content = node.textContent;
    const newNode = this.createWrapperNode('text');
    newNode.textContent = content;
    return newNode;
  }

  public createWrapperNode(htmlTag: HTMLTags): Node {
    return document.createElement(htmlTag);
  }

  public getTextNodeLength(node: Node): number {
    if (node.nodeName !=='#text') return -1;
    return (node as Text).length;
  }

  public insertNode(wrapperNode: Node) {
    this.range?.insertNode(wrapperNode);
  }

  public removeNodesWithEmptyStyles(node: Node) {
    if (!node.hasChildNodes()) return;
    node.childNodes.forEach(childNode => {
      if (childNode.hasChildNodes()) this.removeNodesWithEmptyStyles(childNode);
      if (childNode.nodeName === '#text') return;
      const element: HTMLElement = childNode as HTMLElement;
      if (!element) return;
      if (element.style.length > 0) return;
        const innerText: string = element.innerText;
        if (element.previousSibling) {
          element.previousSibling.textContent += innerText;
        } else if (element.parentNode) {
          element.parentNode.textContent += innerText;
        }
        childNode.remove();
    })
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

  public findNextNodeofType(node: Node, nodeType: string): Node | null {
    if (node.nodeName === nodeType) return node;
    return node.parentNode ? this.findNextNodeofType(node.parentNode, nodeType) : null;
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



