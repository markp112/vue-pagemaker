import { RHBase, HTMLTags, ClassOrStyle } from '../range-base';
import { Style, StylesMap } from '@/models/styles/styles';

type StringOrNull = string | null;

export class Underline extends RHBase {

  private underline: Style = {
    style: 'text-decoration',
    value: 'underline',
  };

  private isElementUnderlined = {
    startContent: false,
    selectedContent: false,
    endContent: false,
  }
  
  constructor(range: Range) {
    super(range);
  }
  
  public process(htmlTag: HTMLTags) {
    console.log('%c%s', 'color: #364cd9', 'process');
    this.isElementUnderlined.startContent = this.isParentUnderlined(this.range.startContainer);
    this.isElementUnderlined.endContent = this.isParentUnderlined(this.range.endContainer);
    this.isElementUnderlined.selectedContent = this.isNextSblingUnderlined(this.range.startContainer);
    const hasUnderline = this.isElementUnderlined.startContent && this.isElementUnderlined.endContent && this.isAllUnderlined();
    console.log('%c⧭', 'color: #ffa280', this.isElementUnderlined);

    console.log('%c⧭', 'color: #33cc99', hasUnderline);
    if (hasUnderline) {
      this.removeUnderline();
    } else {
      this.addUnderline(htmlTag);
    }
  }

  private isParentUnderlined(node: Node | null): boolean {
    if (node === null) return false;
    if (node.nodeName !== 'P') {
      if (node.nodeName === 'SPAN') {
        if (this.hasClassUnderline(node)) {
          return true;
        }
      }
      return this.isParentUnderlined(node.parentNode);
    } 
    return false;
  }

  private isNextSblingUnderlined(node: Node | null): boolean {
    if (!node) return false;
    if (this.hasClassUnderline(node)) {
      return true;
    }
    if (node.textContent === this.range.endContainer.textContent) {
      return false;
    }
    return this.isNextSblingUnderlined(node.nextSibling);
  }

  private findChildNodeIndex(searchNode: Node, contentToMatch: StringOrNull): number {
    for (let index = 0; index < searchNode.childNodes.length; index++) {
      if (searchNode.childNodes[index].textContent === contentToMatch) {
        return index;
      }
    }
    return -1;
  }

  private hasClassUnderline(node: Node): boolean {
    const spanElement = node as HTMLSpanElement;
    const className = spanElement.className;
    if (className) {
      return className.includes('underline') && !className.includes('no-underline');
    }
    return false;
  }


  // remove the underline if present
  private removeUnderline() {
  
    let nodeWithSpan: Node | null = null;
    let cleanedNode: Node | null = null;
    nodeWithSpan = this.getParentNodeWithUnderline(this.range.startContainer)!;
    cleanedNode = this.removeUnderlineClass(nodeWithSpan)!;
    if (!this.isSandWiched()) {
      cleanedNode.textContent = this.getTextContent(this.range.startContainer);
      console.log('%c%s', 'color: #1d3f73', cleanedNode.textContent);
      const styles: Style[] = this.getParentStyles(this.range.commonAncestorContainer, []);
      console.log('%c⧭', 'color: #cc0088', styles);
      if (styles.length > 0) {
        if (cleanedNode.nodeName === '#text') {
          const wrapperNode = this.createWrapperNode('span');
          this.setStyles(wrapperNode, styles)
          wrapperNode.appendChild(cleanedNode);
          this.insertCleanedNode(wrapperNode, nodeWithSpan);
          return
        } else {
          this.setStyles(cleanedNode, styles);
        }
      }
      this.insertCleanedNode(cleanedNode, nodeWithSpan);
      return;
    }
    console.log("Sandwiched")
    const ancestor = this.getParentNodeWithUnderline(this.range.commonAncestorContainer)!;
    const startContainerIndex = this.findChildNodeIndex(ancestor, this.range.startContainer.textContent);
    console.log('%c%s', 'color: #ffcc00', startContainerIndex);
    const endContainerIndex = this.findChildNodeIndex(ancestor, this.range.endContainer.textContent);
    console.log('%c%s', 'color: #408059', endContainerIndex);
    const nodes: Node[] = [];
    let node: Node | null = null;
    for (let index = startContainerIndex; index <= endContainerIndex; index++) {
      if (ancestor.childNodes[index].nodeName === 'SPAN') {
        node = this.createWrapperNode('span');
      } else {
        node = this.createWrapperNode('text');
      }
      if (node.nodeName === 'SPAN') {
        const spanElement = node as HTMLSpanElement;
        if ((ancestor.childNodes[index] as HTMLSpanElement).style.length > 0) {
          const childStyles = (ancestor.childNodes[index] as HTMLSpanElement).style;
          for (let spanIndex = 0; spanIndex < childStyles.length; spanIndex++) {
            const styleName = childStyles.item(spanIndex);
            const value = childStyles.getPropertyValue(styleName);
            spanElement.style.setProperty(styleName, value)
          }
        }
        spanElement.className = (ancestor.childNodes[index] as HTMLSpanElement).className;
      }
      const content = ancestor.childNodes[index].textContent;
      if (index === startContainerIndex) {
        node.textContent = content ? content.substring(this.range.startOffset) : '';
        nodes.push(node);
        continue;
      }
      if (index === endContainerIndex) {
        node.textContent = content ? content.substring(0, this.range.endOffset) : '';;
        nodes.push(node);
        continue;
      }
      node.textContent = content;
      nodes.push(node);
    }
    const parentStyles: Style[] = this.getParentStyles(ancestor, []);
    console.log('%c⧭', 'color: #f279ca', parentStyles);
    console.log('%c⧭', 'color: #99adcc', nodes);

    // insert node back into tree after wrapping any parent styles around the node 
    // node will need to be injected outside of the underline range i.e. if in the middle the range will need to be split into several spans
    // with styles applied to each span in turn.
  }

