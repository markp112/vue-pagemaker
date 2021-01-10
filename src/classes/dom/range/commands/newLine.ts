import { Style, StyleTags } from "@/models/styles/styles";
import { HTMLTags, RHBase } from "../range-base";
import  Guid  from "@/utils/guid";
import { RangeStyles } from "../rangeStyling/rangeStyles";
  
export class Paragraph extends RHBase {
  private id = '';
  private rangeStyling = new RangeStyles();
  
  constructor(range: Range) {
    super(range);
    this.id = Guid.newSmallGuid();
  }

  public newLine() {
    if(!this.range) throw new Error('Range not set');
    let newParagraph: Node; 
    if (this.isEndOfLine() || this.isStartOfLine() ) {
      newParagraph = this.createWrapperNode('p');
      this.setElementId(newParagraph, this.id)
      newParagraph.textContent = ' ';
    } else {
      newParagraph = this.splitLine();
    }
    this.insertParagraph(newParagraph);
  }

  insertParagraph(newParagraph: Node) {
    const textEditorContainer: Node | null = this.findNextNodeofType(this.range.commonAncestorContainer, 'DIV');
    if (textEditorContainer) {
      const node = this.range.commonAncestorContainer.parentNode
        ?  this.findNextNodeofType(this.range.commonAncestorContainer, 'P')
        : null;
      let insertAfterNode: Node | null;
      if (this.isStartOfLine()) {
        insertAfterNode = this.findNextNodeofType(this.range.startContainer, 'P');
      } else {
        insertAfterNode = node?.nextSibling ? node.nextSibling : null;
      }
      if (insertAfterNode) {
        textEditorContainer.insertBefore(newParagraph, insertAfterNode);
      } else {
        textEditorContainer.appendChild(newParagraph);
      }
      this.setParagrah(newParagraph);
    } else {
      throw new Error('Parent node not found');
    }
  }

  isEndOfLine(): boolean {
    const startOffset = this.range.startOffset;
    const endOffset = this.range.endOffset;
    const length = (this.range.commonAncestorContainer as Text).length;
    if (startOffset === endOffset && startOffset === length && this.range.startContainer.nextSibling === null) {
      return true;
    }
    return false;
  }

  isStartOfLine(): boolean {
    const startOffset = this.range.startOffset;
    const endOffset = this.range.endOffset;
    if (startOffset === 0 && endOffset === 0) {
      return true;
    }
    return false;
  }

  splitLine(): Node {
    const startNode = this.range.startContainer;
    const spanNode: Node = this.createNewSpanNode();
    const newParagraph: Node = this.createNewParagraph(spanNode);
    this.addParentSiblings(newParagraph);
    this.addSiblings(spanNode);
    const classes = this.getClasses(startNode);
    const styles = this.getStyling(startNode, []);
    this.applyStyles(spanNode, styles);
    if (classes) {
      (spanNode as HTMLSpanElement).className = classes;
    }
    return newParagraph;
  }

  addSiblings(spanNode: Node) {
    const siblings = this.getSiblings(this.range.startContainer, []);
    siblings.forEach(sibling => {
      spanNode.appendChild(sibling);
    });
  }

  addParentSiblings(newParagraph: Node) {
    const parentNextSibling = this.range.commonAncestorContainer.parentElement;
    if (parentNextSibling) {
      const parentNextSiblings = this.getSiblings(parentNextSibling, []);
      parentNextSiblings.forEach(sibling => {
        newParagraph.appendChild(sibling)
      });
    }
  }

  private createNewParagraph(spanNode: Node): Node {
    const newParagraph: Node = this.createWrapperNode('p');
    this.setElementId(newParagraph, this.id);
    newParagraph.appendChild(spanNode);
    return newParagraph;
  }

  private createNewSpanNode(): Node {
    const nodeContent: Text | null = this.getContent();
    const spanNode: Node = this.createWrapperNode('span');
    spanNode.appendChild(nodeContent);
    return spanNode;
  }

  private getSiblings(node: Node, siblings: Node[]): Node[] {
    if (node.nextSibling) {
      if (node.nodeName !=='SPAN' && node.nodeName !=='#text') return siblings;
      siblings.push(node.nextSibling);
      return this.getSiblings(node.nextSibling, siblings);
  }
    return siblings;
  }

  private getContent(): Text {
    return this.getTextToEndOfLine(); 
  }

  private getClasses(node: Node): string {
    let classes = "";
    classes += " " + (node as HTMLSpanElement).className; 
    if (!node.parentNode) return classes;
    if (node.parentNode.nodeName === 'P') return classes;
    classes += this.getClasses(node.parentNode);
    return classes;
  }

  private getStyling(node: Node, styles: Style[]): Style[] {
    const parentNode = node.parentNode;
    if (parentNode) {
      if (parentNode.nodeName === 'SPAN') {
       this.getNodeStyles(parentNode, styles);
        return styles;
      }
    }
    return styles;
  }

  private getTextToEndOfLine(): Text {
    const text = this.range.startContainer as Text;
    return text.splitText(this.range.startOffset);
  }

  private getParentNodeType(node: Node): HTMLTags {
    if (node.parentNode) {
      return this.getNodeType(node.parentNode);
    }
    return 'undefined';
  }

  private getNodeStyles(node: Node | null, spanStyles: Style[]): Style[] {
    if (!node) return spanStyles;
    const styles = (node as HTMLSpanElement).style;
    if (styles) {
      for (let index = 0; index < styles.length; index++) {
        if(styles[index]) {
          const styleName = (styles[index] as unknown) as StyleTags;
          const style: Style = {
            style: styleName,
            value: styles.getPropertyValue(styles[index]),
          };
          if (style.style !=='') spanStyles.push(style);
        
        } else {
          break;
        }
      };
    }
    if (this.getParentNodeType(node) === 'span') {
      return this.getNodeStyles(node.parentNode, spanStyles);
    }
    return spanStyles;
  }

  applyStyles(spanNode: Node, styles: Style[]) {
    styles.forEach(style => {
      this.cleanStyle(style);        
      this.rangeStyling.setStyle(spanNode, style);
    })
  }

  private cleanStyle(style: Style) {
    if (!style.style.includes('-')) return;
    const index = style.style.indexOf('-');
    const styleName = style.style.substring(0, index)
      + style.style.replace('-','').charAt(index).toUpperCase()
      + style.style.substring(index + 2);;
    style.style = styleName as StyleTags;
  }

  private setParagrah(node: Node) {
    const range = document.createRange();
    range.setStart(node, 0);
    const end = node.childNodes.length ? node.childNodes.length : ((node as Text).length ? (node as Text).length : 0);
    range.setEnd(node, end);
    range.collapse(true);
    const selection = window.getSelection() ? window.getSelection() : document.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
}