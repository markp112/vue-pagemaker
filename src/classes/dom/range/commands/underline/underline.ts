import { RHBase, HTMLTags, ClassOrStyle } from '@/classes/dom/range/range-base';
import { Style, } from '@/models/styles/styles';
import { TriangleDirective } from '@/shared/directives/triangle/triangle';
import { symbolName } from 'typescript';
import { RangeStyles } from '../../rangeStyling/rangeStyles';

type StringOrNull = string | null;

interface SelectedContent {
  startContent: boolean,
  selectedContent: boolean,
  endContent: boolean,
}

export class Underline extends RHBase {

  private underline: Style = {
    style: 'text-decoration',
    value: 'underline',
  };
  private isElementUnderlined: SelectedContent = {
    startContent: false,
    selectedContent: false,
    endContent: false,
  };
  private rangeStyling = new RangeStyles();
  
  constructor(range: Range) {
    super(range);
  }
  
  public process(htmlTag: HTMLTags) {
    console.log('%c%s', 'color: #364cd9', 'process');
    this.isElementUnderlined = this.getNodesInSelectionUnderlineStatus();
    const hasUnderline = this.isElementUnderlined.startContent && this.isElementUnderlined.endContent && this.isAllUnderlined();
    console.log('%c⧭', 'color: #ffa280', this.isElementUnderlined);
    console.log('%c⧭', 'color: #33cc99', hasUnderline);
    if (hasUnderline) {
      this.removeUnderline();
    } else {
      this.addUnderline(htmlTag);
    }
  }

  getNodesInSelectionUnderlineStatus(): SelectedContent {
    const selectedContent: SelectedContent = {
      startContent: this.isParentUnderlined(this.range.startContainer),
      endContent: this.isParentUnderlined(this.range.endContainer),
      selectedContent: this.isParentUnderlined(this.range.commonAncestorContainer),
    };
    return selectedContent;
  }

  isParentUnderlined(node: Node | null): boolean {
    if (!node) return false;
    if (node.nodeName !== 'P') {
      if (node.nodeName === 'SPAN') {
        if (this.hasClassUnderline(node)) {
          return true;
        }
      }
      return this.isParentUnderlined(node.parentNode);
    } 
    return false;
  }

  private findChildNodeIndex(searchNode: Node, contentToMatch: StringOrNull): number {
    for (let index = 0; index < searchNode.childNodes.length; index++) {
      if (searchNode.childNodes[index].textContent === contentToMatch) {
        return index;
      }
    }
    return -1;
  }

  private hasClassUnderline(node: Node): boolean {
    const spanElement = node as HTMLSpanElement;
    const className = spanElement.className;
    if (className) {
      return className.includes('underline');
    }
    return false;
  }

  // remove the underline if present
  private removeUnderline() {
    if (!this.range.collapsed) {
      this.removeUnderlineFromNonCollapsedRange()
    }

  }

