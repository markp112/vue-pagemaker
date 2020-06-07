// /// version 2 of range class

// import { Style } from '@/models/styles/styles';

// const INDENT = 1;


// interface RHInterface {
//   start: number;
//   end: number;
//   selectionLength: number;
//   ancestorNode: HTMLTags;
//   ancestorHasChildren: boolean;
//   firstChild: HTMLTags;
//   startContainer: HTMLTags;
//   ancestorContainsSpan: boolean;

// }


// type HTMLTags = 'div' | 'span' | 'p' | 'b' | 'u' | 'i' | 'text' | 'br' | 'undefined';
// type ComponentType = Vue | Element | Vue[] | Element[]
// interface KeyValueString {
//   [key: string]: HTMLTags;
// }

// class Indents {
//   _range: Range;
//   rangeValues: RHInterface;
  
//   constructor(range: Range, rangeValues: RHInterface) {
//     this._range = range;
//     this.rangeValues = rangeValues;
//   }

//   createIndent() {
//     console.log('%c%s', 'color: #33cc99', 'createIndent');
//     if(!this._range) throw new Error('Range not set');
//     const paraStartNode: Node | null = this.getParagraphStart(this._range.endContainer);
//     console.log('%c⧭', 'color: #364cd9', paraStartNode);
//     if (!paraStartNode) return;
//     let currentIndent: number = this.getCurrentIndent(paraStartNode);
//     currentIndent += INDENT;
//     (paraStartNode as HTMLElement).style.marginLeft = `${currentIndent}em`;
//   }

//   removeIndent() {
//     if(!this._range) throw new Error('Range not set');
//     const paraStartNode: Node | null = this.getParagraphStart(this._range.endContainer);
//     if (!paraStartNode) return;
//     let currentIndent: number = this.getCurrentIndent(paraStartNode);
//     currentIndent === 0 ? currentIndent : currentIndent -= INDENT;
//     (paraStartNode as HTMLElement).style.marginLeft = `${currentIndent}em`;
//   }

//   getCurrentIndent(node: Node) {
//     const currentMargin = (node as HTMLElement).style.marginLeft;
//     if (currentMargin === '') return 0;
//     return currentMargin.length > 3 ? parseInt(currentMargin.substr(0,2)) : parseInt(currentMargin.substr(0,1))
//   }

//   getParagraphStart(node: Node): Node | null {
//     if(!this._range) throw new Error('Range not set');

//     console.log('%c⧭', 'color: #ffa280', node);
//     if (node.nodeName !== 'P' ) {
//       const nextNode: Node | null = node.previousSibling ? node.previousSibling : node.parentNode;
//       if (nextNode)  return this.getParagraphStart(nextNode) 
//       else throw new Error('start of paragraph not found');
//     }
//     return node;

//   }
// }


// class Paragraph {

//   _range: Range | null;
//   rangeValues: RHInterface;

//   constructor(range: Range, rangeValues: RHInterface) {
//     this._range = range;
//     this.rangeValues = rangeValues;
//   }

//   public newLine() {
//     if(!this._range) throw new Error('Range not set');
//     if (this.rangeValues.start === this.rangeValues.end) {
//       const paraNode: Node = this.createWrapperNode('p');
//       const element: HTMLElement = paraNode as HTMLElement;
//       element.id = 'p1';
//       element.contentEditable = 'plaintext-only';
//       element.innerText = ' ';
//       element.style.lineHeight = '0.8em';
//       const parentNode: Node | null = this.getNodeToAppendTo(this._range.commonAncestorContainer);
//       if (parentNode) {
//         parentNode.appendChild(paraNode);
//         const newSelection = document.createRange();
//         newSelection.setStart((paraNode as Node),0);
//         newSelection.setEnd(paraNode as Node, 0);
//         const selection = window.getSelection ? window.getSelection() : document.getSelection();
//         selection?.removeAllRanges();
//         selection?.addRange(newSelection);
//         selection?.focusNode;
//       }
//     } else {
//       throw new Error('Parent node not found');
//     }
//   }

