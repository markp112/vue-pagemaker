import { RHBase, HTMLTags } from '../range-base';
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

  private hasClassUnderline(node: Node): boolean {
    const spanElement = node as HTMLSpanElement;
    const className = spanElement.className;
    if (className) {
      return className.includes('underline');
    }
    return false;
  }

  isUnderlined(node: Node | null) {
    if (node === null) {
      return false;
    }
    if (node.nodeName === 'P') {
      return false;
    }
    if (node.nodeName === 'Span') {
      if (this.hasClassUnderline(node)) {
        return true;
      }
    }
    this.isUnderlined(node.parentNode)
  }

  removeUnderline() {
    return;
  }

  addUnderline(htmlTag: HTMLTags) {
    this.fragment = this.range.extractContents();
    const wrapperNode: Node | null = this.fragment
      ? this.fragment.querySelector('span')
      : this.createWrapperNode(htmlTag);
    return;
  }

  process(htmlTag: HTMLTags) {
    const isUnderline = this.isUnderlined(this.rangeValues.startContainerParent);
    if (isUnderline) {
      this.removeUnderline();
    } else {
      this.addUnderline(htmlTag);
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