  private removeUnderlineFromNonCollapsedRange() {
    const nodeWithUnderline = this.getParentNodeWithUnderline(this.range.commonAncestorContainer)!;
    const isThisNodeAnOnlyChild = nodeWithUnderline.childNodes.length === 1;
    if (isThisNodeAnOnlyChild) {
      const parentOfUnderline = nodeWithUnderline.parentNode!;
      const nextSibling = nodeWithUnderline.nextSibling;
      const previousSibling = nodeWithUnderline.previousSibling;
      // deal with selected text at start including all of the text being selected
      if (this.range.startOffset === 0) {
        const fragment = this.range.extractContents();
        parentOfUnderline.insertBefore(fragment, nodeWithUnderline);
        return;
      }
      // selection is at the end
      if (this.rangeValues.end === this.range.commonAncestorContainer.textContent?.length) {
        const fragment = this.range.extractContents();
        if (nextSibling) {
          parentOfUnderline.insertBefore(fragment, nextSibling);
        } else {
          parentOfUnderline.appendChild(fragment);
        }
        return;
      }
      // selection must be in the middle
      const fragment = this.range.extractContents();
      let wrapperEnd = this.createWrapperNode('span');
      let wrapperStart = this.createWrapperNode('span');
      const className = (nodeWithUnderline as HTMLElement).className;
      const styles: Style[] = this.rangeStyling.getStylesFromNode(nodeWithUnderline);
      (wrapperEnd as HTMLElement).className = className;
      (wrapperStart as HTMLElement).className = className;
      wrapperEnd = this.rangeStyling.setStyles(wrapperEnd, styles);
      wrapperStart = this.rangeStyling.setStyles(wrapperStart, styles);
      const textContent = this.range.commonAncestorContainer.textContent!;
      wrapperEnd.textContent = textContent.substring(this.range.endOffset);
      wrapperStart.textContent = textContent.substring(0, this.range.startOffset);
      if (nextSibling) {
        parentOfUnderline.insertBefore(wrapperStart, nextSibling);
        parentOfUnderline.insertBefore(fragment, nextSibling);
        parentOfUnderline.insertBefore(wrapperEnd, nextSibling);
        parentOfUnderline.removeChild(nodeWithUnderline);
      } else {
        if (previousSibling) {
          parentOfUnderline.appendChild(wrapperStart);
          parentOfUnderline.appendChild(fragment);
          parentOfUnderline.appendChild(wrapperEnd);
          parentOfUnderline.removeChild(nodeWithUnderline);  
        }
      }
    } else {
      this.reBuild4();
    //   const textContent = this.range.startContainer.textContent!;
    //   console.log('%c%s', 'color: #733d00', textContent);
    //   const fragment = this.range.cloneContents();
    //   console.log('%c⧭', 'color: #00bf00', fragment);
    //   let nodeWithSelection: Node | null = null;
    //   let nodeWithSelectionindex = 0;
    //   console.log('%c⧭', 'color: #aa00ff', nodeWithUnderline.childNodes);
    //   for (const node of nodeWithUnderline.childNodes) {
    //       console.log('%c⧭', 'color: #ffa640', node);
    //       console.log('%c%s', 'color: #917399', node.textContent);
    //     if (node.textContent === textContent) {
    //       nodeWithSelection = node;
    //       break;
    //     }
    //     nodeWithSelectionindex++;
    //     console.log('%c%s', 'color: #00e600', nodeWithSelectionindex);
    //   }
    //   if (nodeWithSelection){
    //     console.log('%c⧭', 'color: #d90000', nodeWithSelection);
    //     const parentOfUnderline = nodeWithUnderline.parentNode!;
    //     console.log('%c⧭', 'color: #9c66cc', fragment);
    //     let wrapperEnd = this.createWrapperNode('span');
    //     let wrapperStart = this.createWrapperNode('span');
    //     let wrapperFragment = this.createWrapperNode('span');
    //     wrapperFragment.appendChild(fragment);
    //     const className = (nodeWithUnderline as HTMLElement).className;
    //     const styles: Style[] = this.rangeStyling.getStylesFromNodeHeirarchy(nodeWithSelection, nodeWithUnderline);
    //     console.log('%c⧭', 'color: #ff6600', styles);

    //     // get the styles going up the tree
    //     (wrapperEnd as HTMLElement).className = className;
    //     (wrapperStart as HTMLElement).className = className;
    //     wrapperEnd = this.rangeStyling.setStyles(wrapperEnd, styles);
    //     wrapperStart = this.rangeStyling.setStyles(wrapperStart, styles);
    //     wrapperFragment = this.rangeStyling.setStyles(wrapperFragment, styles);
        
    //     wrapperEnd.textContent = textContent.substring(this.range.endOffset);
    //     wrapperStart.textContent = textContent.substring(0, this.range.startOffset);
    //     console.log('%c⧭', 'color: #aa00ff', nodeWithUnderline.childNodes.length);
    //     console.log('%c⧭', 'color: #aa00ff', nodeWithUnderline.childNodes);
    //     let index = 0;
    //     let wrapperNode: Node | null = null;
    //     for (const node of nodeWithUnderline.childNodes) {
    //       console.log('%c⧭', 'color: #cc0036', node);
    //       console.log('%c%s', 'color: #00a3cc', index);
    //       if (index === nodeWithSelectionindex) {
    //         parentOfUnderline.insertBefore(wrapperStart, nodeWithUnderline);
    //         parentOfUnderline.insertBefore(wrapperFragment, nodeWithUnderline);
    //         parentOfUnderline.insertBefore(wrapperEnd, nodeWithUnderline);
    //       }
    //       wrapperNode = node.nodeName === '#text' ? this.createWrapperNode('span', node) : node;
    //       (wrapperNode as HTMLElement).className = className;
    //       parentOfUnderline.insertBefore(wrapperNode, nodeWithUnderline);
    //       index++;
    //     }
    //     parentOfUnderline.removeChild(nodeWithUnderline);
    //   }
    }
  }

