import { Style } from '@/models/styles/styles';
import { RHBase, HTMLTags, ClassOrStyle } from './range-base';
import { Underline } from './commands/underline';

export class RangeRow extends RHBase {
  private fragment: DocumentFragment | null = null;

  constructor(range: Range) {
    super(range);
  }

  process(htmlTag: HTMLTags, style: Style, classOrStyle: ClassOrStyle) {
    if (!this.range) throw new Error('RH: Range not set');
    
    if (!this.rangeValues.ancestorHasChildren) {
      this.createWrapperNoChildren(htmlTag, style, classOrStyle);
    }
    if (this.rangeValues.ancestorHasChildren) {
        this.createWrapperWithChildren(htmlTag, style, classOrStyle);
    }
  }

  private getTextNodeLength(node: Node): number {
    if (node.nodeName !=='#text') return -1;
    return (node as Text).length;
  }

  private createWrapperNoChildren(htmlTag: HTMLTags, style: Style, classOrStyle: ClassOrStyle) {
    console.log('%c%s', 'color: #aa00ff', 'createWrapperNoChildren');
    if(!this.range) throw new Error('Range not set');
    this.fragment = this.range.extractContents();
    const wrapperNode: Node = this.createWrapperNode(htmlTag);
    this.setStyleOrClass(wrapperNode, style, classOrStyle);
    let hasUnderLine = false;
    if (classOrStyle === 'class') {
      console.log('%c⧭', 'color: #e50000', classOrStyle);
      if (style.value === 'no-underline') {
        hasUnderLine = this.isExistingUnderline(style);
        console.log('%c%s', 'color: #007300', hasUnderLine);
      }
    }
    // add back the content contained when the fragment was extracted
    if (this.fragment) {
      wrapperNode.appendChild(this.fragment)
    }
    if (style.value === 'no-underline') {
      const underLine = new Underline(this.range, wrapperNode);
      underLine.insertNoUnderlineNode(this.rangeValues.startContainerParent)
    } else {
      this.insertNode(wrapperNode);
    }
  
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
    let hasUnderLine = false;
    if (wrapperNode) {
      if (classOrStyle === 'style') {
        this.clearExistingStyles(wrapperNode, style)
        this.setStyle(wrapperNode, style);
        wrapperNode.childNodes.forEach(node => {
          this.removeNodesWithEmptyStyles(node);
        })
      } else {
        if (style.value === 'no-underline') {
          hasUnderLine = this.isExistingUnderline(style);
        }
        this.clearExistingClasses(wrapperNode, style);
        this.setClass(wrapperNode, style);
      }
      console.log('%c%s', 'color: #00bf00', hasUnderLine);
      if (style.value === 'no-underline') {
        const underLine = new Underline(this.range, wrapperNode);
        underLine.insertNoUnderlineNode(this.rangeValues.startContainerParent)
      } else {
        this.insertNode(wrapperNode);
      }
    }
  }

  private createNewNodeAsWrapper(htmlTag: HTMLTags, style: Style, classOrStyle: ClassOrStyle) {
    if(!this.range) throw new Error('Range not set');
    const wrapperNode = this.createWrapperNode(htmlTag);
    const fragmentNode: Node = this.fragment as Node;
    this.setStyleOrClass(wrapperNode, style, classOrStyle);
    let hasUnderLine = false;
    if (classOrStyle === 'style') {
      this.clearExistingStyles(fragmentNode, style)
      this.removeNodesWithEmptyStyles(fragmentNode);
    } else {
      if (style.value === 'no-underline') {
        hasUnderLine = this.isExistingUnderline(style);
      }
      this.clearExistingClasses(fragmentNode, style);
    }
    if (fragmentNode) wrapperNode.appendChild(fragmentNode);
    console.log('%c%s', 'color: #32b3f3', hasUnderLine);
    if (style.value === 'no-underline') {
      const underLine = new Underline(this.range, wrapperNode);
      underLine.insertNoUnderlineNode(this.rangeValues.startContainerParent)
    } else {
      this.insertNode(wrapperNode);
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
