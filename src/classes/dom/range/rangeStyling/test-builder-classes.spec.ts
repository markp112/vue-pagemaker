import { Style } from '@/models/styles/styles';
import Guid from '@/utils/guid';

export type nodeTypes = 'span' | 'p' | 'div' ;

export class TestHtmlElement {
  parentNode: Node;

  constructor(htmlBuilder: HTMLBuilder) {
    this.parentNode = htmlBuilder.parentNode;
  }

  getParentNode(): Node {
    return this.parentNode;
  }

}

export class HTMLBuilder {
  parentNode: Node = document.createElement('p');
  
  withAParentNodeOfType(type: nodeTypes) {
    this.parentNode = document.createElement(type);
    (this.parentNode as HTMLElement).id = Guid.newSmallGuid();
    return this;
  }

  withAChildNodeOfTypeAndClassOf(type: nodeTypes, className: string, content: string = '') {
    const childNode = document.createElement(type);
    childNode.className = className;
    if (content) childNode.textContent = content;
    this.parentNode.appendChild(childNode);
    return this;
  }

  withAChildNodeOfType(type: nodeTypes, content: string = '') {
    const childNode = document.createElement(type);
    if (content) childNode.textContent = content;
    this.parentNode.appendChild(childNode);
    return this;
  }

  withAStyledSpanNode(type: nodeTypes, content: string = '', style: Style) {
    const childNode = document.createElement(type);
    childNode.style.setProperty(style.style, style.value);
    if (content) childNode.textContent = content;
    this.parentNode.appendChild(childNode);
    return this;
  }

  withATextNodeContaining(content: string) {
    const textNode = document.createTextNode(content);
    this.parentNode.appendChild(textNode);
    return this;
  }

  withAChildOfAChild(type: nodeTypes, content: string, n: number) {
    const childNode = document.createElement(type);
    if (content) childNode.textContent = content;
    this.parentNode.childNodes[n].appendChild(childNode);
    return this;
  }

  withAChildOfNodeNAndClassOf(type: nodeTypes, n: number, className: string, content: string ='') {
    const childNode = document.createElement(type);
    childNode.className = className;
    if (content) childNode.textContent = content;
    this.parentNode.childNodes[n].appendChild(childNode);
    return this;
  }

  withAChildofAChildAndClassOf(
    type: nodeTypes,
    firstChild: number,
    secondChild: number,
    className: string,
    content: string = '') {
    
    const childNode = document.createElement(type);
    childNode.id = Guid.newSmallGuid();
    childNode.className = className;
    if (content) childNode.textContent = content;
    const parentNode =this.parentNode.childNodes[firstChild];
    parentNode.childNodes[secondChild].appendChild(childNode);
    return this;
  }

  build() {
    return new TestHtmlElement(this);
  }
}


export const testElements = {
  plainText: `this is some plain text`,
  someMoreText: `this is some more text`,
  underlinedText: `this is underlined`,
}

export const UNDERLINE = 'underline'
// builds to mirror the textEditor which starts with a div
  // Div 
  //   P 
  //     span 
  //       span
  //     span
  //   P
  //     span
  export const textEditorSetup = new HTMLBuilder()
    .withAParentNodeOfType('div')
    .withAChildNodeOfType('p')
    .withAChildOfNodeNAndClassOf('span', 0, UNDERLINE, UNDERLINE)
    .withAChildofAChildAndClassOf('span', 0, 0, 'italic', 'this is italic')
    .withAChildOfAChild('span', testElements.plainText, 0)
    .withAChildNodeOfType('p')
    .withAChildOfAChild('span', testElements.plainText, 1)
    .build().getParentNode();

  export const paragraphWithUnderlineSpanAndTextnode = new HTMLBuilder()
    .withAParentNodeOfType('p')
    .withAChildNodeOfTypeAndClassOf('span', UNDERLINE, testElements.underlinedText)
    .withATextNodeContaining(testElements.plainText)
    .build()
    .getParentNode();

  export const paragraphWithUnderlineSpanAndNestedPlainSpan = new HTMLBuilder()
    .withAParentNodeOfType('p')
    .withAChildNodeOfTypeAndClassOf('span', UNDERLINE, testElements.underlinedText)
    .withAChildNodeOfType('span',"this is not underlined")
    .withAChildOfAChild('span','A child of child node 0', 0)
    .withAChildNodeOfTypeAndClassOf('span', UNDERLINE, 'end of the underline')
    .build()
    .getParentNode();
    
    export const paragraphWithUnderlineSpanAndNestedUnderlineSpan = new HTMLBuilder()
      .withAParentNodeOfType('p')
      .withAChildNodeOfTypeAndClassOf('span', UNDERLINE, testElements.underlinedText)
      .withAChildNodeOfType('span',"this is not underlined")
      .withAChildOfNodeNAndClassOf('span', 0, 'underline', "some more text that is underlined")
      .withAChildOfAChild('span','A child of child node 0', 0)
      .withAChildNodeOfTypeAndClassOf('span', UNDERLINE, 'end of the underline')
      .build()
      .getParentNode();

  export const paragraphWithPlainSpans = new HTMLBuilder()
    .withAParentNodeOfType('p')
    .withATextNodeContaining("this is not underlined")
    .withAChildNodeOfType('span',"this is also not underlined")
    .build()
    .getParentNode();

  export const paragraphWithStyledSpan = new HTMLBuilder()
    .withAParentNodeOfType('p')
    .withATextNodeContaining("this is not underlined")
    .withAStyledSpanNode('span',"this is also not underlined", {style: 'color', value:'red'})
    .build()
    .getParentNode();