  reBuild4() {
  const textContent = this.range.startContainer.textContent!;
  const nodeWithUnderline = this.getParentNodeWithUnderline(this.range.commonAncestorContainer)!;
  const parentOfUnderline = nodeWithUnderline.parentNode!;
  const existingNodes: Node[] = this.getChildNodes(nodeWithUnderline);
  const newNodes: Node[] = [];
  const nodeWithSelection = this.findNodeWithSelection(this.range.startContainer, textContent);
  if (nodeWithSelection) {
    const styles: Style[] = this.rangeStyling.getStylesFromNodeHeirarchy(nodeWithSelection, nodeWithUnderline);
    const classNames = this.rangeStyling.getClassesFromNodeHiearchy(nodeWithSelection, nodeWithUnderline);
    const childInUnderlineWihSelection = this.findNodeInHeirarchy(nodeWithSelection, nodeWithUnderline);
    let reachedSelectedNode = false;
    existingNodes.forEach(node => {
      if (reachedSelectedNode) {
        let wrapperNode = this.createWrapperNode('span', node);
        wrapperNode = this.rangeStyling.setStyle(wrapperNode, this.underline);
        newNodes.push(wrapperNode);
      }
      if (node.isEqualNode(childInUnderlineWihSelection)) {
        newNodes.push(...this.processSelectedNode(node, nodeWithUnderline, styles, classNames))
        reachedSelectedNode = true;
      }
      if (!reachedSelectedNode) {
        newNodes.push(node);
      }
    })
  }
  newNodes.forEach(node => {
    parentOfUnderline.appendChild(node);
  })
  console.log('%c⧭', 'color: #00258c', existingNodes);
  console.log('%c⧭', 'color: #994d75', newNodes);
}

private processSelectedNode(parentNode: Node, nodeWithSelection: Node, styles: Style[], className: string): Node[] {
  const parentNodeWithSelectedNode = this.findNodeInHeirarchy(nodeWithSelection, parentNode);
  const nodes: Node[]  = [];
  const newNodes: Node[] = []
  // for (const node of parentNode.childNodes) {
  //   if (node.isEqualNode(nodeWithSelection)) {
  //     break;
  //   }
  //   newNodes.push(node);
  // }
  let wrapperEnd = this.createWrapperNode('span');
  let wrapperStart = this.createWrapperNode('span');
  let wrapperFragment = this.createWrapperNode('span');
  const fragment = this.range.cloneContents();
  wrapperFragment.appendChild(fragment);
  wrapperStart = this.applyStyleAndClasses(wrapperStart, styles, className);
  wrapperEnd = this.applyStyleAndClasses(wrapperEnd, styles, className);
  wrapperFragment = this.applyStyleAndClasses(wrapperFragment, styles, className.replace('textDecoration underline',''));
  const textContent = this.range.startContainer.textContent!;
  wrapperEnd.textContent = textContent.substring(this.range.endOffset);
  wrapperStart.textContent = textContent.substring(0, this.range.startOffset);
  newNodes.push(wrapperStart);
  newNodes.push(wrapperFragment);
  newNodes.push(wrapperEnd);
  
  
  let wrapperChildsNextSibling: Node = this.createWrapperNode('span');
  nodes.push(...this.getChildNodes(parentNode, nodeWithSelection));
  console.log('%c⧭', 'color: #364cd9', nodes);
  nodes.forEach(node => {
    wrapperChildsNextSibling.appendChild(node);
  })
  wrapperChildsNextSibling =this.applyStyleAndClasses(wrapperChildsNextSibling, styles, className);
  console.log('%c⧭', 'color: #33cc99', wrapperChildsNextSibling);
  newNodes.push(wrapperChildsNextSibling);
  return newNodes;
  
   

}



