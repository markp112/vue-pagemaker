import { Style } from '@/models/styles/styles';
import { RHBase, HTMLTags, ClassOrStyle } from './range-base';

export class MultiRow extends RHBase {
  private fragment: DocumentFragment | null = null;
  private nodeList: Node[] = [];

  constructor(range: Range) {
    super(range);
  }

  process(htmlTag: HTMLTags, style: Style, classorStyle: ClassOrStyle): void {
    if (!this.range) throw new Error('RH: Range not set');
    this.processMultiRowSelection(htmlTag, style, classorStyle);
    this.reInsertNodes();
  }

 private processMultiRowSelection(htmlTag: HTMLTags, style: Style, classorStyle: ClassOrStyle): void {
    if (!this.rangeValues) { throw new Error('RH: range values not set')};
    this.fragment = this.range.extractContents();
    this.clearStylingFromExistingSpans(style, classorStyle);
    const node: ParentNode = this.fragment as ParentNode;
    this.nodeList = [];
    if (node.childElementCount === 0){ return };

    const countOfChildNodes = node.childElementCount - 1;
    for (let index = 0; index <= countOfChildNodes; index++) {
      const childNode = node.children[index];
      if (childNode === node.firstElementChild) {
        this.extractTextFragmentToSpan(childNode, style, classorStyle);
        continue;
      }
      if (childNode === node.lastElementChild && this.rangeValues.endContainerNodeType === 'text') {
        this.extractTextFragmentToSpan(childNode, style, classorStyle);
        continue;
      }
      const nodeType: HTMLTags = this.getNodeType(childNode)
      if (nodeType === 'p') {
        this.insertSpanInPara(childNode, style, classorStyle);
        // this.extractTextFragmentToSpan(childNode, style);
        continue;
      }
      if (nodeType === 'text') {
        this.wrapTextNode(childNode, style, classorStyle);
        continue;
      }
    }
}

  reInsertNodes() {
    const nodeCount = this.nodeList.length - 1;
    let middleNodeOrder = nodeCount - 1;
    this.nodeList.forEach((node, index) => { 
      if (index === 0 ) {
        if (this.rangeValues.startContainerParent) {
          this.rangeValues.startContainerParent.appendChild(node);
        }
      } else if (index === nodeCount) {
        if (this.rangeValues.endContainerParent) {
          this.rangeValues.endContainerParent.insertBefore(node, this.rangeValues.endContainerParent.childNodes[0]);
        }
      }
      else {
        const nodeToInsert = this.nodeList[middleNodeOrder];
        this.range.insertNode(nodeToInsert);
        middleNodeOrder--;
      }
    })
  }

  clearStylingFromExistingSpans(style: Style, ClassOrStyle: ClassOrStyle): void {
    if (!this.fragment) { throw new Error("fragment not set") }
    const spanList: NodeList = this.fragment?.querySelectorAll('span');
    if (this.isStyleTag(ClassOrStyle)) {
      spanList.forEach(span => this.clearExistingStyles(span, style))
    } else {
      spanList.forEach(span => this.clearExistingClasses(span, style))
    }
  }

  insertSpanInPara(node: Node, style: Style, classOrStyle: ClassOrStyle): void {
    const spanNode = this.createWrapperNode('span');
    this.setStyleOrClass(spanNode, style, classOrStyle);
    (spanNode as HTMLSpanElement).innerHTML = (node as HTMLElement).innerHTML;
    (node as HTMLElement).innerHTML ='';
    node.childNodes.forEach(node => node.remove);
    node.appendChild(spanNode);
    this.nodeList.push(node);
  }

  extractTextFragmentToSpan(node: Node, style: Style, classOrStyle: ClassOrStyle) {
    const spanNode = this.createWrapperNode('span');
    this.setStyleOrClass(spanNode, style, classOrStyle);
    (spanNode as HTMLSpanElement).innerHTML = (node as HTMLElement).innerHTML;
    this.nodeList.push(spanNode);
  }

  wrapTextNode(node: Node, style: Style, classOrStyle: ClassOrStyle) {
    const spanNode = this.createWrapperNode('span');
    this.setStyleOrClass(spanNode, style, classOrStyle);
    spanNode.appendChild(node);
    this.nodeList.push(spanNode);
  }
  
}


