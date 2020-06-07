import { Style } from '@/models/styles/styles';

interface RangeValuesInterface {
  start: number;
  end: number;
  startContent: string,
  endContent: string;
  selectionLength: number;
  ancestorNode: HTMLTags;
  ancestorHasChildren: boolean;
  firstChild: HTMLTags;
  startContainer: HTMLTags;
  endContainer: HTMLTags;
  ancestorContainsSpan: boolean;
  selectionSpansRows: boolean;
  startContainerParent: Node | null;
  endContainerParent: Node | null;
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
    console.clear();
    console.log('%c⧭', 'color: #eeff00', this.range);
  }

  private setSelection(): RangeValuesInterface {
    if (!this.range) throw new Error('RH: Range not set');
    const rv: RangeValuesInterface = {
      start: this.range.startOffset,
      end: this.range.endOffset,
      startContent:'', 
      endContent:'', 
      ancestorHasChildren: this.range.commonAncestorContainer.hasChildNodes(),
      ancestorNode: this.getNodeType(this.range.commonAncestorContainer.nodeName),
      startContainer: this.getNodeType(this.range.startContainer.nodeName),
      startContainerParent: this.range.startContainer.parentNode,
      endContainer: this.getNodeType(this.range.endContainer.nodeName),
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
        if (this.getNodeType(node.nodeName) === 'span') rv.ancestorContainsSpan = true;
      })
    }
    if (this.range.commonAncestorContainer.firstChild)
        rv.firstChild = this.getNodeType(this.range.commonAncestorContainer.firstChild.nodeName);
    if (rv.ancestorNode !== rv.startContainer) {
      console.log('%c%s', 'color: #cc0036', rv.startContent);
      console.log('%c%s', 'color: #ff6600', rv.endContent);

      rv.selectionSpansRows = true;
    }
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
    this.applyStyleToRange(htmlTag, style)
    // if (this.rangeValues.ancestorNode === 'p'
    //   && this.rangeValues.startContainer === 'text'
    //   && this.rangeValues.endContainer === 'text'
    //   ) {
    //     this.ProcessTextParagraphSelection(htmlTag, style);
    //   }
    // if (this.rangeValues.ancestorNode === 'div' 
    // && this.rangeValues.startContainer === 'text'
    //   && this.rangeValues.endContainer === 'text'
    //   ) {
    //     this.ProcessTextDivSelection(htmlTag, style);
    //   }
  }

  applyStyleToRange(htmlTag: HTMLTags, style: Style) {
    if (!this.range) throw new Error('RH: Range not set');
    // let text: string | undefined = this.range.startContainer.textContent?.substring(this.rangeValues.start);
    // const startContent: string = text ? text : '';
    // text = this.range.endContainer.textContent?.substring(0, this.rangeValues.end);
    // // const endContent: string = text ? text : '';
   
    console.log('%c%s', 'color: #364cd9', this.rangeValues.selectionSpansRows);
    const nodeList: Node[] = [];
    
    this.fragment = this.range.extractContents();
    const fragmentNode: Node = this.fragment as Node;
    this.clearExistingStyleFromSpan(this.fragment, style);
    fragmentNode.childNodes.forEach(childNode => {
      const nodeType = this.getNodeType(childNode.nodeName);
      const parentNodeType: HTMLTags = this.rangeValues.startContainerParent ? this.getNodeType(this.rangeValues.startContainerParent?.nodeName) : 'undefined';
      console.log('%c⧭', 'color: #d0bfff', parentNodeType);
      console.log('%c%s', 'color: #ec22b0', nodeType);
      
      console.log('%c⧭', 'color: #e9a00f', fragmentNode.childNodes);
      if (nodeType === 'text' && parentNodeType ==='p') {
        console.log('%c⧭', 'color: #00ff88', childNode);
        const spanNode: Node = this.wrapTextNodeWithSpan(style, childNode);
        console.log('%c⧭', 'color: #994d75', spanNode);
        nodeList.push(spanNode);
      }
      if (nodeType === 'text' && parentNodeType === 'span') {
        console.log("here")
        console.log('%c⧭', 'color: #40fff2', childNode);
        let spanNode: Node;
        if (childNode.textContent !== this.rangeValues.startContainerParent?.textContent) {
          spanNode = this.createWrapperNode('span');
          spanNode.textContent = childNode.textContent;
        } else {
          spanNode = this.rangeValues.startContainerParent ? this.rangeValues.startContainerParent : this.createWrapperNode('span') ;
        }
        this.setStyle(spanNode,style.style, style.value);
        nodeList.push(spanNode);
      }
      if (nodeType === 'p') {
        const pNode = this.getParaNode(childNode, htmlTag, style)
        nodeList.push(pNode);
      }
      if (nodeType === 'span') {
        this.setStyle(childNode,style.style, style.value);
        nodeList.push(childNode);
      }
    
    })
    console.log('%c⧭', 'color: #00736b', nodeList);
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
  
clearExistingStyleFromSpan(fragment: DocumentFragment, style: Style): void {
  const spanList: NodeList = fragment.querySelectorAll('span');
  spanList.forEach(span => this.clearExistingStyles(span, style.style, 'span'));
}

// wrapTextNodeWithSpan(node: Node, style: Style): Node  {
//   const spanNode = this.createWrapperNode('span');
//   spanNode.textContent = node.textContent;
//   this.setStyle(spanNode, style.style, style.value);
//   return spanNode;
// }

getParaNode(node: Node, htmlTag: HTMLTags, style:Style): Node {
  
  // check for start and end node and remove P tag that the range will have inserted
  if(node.textContent === this.rangeValues.startContent || node.textContent === this.rangeValues.endContent && this.rangeValues.selectionSpansRows) {
    const spanNode = this.createWrapperNode('span');
    this.setStyle(spanNode, style.style, style.value);
    spanNode.textContent = node.textContent;
    return spanNode;
  }


  if (node.hasChildNodes()) {
    if(node.childNodes.length === 1) {
      const childNodeName = this.getNodeType(node.childNodes[0].nodeName);
      if (childNodeName === 'text') {
        const spanNode = this.createWrapperNode('span');
        spanNode.textContent = node.textContent;
        this.setStyle(spanNode, style.style, style.value);
        const paraNode = this.createWrapperNode('p');
        paraNode.appendChild(spanNode);
        return paraNode;
      }
      if (childNodeName === 'span') {
        const span = node.childNodes[0];
        this.setStyle(span, style.style, style.value);
        return node;
      }

    } else {
        const spanNode = this.createWrapperNode('span');
        this.setStyle(spanNode, style.style, style.value);
        const nodes: Node[] = []
        // iterating the child nodes and pushing into a span fails hence pushing them into an array first works
        node.childNodes.forEach(childNode => {
          nodes.push(childNode);
        });
        nodes.forEach(childNode => {
          spanNode.appendChild(childNode);
        })
        node.appendChild(spanNode);
        return node;
    } 
  }
  return node;
}





  ProcessTextParagraphSelection(htmlTag: HTMLTags, style: Style) {
    this.fragment = this.range.extractContents();
    const fragmentNode: Node = this.fragment as Node;
    const childNodes: NodeList = fragmentNode.childNodes;
    let index = 0;
    while (index < childNodes.length) {
      const childNode = childNodes[index];
      const childNodeType = this.getNodeType(childNode.nodeName)
      const spanNode = this.createWrapperNode('span');
      this.setStyle(spanNode,style.style, style.value);
      if (childNodeType === 'text') {
        spanNode.textContent = childNode.textContent;
        this.range.insertNode(spanNode);
      }
      if (childNodeType === 'p') {
          const textToWrap = childNode.textContent ? childNode.textContent : '';
          const textNode: Text = new Text(textToWrap);
          spanNode.appendChild(textNode);
          console.log('%c⧭', 'color: #007300', spanNode);
          const endContainerChildNodes = this.range.endContainer.childNodes[2]
          console.log('%c⧭', 'color: #006dcc', this.range.endContainer.childNodes[2]);
          endContainerChildNodes.insertBefore(spanNode, endContainerChildNodes.childNodes[0])
        }
      index++;
    }
  }
  

  ProcessTextDivSelection(htmlTag: HTMLTags, style: Style) {
    this.fragment = this.range.extractContents();
    const fragmentNode: Node = this.fragment as Node;
    const childNodes: NodeList = fragmentNode.childNodes;
    let index = 0;
    while (index < childNodes.length) {
      const childNode = childNodes[index];
      console.log('%c⧭', 'color: #731d1d', childNode);
      const childNodeType = this.getNodeType(childNode.nodeName)
      console.log('%c%s', 'color: #807160', childNodeType);
      const spanNode = this.createWrapperNode('span');
      this.setStyle(spanNode,style.style, style.value);
      if (childNodeType === 'text') {
        spanNode.textContent = childNode.textContent;
        this.range.insertNode(spanNode);
      }
      index++;
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
    const nodeList: Node[] = [];
    
    if (this.rangeValues.ancestorHasChildren) {
      let spanNode: Node;
      this.range.commonAncestorContainer.childNodes.forEach(childNode =>{
        const nodeName: HTMLTags = this.getNodeType(childNode.nodeName);
        if (nodeName === 'text') {
          spanNode = this.wrapTextNodeWithSpan(style, childNode);
        }
        if (nodeName === 'span') {
          spanNode = this.processSpanNode(childNode, style);
        }
        if (nodeName === 'p') {
          spanNode = this.processParaNode(childNode, style)
        }
        nodeList.push(spanNode);
        childNode.remove();
      })
      nodeList.forEach(node => this.range.commonAncestorContainer.appendChild(node));
      return;
    }


    if (this.range.commonAncestorContainer === this.range.startContainer) {
      console.log('%c%s', 'color: #00736b', 'createNodeFromFragment');
      this.createNodeFromFragment(htmlTag, style)
      return;
    }
    const firstNodeLength = this.getTextNodeLength(this.range.commonAncestorContainer.childNodes[0]);
    if (this.rangeValues.start === firstNodeLength) {

      console.log('%c%s', 'color: #99614d', 'createNodeFromFragment');
      this.createNodeFromFragment(htmlTag, style)
      return;
    }
    this.fragment = this.range.extractContents();
    if (this.existsPTagInFragment()) {
      console.log("found p tag")
      this.applyStyleToParagraph(style);
      return;
    }
    console.log('%c%s', 'color: #8c0038', 'createNewNodeAsWrapper');
    this.createNewNodeAsWrapper(htmlTag, style);
  }

  
  existsPTagInFragment(): boolean {
    const ptag = this.fragment?.querySelector('p');
    return ptag ? true : false;
  }

  applyStyleToParagraph(style: Style): void {
    const pTags: NodeList | null | undefined = this.fragment?.querySelectorAll('p');
    console.log('%c⧭', 'color: #d0bfff', pTags);
    if (!pTags) return;
    pTags.forEach(para => {
      const span: Node = this.createWrapperNode('span');
      this.setStyle(span, style.style, style.value);
      console.log('%c%s', 'color: #607339', style.style);
      console.log('%c⧭', 'color: #ff6600', span);
      while(para.firstChild) {
        span.appendChild(para.firstChild);
      }
      para.childNodes.forEach(node => node.remove);

      para.appendChild(span);
      console.log('%c⧭', 'color: #cc0036', para);
        // needs more logic to pick up rest of the PTags content possibly fragment manipulation
      // this.range.insertNode(para);
    })
  }

  createNodeFromFragment(htmlTag: HTMLTags, style: Style) {
    if(!this.range) throw new Error('Range not set');
    this.fragment = this.range.extractContents();
    const wrapperNode: Node | null = this.fragment ? this.fragment.querySelector('span') : this.createWrapperNode(htmlTag);
    if (wrapperNode) {
      this.clearExistingStyles(wrapperNode, style.style, htmlTag)
      this.setStyle(wrapperNode, style.style, style.value);
      wrapperNode.childNodes.forEach(node => {this.removeNodesWithEmptyStyles(node);})
      this.insertNode(wrapperNode);
    }
  }

  private createNewNodeAsWrapper(htmlTag: HTMLTags, style: Style) {
    if(!this.range) throw new Error('Range not set');
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

  wrapTextNodeWithSpan(style: Style, node: Node): Node {
    let existingSpan: NodeList | undefined = undefined;
    if (this.fragment){
      existingSpan =  this.fragment.querySelectorAll('span');
    }
    let spanNode: Node;
    if (existingSpan?.length === 1) {
      spanNode =  existingSpan[0];
    } else {
      spanNode = this.createWrapperNode('span');
      spanNode.appendChild(node);
    }
    this.setStyle(spanNode, style.style, style.value);
    return spanNode;
  }

  processSpanNode(node: Node, style: Style): Node {
    this.clearExistingStyles(node, style.style, 'span');
    this.setStyle(node, style.style, style.value);
    return node;
  }

processParaNode(node: Node, style: Style): Node {
  // work out if this is the last node in the section
  node.childNodes.forEach(childNode => {
    if (this.getNodeType(childNode.nodeName) === 'span') {
      this.clearExistingStyles(childNode, style.style, 'span');
    }
  });
  const newNode = this.createWrapperNode('span');
  const textToWrap = node.textContent;
  newNode.textContent = textToWrap;
  this.setStyle(newNode, style.style, style.value);
  node.appendChild(newNode);
  return node;
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
          element.previousSibling.textContent += innerText;
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