  rebuild3() {
    const textContent = this.range.startContainer.textContent!;
    const parentNode = this.range.commonAncestorContainer.parentNode!;
    const nodeWithUnderline = this.getParentNodeWithUnderline(this.range.commonAncestorContainer)!;
    console.log('%c⧭', 'color: #807160', nodeWithUnderline);
    const parentOfUnderline = nodeWithUnderline.parentNode!;
    console.log('%c⧭', 'color: #007300', parentOfUnderline);
    const nodeWithSelection = this.findNodeWithSelection(parentNode, textContent);
    if (nodeWithSelection) {
      const styles: Style[] = this.rangeStyling.getStylesFromNodeHeirarchy(nodeWithSelection, nodeWithUnderline);
      const classNames = this.rangeStyling.getClassesFromNodeHiearchy(nodeWithSelection, nodeWithUnderline);
      console.log('%c%s', 'color: #997326', classNames);
      const node = this.createWrapperNode('span');
      let wrapperEnd = this.createWrapperNode('span');
      let wrapperStart = this.createWrapperNode('span');
      let wrapperFragment = this.createWrapperNode('span');
      const fragment = this.range.cloneContents();
      console.log('%c⧭', 'color: #bfffc8', fragment);
      wrapperFragment.appendChild(fragment);
      console.log('%c⧭', 'color: #1d3f73', wrapperFragment);
      wrapperStart = this.applyStyleAndClasses(wrapperStart, styles, classNames);
      wrapperEnd = this.applyStyleAndClasses(wrapperEnd, styles, classNames);
      wrapperFragment = this.applyStyleAndClasses(wrapperFragment, styles, classNames.replace('textDecoration underline',''));
      const textContent = this.range.startContainer.textContent!;
      wrapperEnd.textContent = textContent.substring(this.range.endOffset);
      const style: Style = { style: 'textDecoration', value: 'underline' }; 
      
      const childInUnderlineWihSelection = this.findNodeInHeirarchy(nodeWithSelection, nodeWithUnderline);
      let wrapperChildsNextSibling: Node = this.createWrapperNode('span');
      const nodes: Node[] = this.getChildNodes(childInUnderlineWihSelection, nodeWithSelection);
      nodes.forEach(node => {
        wrapperChildsNextSibling.appendChild(node);
      })
      wrapperChildsNextSibling = this.rangeStyling.setStyles(wrapperChildsNextSibling, styles);
      wrapperChildsNextSibling =this.rangeStyling.setClass(wrapperChildsNextSibling, classNames)
     

      wrapperStart.textContent = textContent.substring(0, this.range.startOffset);
      console.log('%c⧭', 'color: #ffcc00', wrapperChildsNextSibling);
      if (wrapperChildsNextSibling) {
        this.reInsertNode(wrapperChildsNextSibling, nodeWithUnderline);
      }
      this.reInsertNode(wrapperEnd, nodeWithUnderline);
      this.reInsertNode(wrapperFragment, nodeWithUnderline);
      this.reInsertNode(wrapperStart, nodeWithUnderline);

      

      console.log('%c⧭', 'color: #cc0088', nodeWithSelection.parentNode);
      if (nodeWithSelection.parentNode?.nextSibling) {
        const nextSibling = nodeWithSelection.parentNode?.nextSibling;
        let wrapperNode = this.createWrapperNode('span', nextSibling );
        wrapperNode = this.rangeStyling.setClass(wrapperNode, style);
        this.reInsertNode(wrapperNode, nodeWithUnderline)
      }
      // this.range.extractContents();
      // parentOfUnderline.removeChild(nodeWithUnderline);
    }

  }
  