  getTextContent(startContainer: Node): string {
    if (!startContainer) return '';
    const textcontent = (startContainer as HTMLElement).textContent;
    if (textcontent) {
      return textcontent.substring(this.range.startOffset, this.range.endOffset);
    }
    return '';
  }

  getParentStyles(node: Node | null, styles: Style[]): Style[] {
    console.log('%c%s', 'color: #00bf00', 'getParentStyles');
    if (!node) return styles;
    if (node.nodeName === 'P') return styles;
    if (node.nodeName === 'SPAN') {
      const spanElement = node as HTMLSpanElement;
      if (spanElement.style.length > 0) {
        for (let index = 0; index < spanElement.style.length; index++) {
          const styleElement = spanElement.style[index];
          const value = spanElement.style.getPropertyValue(styleElement);
          const style: Style = { style: styleElement, value: value };
          styles.push(style)
        }
      }
    }
    return this.getParentStyles(node.parentNode, styles);
  }

  insertCleanedNode(cleanedNode: Node | null, nodeWithSpan: Node | null) {
    console.log('%c⧭', 'color: #aa00ff', nodeWithSpan);
    console.log('%c⧭', 'color: #00a3cc', cleanedNode);
    if (!cleanedNode) return;
    if (!nodeWithSpan) return;
    const parentNode = this.range.startContainer.parentNode;
    const nextSibling = this.range.startContainer.nextSibling;
    let nodeToInsertChildOn: Node | null = null;
    let nodeToInsertChildBefore: Node | null = null

    if (this.isElementUnderlined.startContent && !this.isElementUnderlined.endContent) {
      if (parentNode) {
        nodeToInsertChildOn = parentNode.previousSibling ? parentNode.previousSibling : parentNode.parentNode;
      }
    }
    if (this.isElementUnderlined.startContent && this.isElementUnderlined.endContent) {
      if (parentNode) {
        nodeToInsertChildOn = nodeWithSpan.parentNode ? nodeWithSpan.parentNode : null;
        console.log('%c⧭', 'color: #ace2e6', nodeToInsertChildOn);
        nodeToInsertChildBefore = nodeWithSpan.nextSibling ? nodeWithSpan.nextSibling : null;
        console.log('%c⧭', 'color: #9c66cc', nodeToInsertChildBefore);
        const textContent = (this.range.endContainer as HTMLElement).textContent!;
        console.log('%c%s', 'color: #00e600', textContent);
        cleanedNode.textContent = textContent.substring(this.range.startOffset);
        console.log('%c%s', 'color: #ff0000', cleanedNode.textContent);
        
      }
    }
    this.fragment = this.range.extractContents();
    if (nodeToInsertChildOn && !nodeToInsertChildBefore) {
      nodeToInsertChildOn.appendChild(cleanedNode);
    }
    if (nodeToInsertChildOn && nodeToInsertChildBefore) {
      nodeToInsertChildOn.insertBefore(cleanedNode, nodeToInsertChildBefore);
    }
    //   if (nextSibling) {
    //     console.log('%c⧭', 'color: #40fff2', nextSibling);
    //     parentNode?.insertBefore(cleanedNode, nextSibling);
    //   } else if (parentNode) {
    //     console.log('%c⧭', 'color: #5200cc', parentNode);
    //     parentNode.appendChild(cleanedNode)
    //   }
  }
  isSandWiched(): boolean {
    if (this.isElementUnderlined.startContent && this.isElementUnderlined.endContent) {
      const textnode = this.range.endContainer as Text;
      return textnode.length !== this.range.endOffset;
    }
    return false;
  }

  isAllUnderlined(): boolean {
    return this.range.commonAncestorContainer.nodeName !== 'P'
  }
  
  private getSiblingNodeWithUnderline(node: Node | null): Node | null {
    if (!node) return null;
    if (this.hasClassUnderline(node)) {
      return node;
    }
    if (node.textContent === this.range.endContainer.textContent) {
      return null;
    }
    return this.getSiblingNodeWithUnderline(node.nextSibling);
  }

  removeUnderlineClass(node: Node | null): Node | null {
    if (!node) return node;
    const spanElement = node as HTMLSpanElement;
    const textDecoration = spanElement.className.includes('text-decoration') ? 'text-decoration' : 'textDecoration'; 
    const className = spanElement.className.replace(`${textDecoration} underline`, '');
    if (spanElement.style.length === 0 && className === '') {
      return this.removeEmptySpan(node);
    }
    spanElement.className = className;
    return node;
  }

