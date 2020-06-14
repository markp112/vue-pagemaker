import { Style } from '@/models/styles/styles';
import { RHBase, HTMLTags } from './range-base';

export class MultiRow extends RHBase {
  private fragment: DocumentFragment | null = null;
  private nodeList: Node[] = [];

  constructor(range: Range) {
    super(range);
  }

  process(htmlTag: HTMLTags, style: Style): void {
    if (!this.range) throw new Error('RH: Range not set');
    this.processMultiRowSelection(htmlTag, style);
    this.reInsertNodes();
  }

 private processMultiRowSelection(htmlTag: HTMLTags, style: Style): void {
    if (!this.rangeValues) { throw new Error('RH: range values not set')};
    this.fragment = this.range.extractContents();
    this.clearStyleFromExistingSpans(style);
    const node: ParentNode = this.fragment as ParentNode;
    this.nodeList = [];
    if (node.childElementCount === 0){ return };

    const countOfChildNodes = node.childElementCount - 1;
    for (let index = 0; index <= countOfChildNodes; index++) {
      const childNode = node.children[index];
      if (childNode === node.firstElementChild) {
        this.extractTextFragmentToSpan(childNode, style);
        continue;
      }
      if (childNode === node.lastElementChild && this.rangeValues.endContainerNodeType === 'text') {
        this.extractTextFragmentToSpan(childNode, style);
        continue;
      }
      const nodeType: HTMLTags = this.getNodeType(childNode)
      if (nodeType === 'p') {
        this.insertSpanInPara(childNode, style);
        // this.extractTextFragmentToSpan(childNode, style);
        continue;
      }
      if (nodeType === 'text') {
        this.wrapTextNode(childNode, style);
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

  clearStyleFromExistingSpans(style: Style): void {
    if (!this.fragment) { throw new Error("fragment not set") }
    const spanList: NodeList = this.fragment?.querySelectorAll('span');
    spanList.forEach(span => this.clearExistingStyles(span, style))
  }

  insertSpanInPara(node: Node, style: Style): void {
    console.log('%c⧭', 'color: #607339', 'insertSpanInPara', node.childNodes);
    const spanNode = this.createWrapperNode('span');
    this.setStyle(spanNode, style);
    (spanNode as HTMLSpanElement).innerHTML = (node as HTMLElement).innerHTML;
    (node as HTMLElement).innerHTML ='';
    node.childNodes.forEach(node => node.remove);
    node.appendChild(spanNode);
    this.nodeList.push(node);
  
  }

  extractTextFragmentToSpan(node: Node, style: Style) {
    const spanNode = this.createWrapperNode('span');
    this.setStyle(spanNode, style);
    (spanNode as HTMLSpanElement).innerHTML = (node as HTMLElement).innerHTML;
    this.nodeList.push(spanNode);
  }

  wrapTextNode(node: Node, style: Style) {
    const spanNode = this.createWrapperNode('span');
    this.setStyle(spanNode, style);
    spanNode.appendChild(node);
    this.nodeList.push(spanNode);
  }
  
}