 private reInsertNode(node: Node, nodeWithUnderline: Node) {
   const parentOfUnderline = nodeWithUnderline.parentNode!;
  if (nodeWithUnderline.nextSibling) {
    const insertBeforeNode = nodeWithUnderline.nextSibling;
    parentOfUnderline.insertBefore(node, insertBeforeNode);
  } else {
    parentOfUnderline.appendChild(node);
  }
 }

 private getChildNodes(startNode: Node): Node[];
 private getChildNodes(startNode: Node, nodeToCheck: Node): Node[];

 private getChildNodes(startNode: Node, nodeToCheck?: Node): Node[] {
  console.log('%c⧭', 'color: #eeff00', nodeToCheck);
  console.log('%c⧭', 'color: #ffa280', startNode);
  let reachedSelectedNode = true;
  if (nodeToCheck) reachedSelectedNode = false;
  const nodes: Node[] = [];
  startNode.childNodes.forEach(childNode => { 
    if (reachedSelectedNode) {
      nodes.push(childNode)
    }
    if (nodeToCheck) {
      if (childNode.isEqualNode(nodeToCheck)) {
        reachedSelectedNode = true;
      }
    }
  })
  return nodes;
 }


  private getNextSiblings(startNode: Node, wrapperNode: Node ): Node {
    if (!startNode) return wrapperNode;
    wrapperNode.appendChild(startNode);
    if (startNode.nextSibling) return this.getNextSiblings(startNode.nextSibling, wrapperNode);
    return wrapperNode;
  }

  // private rebuildSelection() {
  //   const textContent = this.range.startContainer.textContent!;
  //   const parentNode = this.range.commonAncestorContainer.parentNode!;
  //   const nodeWithUnderline = this.getParentNodeWithUnderline(this.range.commonAncestorContainer)!;
  //   const parentOfUnderline = nodeWithUnderline.parentNode!;
  //   const nodeWithSelection = this.findNodeWithSelection(parentNode, textContent);
  //   if (nodeWithSelection) {

  //   const styles: Style[] = this.rangeStyling.getStylesFromNodeHeirarchy(nodeWithSelection, nodeWithUnderline);
  //   let classNames = this.rangeStyling.getClassesFromNodeHiearchy(nodeWithUnderline, nodeWithUnderline);
  //   this.processHierarchy(nodeWithUnderline, parentOfUnderline, nodeWithSelection, styles, classNames);  

      
  //   }
    // console.log('%c%s', 'color: #733d00', textContent);
    // const fragment = this.range.cloneContents();
    // console.log('%c⧭', 'color: #00bf00', fragment);
    // if (nodeWithSelection){
    //   console.log('%c⧭', 'color: #d90000', nodeWithSelection);
    //   console.log('%c⧭', 'color: #9c66cc', fragment);
    //   let wrapperEnd = this.createWrapperNode('span');
    //   let wrapperStart = this.createWrapperNode('span');
    //   let wrapperFragment = this.createWrapperNode('span');
    //   wrapperFragment.appendChild(fragment);
    //   const className = (parentNode as HTMLElement).className;
    //   const styles: Style[] = this.rangeStyling.getStylesFromNodeHeirarchy(nodeWithSelection, parentNode);
    //   console.log('%c⧭', 'color: #ff6600', styles);

