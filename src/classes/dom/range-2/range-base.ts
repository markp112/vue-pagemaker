import { Style } from '@/models/styles/styles';
import { ClassOrStyle } from '../range/range-base';

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

  /**
   * @description check the parent hierarchy for the existence of class 
   * @param node node to start search from
   * @param className name of class to search for
   * @returns null if no parent found or parent node is P tag i.e. the start of the line
   */
  public findParentNodeWithClass(node: Node | null, className: string): Node | null {
    if (!node) return node;
    if (node.nodeName === 'P') return null;
    if (node.nodeName === 'SPAN') {
      const element: HTMLSpanElement = node as HTMLSpanElement;
      if (element.className.includes('underline')) {
        return node;
      } 
    }
    if (node.parentNode) {
      return this.findParentNodeWithClass(node.parentNode, className);
    }
    return null;
  }

  public isNodeOfType(node: Node | ChildNode | null, type: HTMLTags): boolean {
    if (!node) throw new Error('isNodeOfType: Ancestor Node is null')
    console.log("called", node.nodeName)
    return node.nodeName === type.toUpperCase();
  }

  public isSelectedRangeASingleParagraph(commonAncestorNode: Node | ChildNode | null): boolean {
    if (!commonAncestorNode) throw new Error('isSelectedRangeASingleParagraph: Ancestor Node is null');
    return !this.isNodeOfType(commonAncestorNode, 'div');
  }

  public isStyleTag(classOrStyle: ClassOrStyle): boolean {
    return classOrStyle === 'style';
  }
}