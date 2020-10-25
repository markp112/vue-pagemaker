import { RHBase, HTMLTags, ClassOrStyle } from '../range-base';
import { Style } from '@/models/styles/styles';

type StringOrNull = string | null;

export class Underline extends RHBase {

  private underline: Style = {
    style: 'textDecoration',
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
    this.setElementUnderlineStatus();
    const isUnderline = 
    this.isElementUnderlined.startContent 
    && this.isElementUnderlined.selectedContent 
    && this.isElementUnderlined.endContent;
    return;
    if (isUnderline) {
      this.removeUnderline(htmlTag);
    } else {
      this.addUnderline(htmlTag);
    }
  }

  setElementUnderlineStatus() {
    const rv = this.rangeValues;
    const startParentNodeType = rv.startContainerParent ? rv.startContainerParent.nodeName : '';
    if (rv.startContainerNodeType === 'text' 
      && rv.endContainerNodeType === 'text'
      && startParentNodeType !== 'SPAN') {
        this.isElementUnderlined.startContent = false;
        this.isElementUnderlined.endContent = false;
        this.isElementUnderlined.selectedContent = false;
        return;
    }
    const startParentHasUnderlineClass = this.isUnderlined(rv.startContainerParent);
    const endParentHasUnderlineClass = this.isUnderlined(rv.endContainerParent);
    this.isElementUnderlined.startContent = startParentHasUnderlineClass;
    this.isElementUnderlined.endContent = endParentHasUnderlineClass;
    if (startParentNodeType === 'P' || startParentNodeType === 'SPAN') {
      this.isElementUnderlined.selectedContent = 
        this.isSpanTextNodeSandwiched(
          this.range.commonAncestorContainer.parentNode,
          this.range.startContainer.textContent,
          this.range.endContainer.textContent);
    } else {
      this.isElementUnderlined.selectedContent = this.isElementUnderlined.startContent;
    }
  }

  isSpanTextNodeSandwiched(ancestorNode: Node | null, startText: StringOrNull, endText: StringOrNull): boolean {
    if (!ancestorNode) { 
      throw new Error('isSpanTextNodeSandwiched: ancestor node is null');
    }
    const startNodeIndex = this.findChildNodeIndex(ancestorNode, startText);
    if (startNodeIndex !== -1) {
      // look at the child nodes if there is a span / text node between the start and end containers then the selected content is not underlined
      // if the end node is reached it is underlined
      for (let index = startNodeIndex + 1; index < ancestorNode.childNodes.length; index++) {
        const childNode = ancestorNode.childNodes[index]
        if (childNode.textContent === endText) {
          return true;
        }
        if (childNode.nodeName === 'SPAN' || childNode.nodeName === '#text') {
          return false;
        }
      }
    }
    // if there are no child nodes return the status of the first node.
    return this.isElementUnderlined.startContent;
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
      return className.includes('underline');
    }
    return false;
  }

  private isUnderlined(node: Node | null): boolean {
    if (node === null) {
      return false;
    }
    if (node.nodeName === 'P') {
      return false;
    }
    if (node.nodeName === 'SPAN') {
      return this.hasClassUnderline(node)
    }
    return this.isUnderlined(node.parentNode)
  }

  // remove the underline if present
  private removeUnderline(htmlTag: HTMLTags) {
    const underlineNode = this.getNodeWithUnderline(this.range.startContainer);
    if (!underlineNode) throw new Error('removeUnderline no underline class found');
    this.fragment = this.range.extractContents();
    const wrapperNode = this.createWrapperNode(htmlTag);
    if (this.fragment) {
      wrapperNode.appendChild(this.fragment);
    }
    // get the parent of the underline node
    // const parentNode = underlineNode.parentNode;
    const parentNode = underlineNode.parentNode;
    if (!parentNode) throw new Error('removeUnderline no underline parent of underline found');
    // if end content is empty the user has selected the entire underline block
    if (this.rangeValues.endContent === '') {
      parentNode.replaceChild(wrapperNode, underlineNode);
      return;
    }
    const endNode = this.createWrapperNode(htmlTag);
    endNode.textContent = this.rangeValues.endContent;
    this.setClass(endNode, this.underline);
    underlineNode.textContent = this.rangeValues.startContent;
    // append the wrapper node after the underline node
    parentNode.insertBefore(wrapperNode, underlineNode.nextSibling);
    // append the end node after wrapper node if it was part of the original selection
    if (this.rangeValues.endContent !== '') {
      parentNode.insertBefore(endNode, wrapperNode.nextSibling);
    }
  }

  private getNodeWithUnderline(node: Node): Node | null {
    if (node.nodeName === 'SPAN') {
      const element: HTMLSpanElement = node as HTMLSpanElement;
      if (element.className.includes('underline') || element.innerHTML.includes('underline')) {
        return node;
      }
    }
    if (node.parentElement) {
      return this.getNodeWithUnderline(node.parentElement);
    }
    return null;
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