    //   // get the styles going up the tree
    //   (wrapperEnd as HTMLElement).className = className;
    //   (wrapperStart as HTMLElement).className = className;
    //   (wrapperFragment as HTMLElement).className = className.replace('textDecoration underline',''); 
    //   wrapperEnd = this.rangeStyling.setStyles(wrapperEnd, styles);
    //   wrapperStart = this.rangeStyling.setStyles(wrapperStart, styles);
    //   wrapperFragment = this.rangeStyling.setStyles(wrapperFragment, styles);
      
    //   wrapperEnd.textContent = textContent.substring(this.range.endOffset);
    //   wrapperStart.textContent = textContent.substring(0, this.range.startOffset);
    //   let index = 0;
    //   let wrapperNode: Node | null = null;
    //   // // for (const node of parentNode.childNodes) {
    //   // //   console.log('%c⧭', 'color: #cc0036', node);
    //   // //   console.log('%c%s', 'color: #00a3cc', index);
      // //   if (index === nodeWithSelectionindex) {
      // //     pa.insertBefore(wrapperStart, nodeWithUnderline);
      // //     parentOfUnderline.insertBefore(wrapperFragment, nodeWithUnderline);
      // //     parentOfUnderline.insertBefore(wrapperEnd, nodeWithUnderline);
      // //   }
      //   wrapperNode = node.nodeName === '#text' ? this.createWrapperNode('span', node) : node;
      //   (wrapperNode as HTMLElement).className = className;
      //   parentOfUnderline.insertBefore(wrapperNode, nodeWithUnderline);
      //   index++;
      // }
  //     parentOfUnderline.removeChild(nodeWithUnderline);
  // }
    
  processHierarchy(nodeWithUnderline: Node, parentOfUnderline: Node & ParentNode, nodeWithSelection: Node, styles: Style[], classNames: string) {
    const newParent = parentOfUnderline.cloneNode();
    const childOfParentContainingSelection = this.findNodeInHeirarchy(nodeWithSelection, parentOfUnderline);
    const nextSibling = childOfParentContainingSelection.nextSibling;
    let trailingSpan = this.createWrapperNode('span');
    trailingSpan = this.applyStyleAndClasses(trailingSpan, styles, classNames);
    const processedSelection = false;
    parentOfUnderline.childNodes.forEach(childNode => {
      if (childNode.isSameNode(childOfParentContainingSelection)) {
        // process the child hierarchy
        // any nodes before the selection remain as is
        // nodes with the selection are moved up a level
        // nodes post the selection are wrapped with a span
      }
      if (processedSelection) {
        trailingSpan.appendChild(childNode);
      }
    })
    if (nodeWithUnderline.isEqualNode(nodeWithSelection)) {
      const node = this.createWrapperNode('span');
      let wrapperEnd = this.createWrapperNode('span');
      let wrapperStart = this.createWrapperNode('span');
      let wrapperFragment = this.createWrapperNode('span');
      const fragment = this.range.cloneContents();
      wrapperFragment.appendChild(fragment);
      wrapperStart = this.applyStyleAndClasses(wrapperStart, styles, classNames);
      wrapperEnd = this.applyStyleAndClasses(wrapperEnd, styles, classNames);
      wrapperFragment = this.applyStyleAndClasses(wrapperStart, styles, classNames.replace('textDecoration underline',''));
      const textContent = this.range.startContainer.textContent!;
      wrapperEnd.textContent = textContent.substring(this.range.endOffset);
      wrapperStart.textContent = textContent.substring(0, this.range.startOffset);
      node.appendChild(wrapperStart);
      node.appendChild(wrapperFragment);
      node.appendChild(wrapperEnd);

    }
    if (nodeWithUnderline.hasChildNodes()) {
      nodeWithUnderline.childNodes.forEach(childNode => {
        const Node = this.processHierarchy(childNode, parentOfUnderline, nodeWithSelection, styles, classNames);

      })
    }

  }

  findNodeInHeirarchy(node: Node, parentNode: Node): Node {
    if (!parentNode) return node;
    if (node.parentNode) {
      if (node.parentNode.isEqualNode(parentNode)) {
        return node;
      }
      return this.findNodeInHeirarchy(node.parentNode, parentNode); 
    }
    return node;
  }

