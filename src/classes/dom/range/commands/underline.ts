import { RHBase } from '../range-base';
import { Style } from '@/models/styles/styles';

export class Underline extends RHBase {
  private _underLineNode: Node;

  private noUnderline: Style = {
    style: 'textDecoration',
    value: 'no-underline',
  };

  private underline: Style = {
    style: 'textDecoration',
    value: 'underline',
  };

  constructor(range: Range, underlineNode: Node ) {
    super(range);
    this._underLineNode = underlineNode;
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
  const pNode = this.findNextNodeofType(parentNode,'P');
  console.log('%c⧭', 'color: #e57373', pNode);
  pNode?.insertBefore(this._underLineNode, parentNode.nextSibling);
  const newUnderLineSpan = this.createWrapperNode('span');
  this.setClass(newUnderLineSpan, this.underline);
  pNode?.insertBefore(newUnderLineSpan, this._underLineNode.nextSibling);

  }


}