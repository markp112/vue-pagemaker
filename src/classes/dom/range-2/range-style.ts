import { Style } from '@/models/styles/styles';
import { faTextHeight } from '@fortawesome/free-solid-svg-icons';
import { RangeBase } from './range-base';

type expectedNodeTypes = Node | ChildNode | null;

export class RangeStyle extends RangeBase {

  constructor(range: Range) {
    super(range);
  }

  applyStyle(node: expectedNodeTypes , style: Style): Node | ChildNode {
    if (!node) throw new Error ("appyStyle: Cannot apply style to Null")
    const element = node as HTMLElement;
    for (const key in element.style) {
      if (key === style.style) {
        element.style[key] = style.value;
        break;
      }
    }
    return node;
  }

  removeStyleFromANode(node: expectedNodeTypes, styletoRemove: Style): Node | ChildNode {
    if (!node) throw new Error ("appyStyle: Cannot apply style to Null");
    if (node.nodeName === '#text') return node;
    const element = node as HTMLElement;
    if (element.style.length > 0) {
      styletoRemove.value = '';
      return this.applyStyle(node, styletoRemove);
    }
    return node;
  }

  removeStyleFromChildNodes(node: expectedNodeTypes, style: Style ):  Node | ChildNode {
    if (!node) throw new Error ("appyStyle: Cannot apply style to Null");
    if (node.hasChildNodes()) {
      this.removeStyleFromChildNodes(node, style);
    }
    return this.removeStyleFromANode(node, style);
  }
}