//   private getNodeToAppendTo(node: Node): Node | null {
//     if (node.nodeName === 'DIV') return node;
//     return node.parentNode ? this.getNodeToAppendTo(node.parentNode) : null;
//   }

//   private createWrapperNode(htmlTag: HTMLTags): Node {
//     return document.createElement(htmlTag);
//   }
// }


// export class RH {
//   _range: Range | null = null;
//   rangeValues: RHInterface = {
//     start: -1,
//     end: -1,
//     ancestorHasChildren: false,
//     ancestorNode: 'undefined',
//     firstChild: 'undefined',
//     selectionLength: -1,
//     startContainer: 'undefined',
//     ancestorContainsSpan: false,
//   }
//   private fragment: DocumentFragment | null = null;

//   set range(range: Range | null) {
//     this._range = range;
//     console.log('%c⧭', 'color: #00e600', this._range);
//   }

//   get range(): Range | null {
//     return this._range;
//   }

//   applyStyle(htmlTag: HTMLTags, style: Style) {
//     if (!this._range) throw new Error('RH: Range not set');
//     this.setSelection();
//     if (!this.rangeValues.ancestorHasChildren) {
//       this.createWrapperNoChildren(htmlTag, style);
//     }
//     if (this.rangeValues.ancestorHasChildren) {
//         this.createWrapperWithChildren(htmlTag, style);
//     }
//   }

//   private setSelection() {
//     if (!this._range) throw new Error('RH: Range not set');
//     this.rangeValues.start = this._range.startOffset;
//     this.rangeValues.end = this._range.endOffset;
//     this.rangeValues.ancestorHasChildren = this._range.commonAncestorContainer.hasChildNodes();
//     this.rangeValues.ancestorNode = this.getNodeType(this._range.commonAncestorContainer.nodeName);
//     this.rangeValues.startContainer = this.getNodeType(this._range.startContainer.nodeName);
//     if (this.rangeValues.ancestorHasChildren) {
//       if (this._range.commonAncestorContainer.firstChild)
//         this.rangeValues.firstChild = this.getNodeType(this._range.commonAncestorContainer.firstChild.nodeName);
//       // if (this._range.commonAncestorContainer.lastChild) 
//       //   this.rangeValues.firstChild = this.getNodeType(this._range.commonAncestorContainer.lastChild.nodeName);
//       if (this._range.commonAncestorContainer.childNodes.length > 0) {
//         this._range.commonAncestorContainer.childNodes.forEach(node => {
//           if (this.getNodeType(node.nodeName) === 'span') this.rangeValues.ancestorContainsSpan = true;
//         })
//       }
//     }
//   }

//   private getTextNodeLength(node: Node): number {
//     if (node.nodeName !=='#text') return -1;
//     return (node as Text).length;
//   }

//   private getNodeType(nodeName: string): HTMLTags  {
//     const nodeMap: KeyValueString = {
//       '#text': 'text',
//       'SPAN': 'span',
//       'P': 'p',
//       'DIV': 'div',
//     };
//     const value: HTMLTags = nodeMap[nodeName];
//     return value === undefined ? 'undefined' : value;
//   }

//   private createWrapperNoChildren(htmlTag: HTMLTags, style: Style) {
//     if(!this._range) throw new Error('Range not set');
//     this.fragment = this._range.extractContents();
//     const wrapperNode: Node = this.createWrapperNode(htmlTag);
//     this.setStyle(wrapperNode, style.style, style.value);
//     if (this.fragment) wrapperNode.appendChild(this.fragment)
//     this.insertNode(wrapperNode);
//   }

//   private createWrapperWithChildren(htmlTag: HTMLTags, style: Style) {
//     if(!this._range) throw new Error('Range not set');
//     const node: Node = (this.fragment as ParentNode).firstElementChild as Node;
//     if (this._range.commonAncestorContainer === this._range.startContainer) {
//       this.createNodeFromFragment(htmlTag, style)
//       return;
//     }
//     const firstNodeLength = this.getTextNodeLength(this._range.commonAncestorContainer.childNodes[0]);
//     if (this.rangeValues.start === firstNodeLength) {
//       this.createNodeFromFragment(htmlTag, style)
//       return;
//     }
//     this.createNewNodeAsWrapper(htmlTag, style);
//   }

