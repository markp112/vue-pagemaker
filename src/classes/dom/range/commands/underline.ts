import { RHBase, HTMLTags, ClassOrStyle } from '../range-base';
import { Style } from '@/models/styles/styles';

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
      const startNodeIndex = this.findChildNodeIndex(this.range.commonAncestorContainer, this.range.startContainer);
      console.log('%c%s', 'color: #73998c', startNodeIndex);
      if (startNodeIndex !== -1) {
        // look at the child nodes if there is a span between the start and end containers then the selected content is not underlined
        // if the end node is reached it is underlined
        for (let index = startNodeIndex + 1; index < this.range.commonAncestorContainer.childNodes.length; index++) {
          const childNode = this.range.commonAncestorContainer.childNodes[index]
          if (childNode.textContent === this.range.endContainer.textContent) {
            this.isElementUnderlined.selectedContent = true;
            break;
          }
          if (childNode.nodeName === 'SPAN' || childNode.nodeName === '#text') {
            this.isElementUnderlined.selectedContent = false;
            break;
          }
        }

      } else {
        this.isElementUnderlined.selectedContent = this.isElementUnderlined.startContent;
      }
    }
  }
  
  private findChildNodeIndex(parentNode: Node, childNode: Node): number {
    for (let index = 0; index < parentNode.childNodes.length; index++) {
      if (parentNode.childNodes[index].textContent === childNode.textContent) {
        return index;
      }
    }
    return -1;
  }

  public process(htmlTag: HTMLTags) {
    this.setElementUnderlineStatus();
    
    console.log('%c⧭', 'color: #994d75', this.isElementUnderlined);
    const isUnderline = this.isElementUnderlined.startContent && this.isElementUnderlined.selectedContent && this.isElementUnderlined.endContent;
    if (isUnderline) {
      this.removeUnderline(htmlTag);
    } else {
      this.addUnderline(htmlTag);
    }
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
    console.log('%c%s', 'color: #f279ca', 'removeUnderline');
    console.log("Range:", this.range, this.rangeValues);
    const underlineNode = this.getNodeWithUnderline(this.range.startContainer);
    if (!underlineNode) throw new Error('removeUnderline no underline class found');
    console.log('%c⧭', 'color: #0864f0', underlineNode);
    this.fragment = this.range.extractContents();
    const wrapperNode = this.createWrapperNode(htmlTag);
    if (this.fragment) {
        wrapperNode.appendChild(this.fragment);
    }
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
    // get the parent of the underline node
    // const parentNode = underlineNode.parentNode;
    if (!parentNode) throw new Error('removeUnderline no underline parent of underline found');
    // append the wrapper node after the underline node
    console.log('%c⧭', 'color: #99614d', wrapperNode);
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
      console.log('%c%s', 'color: #40fff2', startText);
      const nodeText = node.textContent ? node.textContent : '';
      console.log('%c%s', 'color: #5200cc', nodeText);
      this.range.startContainer.textContent = `${startText}${nodeText}`;
      node.remove();
    } else {
      this.range.startContainer.appendChild(node);
      this.range.commonAncestorContainer.removeChild(node);
    }
  }
  

  // add underline if not present anywhere in the selection
  private addUnderline(htmlTag: HTMLTags) {
    // start of content is underlined and end content is underlined middle is not
    if (this.isElementUnderlined.startContent && this.isElementUnderlined.endContent) {
      const startNodeIndex = this.findChildNodeIndex(this.range.commonAncestorContainer, this.range.startContainer);
      console.log('%c%s', 'color: #00736b', startNodeIndex);
      let endNodeIndex = this.findChildNodeIndex(this.range.commonAncestorContainer, this.range.endContainer);
      console.log('%c%s', 'color: #d0bfff', endNodeIndex);
      const childNodes = this.range.commonAncestorContainer.childNodes;
      for (let index = startNodeIndex + 1; index < endNodeIndex; index++) {
        const node = childNodes[index];
        this.underlineChildNode(node);
      }
      // remove the underline class from the end node index
      endNodeIndex = this.findChildNodeIndex(this.range.commonAncestorContainer, this.range.endContainer);
      this.clearExistingClasses(childNodes[endNodeIndex], this.underline);
      console.log('%c⧭', 'color: #f27999', childNodes[endNodeIndex]);

      this.underlineChildNode(childNodes[endNodeIndex])
      return;
    }
    if (this.isElementUnderlined.startContent && !this.isElementUnderlined.endContent) {
      const endNodeIndex = this.findChildNodeIndex(this.range.commonAncestorContainer, this.range.endContainer);
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