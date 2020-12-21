import { Style, StyleTags } from "@/models/styles/styles";
import { HTMLTags, RHBase } from "../range-base";
import  Guid  from "@/utils/guid";
  

interface ExistingContent {
  textNode: Text;
  siblings: ChildNode | null;
  parentSiblings: Node[];
};
export class Paragraph extends RHBase {
  id = '';
  
  constructor(range: Range, id ='') {
    super(range);
    console.log('%c⧭', 'color: #1d3f73', range);
    this.id = Guid.newSmallGuid();

  }

  public newLine() {
    if(!this.range) throw new Error('Range not set');

    const text = this.range.startContainer;
    const nextsib = this.range.commonAncestorContainer.nextSibling;
    // start Container
    // common ancestor next sibling
    // common ancestor parent.nextsibling
// return;
    // console.log('%c%s', 'color: #ff6600', this.isInMiddleOfARow());
    let newParagraph: Node; 

    if (this.isEndOfLine() || this.isStartOfLine() ) {
      newParagraph = this.createWrapperNode('p');
      this.setElementId(newParagraph, this.id)
      newParagraph.textContent = ' ';
    } else {
      newParagraph = this.splitLine();
    }
    const parentNode: Node | null = this.findNextNodeofType(this.range.commonAncestorContainer, 'DIV');
    if (parentNode) {
      const node = this.range.commonAncestorContainer.parentNode 
      ?  this.findNextNodeofType(this.range.commonAncestorContainer, 'P')
      : null;
      console.log('%c⧭', 'color: #997326', node);
      let insertAfterNode: Node | null;
      // parentNode.appendChild(paraNode);
      if (this.isStartOfLine()) {
        insertAfterNode = node?.previousSibling ? node.previousSibling : null;
      } else {
        insertAfterNode = node?.nextSibling ? node.nextSibling : null;
      }
      if (insertAfterNode) {
        console.log('%c⧭', 'color: #bfffc8', insertAfterNode);
        parentNode.insertBefore(newParagraph, insertAfterNode);
      } else {
        parentNode.appendChild(newParagraph);
      }
      this.setParagrah(newParagraph);
    }
    else {
    throw new Error('Parent node not found');
  }
}
  isEndOfLine(): boolean {
    const startOffset = this.range.startOffset;
    const endOffset = this.range.endOffset;
    const length = (this.range.commonAncestorContainer as Text).length;
    if (startOffset === endOffset && startOffset === length) {
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
      if ((this.range.startOffset !== (this.range.commonAncestorContainer as Text).length)) {
        console.log('%c%s', 'color: #ffa640', this.range.startOffset);
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
    console.log('%c⧭', 'color: #006dcc', nodeContent);
    const newParagraph: Node = this.createWrapperNode('p');
    const spanNode: Node = this.createWrapperNode('span');
    this.setClass(newParagraph, classes)
    this.setElementId(newParagraph, this.id);
    const startNode = this.range.startContainer;
    classes = this.getClasses(startNode);
    console.log('%c%s', 'color: #f200e2', classes);
    styles = this.getStyling(startNode, styles);
    console.log('%c⧭', 'color: #00b300', styles);
    let siblings: Node[] = [];
    let parentNextSiblings: Node[] = [];
    //working code 
    siblings = this.getSiblings(startNode, siblings);
    console.log('%c⧭', 'color: #917399', siblings);
    const parentNextSibling = this.range.commonAncestorContainer.parentElement;
    if (parentNextSibling) {
      parentNextSiblings = this.getSiblings(parentNextSibling, parentNextSiblings);
    }
    console.log('%c⧭', 'color: #d90000', parentNextSiblings);

    spanNode.appendChild(nodeContent.textNode);
    siblings.forEach(sibling => {
      spanNode.appendChild(sibling);
    });
    newParagraph.appendChild(spanNode);
    parentNextSiblings.forEach(sibling => {
      spanNode.appendChild(sibling)
    });
      this.applyStyles(spanNode, styles);
    (spanNode as HTMLSpanElement).className = classes;
    return newParagraph;
    
  }

  private  getSiblings(node: Node, siblings: Node[]): Node[] {
    if (node.nextSibling) {
      if (node.nodeName !=='SPAN' && node.nodeName !=='#text') return siblings;
      
      siblings.push(node.nextSibling);
      return this.getSiblings(node.nextSibling, siblings);
  }
    return siblings;
  }

  private getContent(): ExistingContent {
    const textNode: Text = this.getTextToEndOfLine(); 
    const siblings = (this.range.commonAncestorContainer as Text).nextElementSibling;
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
    return {
      textNode,
      siblings,
      parentSiblings,
    };
  }


  private getClasses(node: Node): string {
    let classes = "";
    classes +=" " + (node as HTMLSpanElement).className; 
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
    console.log('%c⧭', 'color: #f27999', styles);
    if (styles) {
      for (let index = 0; index < styles.length; index++) {
        if(styles[index]) {

          console.log('%c⧭', 'color: #1d5673', styles[index] );
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