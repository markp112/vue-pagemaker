import { Style } from '@/models/styles/styles';
import { RangeBase } from '../range-base';


export class Underline extends RangeBase {

  constructor(range: Range) {
    super(range);
  }
  
  private underline: Style = {
    style: 'text-decoration',
    value: 'underline',
  };

  add(spanNode: HTMLSpanElement): Node {
    return this.addClass(spanNode, this.underline);
  }

  findNodeWithUnderlineClass(node: Node | null): Node | null {
    if (!node) return node;
    if (node.nodeName === 'SPAN') {
      const element: HTMLSpanElement = node as HTMLSpanElement;
      if (element.className.includes('underline')) {
        return node;
      } 
    }
    
    if (node.previousSibling) {
      console.log("previous sibling",node.previousSibling.textContent)
      return this.findNodeWithUnderlineClass(node.previousSibling);
    } 
      
    if (node.parentNode) {
      return this.findNodeWithUnderlineClass(node.parentNode);
    }
    return null;
  }

}