import { RHBase, HTMLTags, ClassOrStyle } from '../range-base';
import { Style } from '@/models/styles/styles';

export class Underline extends RHBase {

  private noUnderline: Style = {
    style: 'textDecoration',
    value: 'no-underline',
  };

  private underline: Style = {
    style: 'textDecoration',
    value: 'underline',
  };

  constructor(range: Range) {
    super(range);
  }

  public process(htmlTag: HTMLTags) {
    console.log('%c⧭', 'color: #bfffc8', htmlTag, 'Process - underline');
    const isUnderline = this.isUnderlined(this.rangeValues.startContainerParent);
    console.log('%c%s', 'color: #5e98f0', isUnderline);
    if (isUnderline) {
      this.removeUnderline();
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

  private isUnderlined(node: Node | null) {
    if (node === null) {
      return false;
    }
    if (node.nodeName === 'P') {
      return false;
    }
    if (node.nodeName === 'SPAN') {
      if (this.hasClassUnderline(node)) {
        return true;
      }
    }
    this.isUnderlined(node.parentNode)
  }

  // remove the underline if present
  private removeUnderline(htmlTag: HTMLTags) {
    console.log('%c%s', 'color: #f279ca', 'removeUnderline');
    console.log("Range:", this.range, this.rangeValues);
    const underlineNode = this.getNodeWithUnderline(this.range.commonAncestorContainer);
    if (!underlineNode) throw new Error('removeUnderline no underline class found');
    console.log('%c⧭', 'color: #99adcc', underlineNode);
    this.fragment = this.range.extractContents();
    const wrapperNode = this.createWrapperNode(htmlTag);
    wrapperNode.appendChild(this.fragment);
    const endNode = this.createWrapperNode(htmlTag);
    endNode.textContent = this.rangeValues.endContent;
    this.setClass(endNode, this.underline);
    // To do remove the end text from teh underlineNode
    
    underlineNode.textContent = this.rangeValues.startContent;
    // get the parent of the underline node
    const parentNode = underlineNode.parentNode;
    if (!parentNode) throw new Error('removeUnderline no underline parent of underline found');
    // append the wrapper node after the underline node
    parentNode.insertBefore(wrapperNode, underlineNode.nextSibling);
    // append the end node after wrapper node
    parentNode.insertBefore(endNode, wrapperNode.nextSibling);
  }

  private getNodeWithUnderline(node: Node): Node | null {
    if (node.nodeName === 'SPAN') {
      const element: HTMLSpanElement = node as HTMLSpanElement;
      if (element.className.includes('underline')) {
        return node;
      }
    }
    if (node.parentElement) {
      return this.getNodeWithUnderline(node.parentElement);
    }
    return null;
  }



  // add underline if not present
  private addUnderline(htmlTag: HTMLTags) {
    this.rangeValues.ancestorHasChildren 
      ? this.createWrapperWithChildren(htmlTag)
      : this.createWrapperNoChildren(htmlTag);
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
    console.log("passed Ifs")
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

    private createWrapperNoChildren(htmlTag: HTMLTags){
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

 

  // Notes - we need to know where the selected text sits within the sentence

  insertNoUnderlineNode(parentNode: Node | null) {
    console.log('%c⧭', 'color: #997326', parentNode);
    // check if parent is a span if so traverse tree until we get to a P tag as a no underline needs to be inserted
    // into the child nodes of the P tag for it to take off the underline, if it is nested inside of an underline tag
    // it has no effect;
    if (!parentNode) {
      throw new Error('Class underline: invalid parent node');
    }
    // const pNode = this.findNextNodeofType(parentNode,'P');
    // console.log('%c⧭', 'color: #e57373', pNode);
    // pNode?.insertBefore(this._underLineNode, parentNode.nextSibling);
    // const newUnderLineSpan = this.createWrapperNode('span');
    // this.setClass(newUnderLineSpan, this.underline);
    // pNode?.insertBefore(newUnderLineSpan, this._underLineNode.nextSibling);

  }


}