  applyStyleAndClasses(node: Node, styles: Style[], classNames: string): Node {
    (node as HTMLElement).className = classNames;
    node = this.rangeStyling.setStyles(node, styles);
    return node;
  }


  private findNodeWithSelection(node: Node | null, textContent: string): Node | null {
    if (!node) return node;
    if (node.textContent === textContent) return node;
    if (node.hasChildNodes()) {
      for (const childNode of node.childNodes) {
       const matchednode = this.findNodeWithSelection(childNode, textContent);
       if (matchednode?.textContent === textContent) { 
        console.log('%c⧭', 'color: #00b300', matchednode.textContent);
        
        return matchednode
        
        };
      }
    }
    return node;
  }


  // getSelectedTextContent(node: Node): string {
  //   if (!node) return '';
  //   const textcontent = (node as HTMLElement).textContent;
  //   if (textcontent) {
  //     return textcontent.substring(this.range.startOffset, this.range.endOffset);
  //   }
  //   return '';
  // }

  // getParentStyles(node: Node | null, styles: Style[]): Style[] {
  //   console.log('%c%s', 'color: #00bf00', 'getParentStyles');
  //   if (!node) return styles;
  //   if (node.nodeName === 'P') return styles;
  //   if (node.nodeName === 'SPAN') {
  //     const spanElement = node as HTMLSpanElement;
  //     if (spanElement.style.length > 0) {
  //       for (let index = 0; index < spanElement.style.length; index++) {
  //         const styleElement = spanElement.style[index];
  //         const value = spanElement.style.getPropertyValue(styleElement);
  //         const style: Style = { style: styleElement, value: value };
  //         styles.push(style)
  //       }
  //     }
  //   }
  //   return this.getParentStyles(node.parentNode, styles);
  // }

  // insertCleanedNode(cleanedNode: Node | null, nodeWithSpan: Node | null) {
  //   console.log('%c⧭', 'color: #aa00ff', nodeWithSpan);
  //   console.log('%c⧭', 'color: #00a3cc', cleanedNode);
  //   if (!cleanedNode) return;
  //   if (!nodeWithSpan) return;
  //   const parentNode = this.range.startContainer.parentNode;
  //   let nodeToInsertChildOn: Node | null = null;
  //   let nodeToInsertChildBefore: Node | null = null

  //   if (this.isElementUnderlined.startContent && !this.isElementUnderlined.endContent) {
  //     if (parentNode) {
  //       nodeToInsertChildOn = parentNode.previousSibling ? parentNode.previousSibling : parentNode.parentNode;
  //     }
  //   }
  //   if (this.isElementUnderlined.startContent && this.isElementUnderlined.endContent) {
  //     if (parentNode) {
  //       nodeToInsertChildOn = nodeWithSpan.parentNode ? nodeWithSpan.parentNode : null;
  //       console.log('%c⧭', 'color: #ace2e6', nodeToInsertChildOn);
  //       nodeToInsertChildBefore = nodeWithSpan.nextSibling ? nodeWithSpan.nextSibling : null;
  //       console.log('%c⧭', 'color: #9c66cc', nodeToInsertChildBefore);
  //       const textContent = (this.range.endContainer as HTMLElement).textContent!;
  //       console.log('%c%s', 'color: #00e600', textContent);
  //       cleanedNode.textContent = textContent.substring(this.range.startOffset);
  //       console.log('%c%s', 'color: #ff0000', cleanedNode.textContent);
        