  private getParentNodeWithUnderline(node: Node | null): Node | null {
    if (!node) return null;
    if (node.nodeName === 'P') return null;
    if (node.nodeName === 'SPAN') {
      if (this.hasClassUnderline(node) || (node as HTMLSpanElement).innerHTML.includes('underline')) {
        return node;
      }
    }
    return this.getParentNodeWithUnderline(node.parentNode);
  }

  private underlineChildNode(node: ChildNode) {
    let hasStyleOrClass = false;
    if (node.nodeName === 'SPAN') {
      const element = node as HTMLSpanElement;
      hasStyleOrClass = element.className !== '' && element.style.length !== 0;
    }
    if (!hasStyleOrClass) {
      const startText = this.range.startContainer.textContent ?  this.range.startContainer.textContent : '';
      const nodeText = node.textContent ? node.textContent : '';
      this.range.startContainer.textContent = `${startText}${nodeText}`;
      node.remove();
    } else {
      this.range.startContainer.appendChild(node);
      this.range.commonAncestorContainer.removeChild(node);
    }
  }

  // add underline to anything not present in teh s
  private addUnderline(htmlTag: HTMLTags) {
    // start of content is underlined and end content is underlined middle is not
    if (this.isElementUnderlined.startContent && this.isElementUnderlined.endContent) {
      const startNodeIndex = this.findChildNodeIndex(this.range.commonAncestorContainer, this.range.startContainer.textContent);
      let endNodeIndex = this.findChildNodeIndex(this.range.commonAncestorContainer, this.range.endContainer.textContent);
      const childNodes = this.range.commonAncestorContainer.childNodes;
      for (let index = startNodeIndex + 1; index < endNodeIndex; index++) {
        const node = childNodes[index];
        this.underlineChildNode(node);
      }
      // remove the underline class from the end node index
      // re-find the index of the end node as this may have changed if nodes have been removed
      endNodeIndex = this.findChildNodeIndex(this.range.commonAncestorContainer, this.range.endContainer.textContent);
      this.clearExistingClasses(childNodes[endNodeIndex], this.underline);
      this.underlineChildNode(childNodes[endNodeIndex])
      return;
    }
    if (this.isElementUnderlined.startContent && !this.isElementUnderlined.endContent) {
      const endNodeIndex = this.findChildNodeIndex(this.range.commonAncestorContainer, this.range.endContainer.textContent);
      const node = this.range.commonAncestorContainer.childNodes[endNodeIndex];
      this.underlineChildNode(node);
    }
    if (!this.isElementUnderlined.startContent 
      && !this.isElementUnderlined.selectedContent
      && !this.isElementUnderlined.endContent ) {
        this.rangeValues.ancestorHasChildren 
          ? this.createWrapperWithChildren(htmlTag)
          : this.createWrapperNoChildren(htmlTag);
      }
    return;
  }

  private createWrapperWithChildren(htmlTag: HTMLTags) {
    if (this.range.commonAncestorContainer === this.range.startContainer) {
      this.createNodeFromFragment(htmlTag)
      return;
    }
    const firstNodeLength = this.getTextNodeLength(this.range.commonAncestorContainer.childNodes[0]);
    if (this.rangeValues.start === firstNodeLength) {
      this.createNodeFromFragment(htmlTag)
      return;
    }
    this.fragment = this.range.extractContents();
    this.createNewNodeAsWrapper(htmlTag, this.underline, 'class');
  }

  private createNodeFromFragment(htmlTag: HTMLTags) {
    if(!this.range) throw new Error('Range not set');
    this.fragment = this.range.extractContents();
    const wrapperNode: Node | null = this.fragment ? this.fragment.querySelector('span') : this.createWrapperNode(htmlTag);
    if (wrapperNode) {
        this.clearExistingClasses(wrapperNode, this.underline);
        this.setClass(wrapperNode, this.underline);
        this.insertNode(wrapperNode);
      }
    }

    private createNewNodeAsWrapper(htmlTag: HTMLTags, style: Style, classOrStyle: ClassOrStyle) {
      if(!this.range) throw new Error('Range not set');
      const wrapperNode = this.createWrapperNode(htmlTag);
      const fragmentNode: Node = this.fragment as Node;
      this.setStyleOrClass(wrapperNode, style, classOrStyle);
      this.clearExistingClasses(fragmentNode, style);
      if (fragmentNode) wrapperNode.appendChild(fragmentNode);
      this.insertNode(wrapperNode);
    }

    private createWrapperNoChildren(htmlTag: HTMLTags) {
      this.fragment = this.range.extractContents();
      const wrapperNode = this.createWrapperNode(htmlTag);
      const fragmentNode: Node = this.fragment as Node;
      if (wrapperNode) {
        this.clearExistingClasses(wrapperNode, this.underline);
        this.setClass(wrapperNode, this.underline);
        if (fragmentNode) wrapperNode.appendChild(fragmentNode);
        this.range?.insertNode(wrapperNode);
      }
    }
}