import { Style } from '@/models/styles/styles';

export type HTMLTags = 'div' | 'span' | 'p' | 'b' | 'u' | 'i' | 'text' | 'br' | 'undefined';
interface KeyValueString {
  [key: string]: HTMLTags;
}

export class RangeBase {
  range: Range;

  constructor(range: Range) {
    this.range = range;
  }

  saveCurrentRange(contentRef: HTMLParagraphElement ) {
    const selection: Selection | null = window.getSelection
      ? window.getSelection()
      : document.getSelection();
    const content = contentRef;
    if (!selection || !content) {
      return;
    }
    for (let i = 0; i < selection.rangeCount; i++) {
      const range = selection.getRangeAt(0);
      let start: Node | null = range.startContainer;
      let end: Node | null = range.endContainer;
      // for IE11 : node.contains(textNode) always return false
      start = start.nodeType === Node.TEXT_NODE ? start.parentNode : start;
      end = end.nodeType === Node.TEXT_NODE ? end.parentNode : end;
      if (content.contains(start) && content.contains(end)) {
        this.range = range;
        break;
      }
    }
  }

  public getNodeType(node: Node): HTMLTags {
    const nodeName = node.nodeName;
    const nodeMap: KeyValueString = {
      '#text': 'text',
      'SPAN': 'span',
      'P': 'p',
      'DIV': 'div',
    };
    const value: HTMLTags = nodeMap[nodeName];
    return value === undefined ? 'undefined' : value;
  }

  public addClass(node: Node, style: Style): Node {
    const element = node as HTMLElement;
    element.className = `${style.style} ${style.value}`;
    return node;
  }
}