  //     }
  //   }
  //   this.fragment = this.range.extractContents();
  //   if (nodeToInsertChildOn && !nodeToInsertChildBefore) {
  //     nodeToInsertChildOn.appendChild(cleanedNode);
  //   }
  //   if (nodeToInsertChildOn && nodeToInsertChildBefore) {
  //     nodeToInsertChildOn.insertBefore(cleanedNode, nodeToInsertChildBefore);
  //   }
  //   //   if (nextSibling) {
  //   //     console.log('%c⧭', 'color: #40fff2', nextSibling);
  //   //     parentNode?.insertBefore(cleanedNode, nextSibling);
  //   //   } else if (parentNode) {
  //   //     console.log('%c⧭', 'color: #5200cc', parentNode);
  //   //     parentNode.appendChild(cleanedNode)
  //   //   }
  // }
  // isSandWiched(): boolean {
  //   if (this.isElementUnderlined.startContent && this.isElementUnderlined.endContent) {
  //     const textnode = this.range.endContainer as Text;
  //     return textnode.length !== this.range.endOffset;
  //   }
  //   return false;
  // }

  isAllUnderlined(): boolean {
    return this.range.commonAncestorContainer.nodeName !== 'P'
  }
  

  // removeUnderlineClass(node: Node | null): Node | null {
  //   if (!node) return node;
  //   if (node.nodeName !== 'SPAN') return node;
  //   const spanElement = node as HTMLSpanElement;
  //   const textDecoration = spanElement.className.includes('text-decoration') ? 'text-decoration' : 'textDecoration'; 
  //   const className = spanElement.className.replace(`${textDecoration} underline`, '');
  //   if (spanElement.style.length === 0 && className === '') {
  //     return this.replaceEmptySpanWithTextNode(node);
  //   }
  //   spanElement.className = className;
  //   return node;
  // }

  private getParentNodeWithUnderline(node: Node | null): Node | null {
    if (!node) return null;
    if (node.nodeName === 'P') return null;
    if (node.nodeName === 'SPAN') {
      if (this.hasClassUnderline(node) || (node as HTMLSpanElement).innerHTML.includes('underline')) {
        return node;
      }
    }
    return this.getParentNodeWithUnderline(node.parentNode);
  }


  addUnderline(htmlTag: HTMLTags) {
    // five scenarios 
    // nothing underlined
    // start not underlined rest is underlined
    // start is underlined end is not underlined
    // start is underlined middle is not underlined end is underlined
    // start is not underlined middle is underlined end if not underlined
    if (!this.isElementUnderlined.startContent && !this.isElementUnderlined.selectedContent
      && !this.isElementUnderlined.endContent ) {
        this.rangeValues.ancestorHasChildren 
        ? this.createWrapperWithChildren(htmlTag)
        : this.createWrapperNoChildren(htmlTag);
        return;
      }
      if (!this.isElementUnderlined.startContent && this.isElementUnderlined.endContent) {
          const nodeWithUnderline = this.getParentNodeWithUnderline(this.range.endContainer)!;
          const fragment = this.range.extractContents();
          nodeWithUnderline.insertBefore(fragment, nodeWithUnderline.childNodes[0]);
          return;
      }
      if (this.isElementUnderlined.startContent) {
          const nodeWithUnderline = this.getParentNodeWithUnderline(this.range.startContainer)!;
          const fragment = this.range.extractContents();
          nodeWithUnderline.appendChild(fragment);
          return;
      }
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
    this.createNewNodeAsWrapper(htmlTag, this.underline, 'class');
  }

  private createNodeFromFragment(htmlTag: HTMLTags) {
    if(!this.range) throw new Error('Range not set');
    this.fragment = this.range.extractContents();
    const wrapperNode: Node | null = this.fragment ? this.fragment.querySelector('span') : this.createWrapperNode(htmlTag);
    if (wrapperNode) {
      this.rangeStyling.clearExistingClasses(wrapperNode, this.underline);
        this.rangeStyling.setClass(wrapperNode, this.underline);
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
        this.rangeStyling.clearExistingClasses(wrapperNode, this.underline);
        this.rangeStyling.setClass(wrapperNode, this.underline);
        if (fragmentNode) wrapperNode.appendChild(fragmentNode);
        if (this.range) {
          this.range.insertNode(wrapperNode);
        }
      }
    }
}