//   createNodeFromFragment(htmlTag: HTMLTags, style: Style) {
//     if(!this._range) throw new Error('Range not set');
//     this.fragment = this._range.extractContents();
//     const wrapperNode = this.fragment ? this.fragment.querySelector('span') : this.createWrapperNode(htmlTag);
//     if (wrapperNode) {
//       this.clearExistingStyles(wrapperNode, style.style, htmlTag)
//       this.setStyle(wrapperNode, style.style, style.value);
//       wrapperNode.childNodes.forEach(node => {this.removeNodesWithEmptyStyles(node);})
//       this.insertNode(wrapperNode);
//     }
//   }

//   private createNewNodeAsWrapper(htmlTag: HTMLTags, style: Style) {
//     if(!this._range) throw new Error('Range not set');
//     this.fragment = this._range.extractContents();
//     const wrapperNode = this.createWrapperNode(htmlTag);
//     this.setStyle(wrapperNode, style.style, style.value);
//     const fragmentNode: Node = this.fragment as Node;
//     this.clearExistingStyles(fragmentNode, style.style, htmlTag)
//     this.removeNodesWithEmptyStyles(fragmentNode);
//     if (fragmentNode) wrapperNode.appendChild(fragmentNode);
//     this.insertNode(wrapperNode);
//   }

//   public createWrapperNode(htmlTag: HTMLTags): Node {
//     return document.createElement(htmlTag);
//   }

//   private setStyle(node: Node, styleName: string, value: string): void {
//     const element = node as HTMLElement;
//     for (const key in element.style) {
//       if (key === styleName) {
//         element.style[key] = value;
//         break;
//       }
//     }
//   }

//   private clearExistingStyles(nodeList: Node, styleName: string, htmlTag: HTMLTags): void {
//     if (nodeList.hasChildNodes()) {
//       nodeList.childNodes.forEach(node => {
//         this.clearExistingStyles(node, styleName, htmlTag)
//       });
//     }
//     const element: HTMLElement = nodeList as HTMLElement;
//     if (nodeList.nodeName === '#text') return;
//     if (element.style) {
//       if (element.style.length > 0) {
//         this.setStyle(element, styleName, '');
//       }
//     }
//   }

//   private removeNodesWithEmptyStyles(node: Node) {
//     if (!node.hasChildNodes()) return;
//     node.childNodes.forEach(childNode => {
//       if (childNode.hasChildNodes()) this.removeNodesWithEmptyStyles(childNode);
//       if (childNode.nodeName === '#text') return;
//       const element: HTMLElement = childNode as HTMLElement;
//       if (!element) return;
//       if (element.style.length > 0) return;
//         const innerText: string = element.innerText;
//         if (element.previousSibling) {
//           element.previousSibling.textContent  += innerText;
//         } else if (element.parentNode) {
//           element.parentNode.textContent += innerText;
//         }
//         childNode.remove();
//     })
//   }

//   private insertNode(wrapperNode: Node) {
//     this._range?.insertNode(wrapperNode);
//   }

//   public applyIndent() {
//     if(!this._range) throw new Error('Range not set');
//     const indent = new Indents(this._range, this.rangeValues);
//     indent.createIndent();
//   }

//   public removeIndent() {
//     if(!this._range) throw new Error('Range not set');
//     const indent = new Indents(this._range, this.rangeValues);
//     indent.removeIndent();
//   }

//   public newParagraph() {
//     if(!this._range) throw new Error('Range not set');
//     console.log('%c%s', 'color: #f279ca', 'newParagraph');
//     const para = new Paragraph(this._range, this.rangeValues);
//     para.newLine();
//   }
// }
