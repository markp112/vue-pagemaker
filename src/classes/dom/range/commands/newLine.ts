import { Style, StyleTags } from "@/models/styles/styles";
import { HTMLTags, RHBase } from "../range-base";

interface ExistingContent {
  textNode: Text;
  siblings: ChildNode | null;
  parentSiblings: Node[];
};
export class Paragraph extends RHBase {

  id = '';
  constructor(range: Range, id ='') {
    super(range);
    this.id = id;
  }

  public newLine() {
    if(!this.range) throw new Error('Range not set');
    console.log('%c⧭', 'color: #cc7a1d', this.range);
    console.log('%c⧭', 'color: #e50000', this.range.commonAncestorContainer.nextSibling);
    const text = this.range.startContainer;
    console.log('%c⧭', 'color: #733d00', text);
    const nextsib = this.range.commonAncestorContainer.nextSibling;
    console.log('%c⧭', 'color: #00bf00', nextsib);
    // start Container
    // common ancestor next sibling
    // common ancestor parent.nextsibling
// return;
    console.log('%c%s', 'color: #ff6600', this.isInMiddleOfARow());
    let newParagraph: Node; 
    if (this.isInMiddleOfARow()) {
      newParagraph = this.splitLine();
    } else {
      newParagraph = this.createWrapperNode('p');
    }

    const parentNode: Node | null = this.findNextNodeofType(this.range.commonAncestorContainer, 'DIV');
    if (parentNode) {
      const node = this.range.commonAncestorContainer.parentNode 
        ?  this.findNextNodeofType(this.range.commonAncestorContainer, 'P')
        : null;
      const insertAfterNode: Node | null = node?.nextSibling ? node.nextSibling : null;
      // parentNode.appendChild(paraNode);
      parentNode.insertBefore(newParagraph, insertAfterNode);
      this.setParagrah(newParagraph);
    }
    else {
    throw new Error('Parent node not found');
  }
}

  private isInMiddleOfARow(): boolean {
    if(!this.range) throw new Error('Range not set');
    if (this.range.startOffset === 0 && this.range.endOffset === 0) return false;
    if (this.range.collapsed) {
      const parent: Node | null = this.range.commonAncestorContainer.parentNode;
      if (parent) {
        if((parent.nextSibling !== null)) {
          return true;
        };
      }
      if (!(this.range.startOffset === (this.range.commonAncestorContainer as Text).length)) {
        return true;
      }
    } 
    return false;
  }

  splitLine(): Node {
    let nodeContent: ExistingContent | null = null;
    let classes = '';
    let styles: Style [] = [];
    nodeContent = this.getContent();
    classes = this.getClasses();
    styles = this.getStyling();
    const newParagraph: Node = this.createWrapperNode('p');
    this.setClass(newParagraph, classes)
    this.setElementId(newParagraph, this.id);
    const startNode = this.range.startContainer;
    const nextSibling = this.range.commonAncestorContainer.nextSibling;
    const parentNextSibling = this.range.commonAncestorContainer.parentElement?.nextSibling;
    newParagraph.appendChild(startNode);
    if (nextSibling) {
      newParagraph.appendChild(nextSibling);
    }
    if (parentNextSibling) {
      newParagraph.appendChild(parentNextSibling);
    }
    return newParagraph;
    // const spanNode = this.createWrapperNode('span');
    // (spanNode as HTMLSpanElement).className = classes;
    // this.applyStyles(spanNode, styles);
    // if (nodeContent) {
    //   if (nodeContent.textNode) {
    //     spanNode.appendChild(nodeContent.textNode);
    //   }
    //   newParagraph.appendChild(spanNode);
    //   if (nodeContent.siblings) {
    //     newParagraph.appendChild(nodeContent.siblings);
    //   }
    //   if (nodeContent.parentSiblings.length > 0) {
    //     nodeContent.parentSiblings.forEach(node => {
    //       newParagraph.appendChild(node);
    //     })
    //   }
    // }
    // return newParagraph;
  }

  private getContent(): ExistingContent {
    const textNode: Text = this.getTextToEndOfLine(); 
    const siblings = (this.range.commonAncestorContainer as Text).nextElementSibling;
    console.log('%c⧭', 'color: #e50000', this.range.commonAncestorContainer.nextSibling);
    // it has created the chop
    const parentSiblings: Node[] = [];
    let parent = this.range.commonAncestorContainer.parentNode;
    if (parent) {
      while (parent.nextSibling !== null) {
        parentSiblings.push(parent.nextSibling);
        if (parent.parentNode) {
          parent = parent.parentNode
        } else {
          break;
        }
      }
    }
    console.log('%c⧭', 'color: #ace2e6', parentSiblings);

    return {
      textNode,
      siblings,
      parentSiblings,
    };
  }

  private getClasses(): string {
    const parentNode = this.range.commonAncestorContainer.parentNode;
    console.log('%c⧭', 'color: #40fff2', parentNode);
    if (parentNode) {
      if (parentNode.nodeName === 'SPAN') {
        return (parentNode as HTMLSpanElement).className;
      }
    }
    return '';
  }

  private getStyling(): Style[] {
    const parentNode = this.range.commonAncestorContainer.parentNode;
    if (parentNode) {
      if (parentNode.nodeName === 'SPAN') {
        const styles: Style[] = [];
        this.getNodeStyles(parentNode, styles);
        return styles;
      }
    }
    return [];
  }

  private getTextToEndOfLine(): Text {
    console.log('%c⧭', 'color: #86bf60', this.range.commonAncestorContainer);
    return (this.range.commonAncestorContainer as Text).splitText(this.range.startOffset);
  }

  private getParentNodeType(node: Node): HTMLTags {
    if (node.parentNode) {
      return this.getNodeType(node.parentNode);
    }
    return 'undefined';
  }

  private getNodeStyles(node: Node | null, spanStyles: Style[]): void {
    console.log('%c%s', 'color: #cc7033', 'getNodeStyles');
    if (!node) return;
   
    const styles = (node as HTMLSpanElement).style;
    console.log('%c⧭', 'color: #f27999', styles);
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
      this.getNodeStyles(node.parentNode, spanStyles);
      console.log('%c⧭', 'color: #5200cc', spanStyles);
    }
  }

  applyStyles(spanNode: Node, styles: Style[]) {
    if (styles.length === 0) return
      styles.forEach(style => {
        this.cleanStyle(style);        
        this.setStyle(spanNode, style);
      })
  }

  private cleanStyle(style: Style) {
    if (!style.style.includes('-')) return;
    const index = style.style.indexOf('-');
    const  styleName = style.style.substring(0, index)
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