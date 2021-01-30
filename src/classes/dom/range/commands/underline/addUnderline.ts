import { RHBase, HTMLTags, ClassOrStyle } from '@/classes/dom/range/range-base';
import { SelectedContent } from "./underline";
import { RangeStyles } from '../../rangeStyling/rangeStyles';
import { Style } from '@/models/styles/styles';
import { hasClassUnderline } from './helpers';


export class AddUnderline extends RHBase {
  private rangeStyling = new RangeStyles();
  private UNDERLINE = 'textDecoration underline';
  private isElementUnderlined: SelectedContent = {
    startContent: false,
    selectedContent: false,
    endContent: false,
  };

  constructor(isElementUnderlined: SelectedContent, range: Range) {
    super(range);
    this.isElementUnderlined = isElementUnderlined;
  }

  process() {
      // five scenarios 
    // nothing underlined
    // start not underlined rest is underlined
    // start is underlined end is not underlined
    // start is underlined middle is not underlined end is underlined
    // start is not underlined middle is underlined end if not underlined
    const htmlTag = 'span';
    if (!this.isElementUnderlined.startContent && !this.isElementUnderlined.selectedContent
      && !this.isElementUnderlined.endContent ) {
        this.rangeValues.ancestorHasChildren 
        ? this.createWrapperWithChildren(htmlTag)
        : this.createWrapperNoChildren(htmlTag);
        return;
      }
      let nodeWithUnderline: Node;
      if (!this.isElementUnderlined.startContent && this.isElementUnderlined.endContent) {
        nodeWithUnderline = this.getParentNodeWithUnderline(this.range.endContainer)!;
      } else {
         nodeWithUnderline = this.getParentNodeWithUnderline(this.range.startContainer)!;
      }
      const fragment = this.range.extractContents();
      if (!this.isElementUnderlined.startContent && this.isElementUnderlined.endContent) {
          nodeWithUnderline.insertBefore(fragment, nodeWithUnderline.childNodes[0]);
          return;
      }
      if (this.isElementUnderlined.startContent) {
          nodeWithUnderline.appendChild(fragment);
          return;
      }
  }

  private getParentNodeWithUnderline(node: Node | null): Node | null {
    if (!node) return null;
    if (node.nodeName === 'P') return null;
    if (node.nodeName === 'SPAN') {
      if (hasClassUnderline(node) || (node as HTMLSpanElement).innerHTML.includes('underline')) {
        return node;
      }
    }
    return this.getParentNodeWithUnderline(node.parentNode);
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
    this.createNewNodeAsWrapper(htmlTag, { style: 'textDecoration', value: 'underline' } , 'class');
  }

  private createNodeFromFragment(htmlTag: HTMLTags) {
    if(!this.range) throw new Error('Range not set');
    this.fragment = this.range.extractContents();
    const wrapperNode: Node | null = this.fragment ? this.fragment.querySelector('span') : this.createWrapperNode(htmlTag);
    if (wrapperNode) {
      this.rangeStyling.clearExistingClasses(wrapperNode, { style: 'textDecoration', value: 'underline' });
      this.rangeStyling.setClass(wrapperNode, this.UNDERLINE);
      this.insertNode(wrapperNode);
      }
    }

    private createNewNodeAsWrapper(htmlTag: HTMLTags, style: Style, classOrStyle: ClassOrStyle) {
      if(!this.range) throw new Error('Range not set');
      const wrapperNode = this.createWrapperNode(htmlTag);
      const fragmentNode: Node = this.fragment as Node;
      this.rangeStyling.setStyleOrClass(wrapperNode, style, classOrStyle);
      this.rangeStyling.clearExistingClasses(fragmentNode, style);
      if (fragmentNode) wrapperNode.appendChild(fragmentNode);
      this.insertNode(wrapperNode);
    }

    private createWrapperNoChildren(htmlTag: HTMLTags) {
      this.fragment = this.range.extractContents();
      const wrapperNode = this.createWrapperNode(htmlTag);
      const fragmentNode: Node = this.fragment as Node;
      if (wrapperNode) {
        this.rangeStyling.clearExistingClasses(wrapperNode, { style: 'textDecoration', value: 'underline' });
        this.rangeStyling.setClass(wrapperNode, this.UNDERLINE);
        if (fragmentNode) wrapperNode.appendChild(fragmentNode);
        if (this.range) {
          this.range.insertNode(wrapperNode);
        }
      }
    }
}