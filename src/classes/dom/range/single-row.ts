import { Style } from '@/models/styles/styles';
import { RHBase, HTMLTags, ClassOrStyle } from './range-base';
import { Underline } from './commands/underline';

export class RangeRow extends RHBase {

  constructor(range: Range) {
    super(range);
  }

  process(htmlTag: HTMLTags, style: Style, classOrStyle: ClassOrStyle) {
    if (!this.range) throw new Error('RH: Range not set');
    if (classOrStyle === 'class') {
      if (style.value.includes('underline')) {
        const underLine = new Underline(this.range);
        underLine.process(htmlTag);
        return
      }
    }
    this.rangeValues.ancestorHasChildren 
      ? this.createWrapperWithChildren(htmlTag, style, classOrStyle)
      : this.createWrapperNoChildren(htmlTag, style, classOrStyle);
  }


  private createWrapperNoChildren(htmlTag: HTMLTags, style: Style, classOrStyle: ClassOrStyle) {
    if(!this.range) throw new Error('Range not set');
    this.fragment = this.range.extractContents();
    const wrapperNode: Node = this.createWrapperNode(htmlTag);
    this.setStyleOrClass(wrapperNode, style, classOrStyle);
    // add back the content contained when the fragment was extracted
    if (this.fragment) {
      wrapperNode.appendChild(this.fragment)
    }
    this.insertNode(wrapperNode);
  }

  private createWrapperWithChildren(htmlTag: HTMLTags, style: Style, classOrStyle: ClassOrStyle) {
    console.log("Here")
    if(!this.range) throw new Error('Range not set');
    if (this.range.commonAncestorContainer === this.range.startContainer) {
      this.createNodeFromFragment(htmlTag, style, classOrStyle)
      return;
    }
    const firstNodeLength = this.getTextNodeLength(this.range.commonAncestorContainer.childNodes[0]);
    if (this.rangeValues.start === firstNodeLength) {
      this.createNodeFromFragment(htmlTag, style, classOrStyle)
      return;
    }
    console.log("passed Ifs")
    this.fragment = this.range.extractContents();
    this.createNewNodeAsWrapper(htmlTag, style, classOrStyle);
  }

  createNodeFromFragment(htmlTag: HTMLTags, style: Style, classOrStyle: ClassOrStyle) {
    if(!this.range) throw new Error('Range not set');
    this.fragment = this.range.extractContents();
    const wrapperNode: Node | null = this.fragment ? this.fragment.querySelector('span') : this.createWrapperNode(htmlTag);
    if (wrapperNode) {
      if (classOrStyle === 'style') {
        this.clearExistingStyles(wrapperNode, style)
        this.setStyle(wrapperNode, style);
        wrapperNode.childNodes.forEach(node => {
          this.removeNodesWithEmptyStyles(node);
        })
      } else {
        this.clearExistingClasses(wrapperNode, style);
        this.setClass(wrapperNode, style);
      }
        this.insertNode(wrapperNode);
    }
  }

  private createNewNodeAsWrapper(htmlTag: HTMLTags, style: Style, classOrStyle: ClassOrStyle) {
    if(!this.range) throw new Error('Range not set');
    const wrapperNode = this.createWrapperNode(htmlTag);
    const fragmentNode: Node = this.fragment as Node;
    this.setStyleOrClass(wrapperNode, style, classOrStyle);
    if (classOrStyle === 'style') {
      this.clearExistingStyles(fragmentNode, style)
      this.removeNodesWithEmptyStyles(fragmentNode);
    } else {
      this.clearExistingClasses(fragmentNode, style);
    }
    if (fragmentNode) wrapperNode.appendChild(fragmentNode);
    this.insertNode(wrapperNode);
    
  }

  private findNodebyTag(tag: string, startNode: Node): Node | null {
    if (startNode.nodeName === tag) {
      console.log('%c⧭', 'color: #f200e2', startNode as HTMLElement);
      return startNode;
    }
    if (startNode.parentNode) {
      if (startNode.parentNode.nodeName === 'Div') {
        return null;
      } else {
        return this.findNodebyTag(tag, startNode.parentNode);
      }
    }
    return null;
  }

  private checkForExistingUnderline(parentNode: Node): boolean {
    for (let index = 0; index < parentNode.childNodes.length; index++) {
      const node = parentNode.childNodes[index];
      if (node.nodeName === 'SPAN') {
        const element = node as HTMLSpanElement;
        if (element.className) {
          if (element.className.includes('underline')) {
            return true;
          }
        }
      }
    };
    return false;
  }

  private isExistingUnderline(style: Style): boolean {
    if (!this.range) throw new Error('Range not set');
    const parentNode = this.findNodebyTag('P', (this.rangeValues.startContainerParent as Node));
    console.log('%c⧭', 'color: #d90000', parentNode);
    // if no parent node then can be no node with underline
    if (parentNode) {
      return this.checkForExistingUnderline(parentNode);
    }
    return false;
  }
}
