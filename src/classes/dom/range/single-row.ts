import { Style } from '@/models/styles/styles';
import { RHBase, HTMLTags } from './range-base';

export class RangeRow extends RHBase {
  private fragment: DocumentFragment | null = null;

  constructor(range: Range) {
    super(range);
  }

  process(htmlTag: HTMLTags, style: Style) {
    if (!this.range) throw new Error('RH: Range not set');
    if (!this.rangeValues.ancestorHasChildren) {
      this.createWrapperNoChildren(htmlTag, style);
    }
    if (this.rangeValues.ancestorHasChildren) {
        this.createWrapperWithChildren(htmlTag, style);
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
    this.setStyle(wrapperNode, style);
    if (this.fragment) wrapperNode.appendChild(this.fragment)
    this.insertNode(wrapperNode);
  }

  private createWrapperWithChildren(htmlTag: HTMLTags, style: Style) {
    if(!this.range) throw new Error('Range not set');
    if (this.range.commonAncestorContainer === this.range.startContainer) {
      this.createNodeFromFragment(htmlTag, style)
      return;
    }
    const firstNodeLength = this.getTextNodeLength(this.range.commonAncestorContainer.childNodes[0]);
    if (this.rangeValues.start === firstNodeLength) {
      this.createNodeFromFragment(htmlTag, style)
      return;
    }
    this.fragment = this.range.extractContents();
    this.createNewNodeAsWrapper(htmlTag, style);
  }

  createNodeFromFragment(htmlTag: HTMLTags, style: Style) {
    if(!this.range) throw new Error('Range not set');
    this.fragment = this.range.extractContents();
    const wrapperNode: Node | null = this.fragment ? this.fragment.querySelector('span') : this.createWrapperNode(htmlTag);
    if (wrapperNode) {
      this.clearExistingStyles(wrapperNode, style)
      this.setStyle(wrapperNode, style);
      wrapperNode.childNodes.forEach(node => {this.removeNodesWithEmptyStyles(node);})
      this.insertNode(wrapperNode);
    }
  }

  private createNewNodeAsWrapper(htmlTag: HTMLTags, style: Style) {
    if(!this.range) throw new Error('Range not set');
    const wrapperNode = this.createWrapperNode(htmlTag);
    this.setStyle(wrapperNode, style);
    const fragmentNode: Node = this.fragment as Node;
    this.clearExistingStyles(fragmentNode, style)
    this.removeNodesWithEmptyStyles(fragmentNode);
    if (fragmentNode) wrapperNode.appendChild(fragmentNode);
    this.insertNode(wrapperNode);
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
