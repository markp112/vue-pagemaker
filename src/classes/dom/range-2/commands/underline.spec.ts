import { Underline } from './underline';
import { shallowMount } from "@vue/test-utils";
import Guid from '../../../../utils/guid';

type nodeTypes = 'span' | 'p';
const guid  = new Guid();

class TestHtmlElement {
  parentNode: Node;

  constructor(htmlBuilder: HTMLBuilder) {
    this.parentNode = htmlBuilder.parentNode;
  }

  getParentNode(): Node {
    return this.parentNode;
  }

}

class HTMLBuilder {
  parentNode: Node = document.createElement('p');
  
  withAParentNodeOfType(type: nodeTypes) {
    this.parentNode = document.createElement(type);
    return this;
  }

  withAChildNodeOfTypeAndClassOf(type: nodeTypes, className: string, content: string = '') {
    const childNode = document.createElement(type);
    childNode.id = Guid.newSmallGuid();
    childNode.className = className;
    if (content) childNode.textContent = content;
    this.parentNode.appendChild(childNode);
    return this;
  }

  withAChildNodeOfType(type: nodeTypes, content: string = '') {
    const childNode = document.createElement(type);
    childNode.id = Guid.newSmallGuid();
    if (content) childNode.textContent = content;
    this.parentNode.appendChild(childNode);
    return this;
  }

  withATextNodeContaining(content: string) {
    const textNode = document.createTextNode(content);
    this.parentNode.appendChild(textNode);
    return this;
  }

  withAChildOfChildN(type: nodeTypes, content: string, n: number) {
    const childNode = document.createElement(type);
    childNode.id = Guid.newSmallGuid();
    if (content) childNode.textContent = content;
    this.parentNode.childNodes[n].appendChild(childNode);
    return this;
  }

  build() {
    return new TestHtmlElement(this);
  }
}


const testElements = {
  plainText: `this is some plain text`,
  someMoreText: `this is some more text`,
  underlinedText: `this is underlined`,
}



describe("Underline Class", () => {
  let underline: Underline;

  beforeEach(() => {
  
    const range = document.createRange();
    underline = new Underline(range);
  })

  test("When add is called it should return a span node with a css class text-decoration and underline present", () => {
    const spanNode = document.createElement('span');
    const underlinedNode: Node = underline.add(spanNode);
    const element: HTMLSpanElement = underlinedNode as HTMLSpanElement;
    expect(element.className.includes('text-decoration')).toBeTruthy();
    expect(element.className.includes('underline')).toBeTruthy();
  })

  describe("findNodeWithUnderline", () => {
    
    const paragraphWithUnderlineSpanAndTextnode = new HTMLBuilder()
    .withAParentNodeOfType('p')
    .withAChildNodeOfTypeAndClassOf('span','underline', testElements.underlinedText)
    .withATextNodeContaining(testElements.plainText)
    .build()
    .getParentNode();

    const paragraphWithUnderlineSpanAndNestedPlainSpan = new HTMLBuilder()
    .withAParentNodeOfType('p')
    .withAChildNodeOfTypeAndClassOf('span','underline', testElements.underlinedText)
    .withAChildNodeOfType('span',"this is not underlined")
    .withAChildOfChildN('span','A child of child node 0', 0)
    .withAChildNodeOfTypeAndClassOf('span','underline', 'end of the underline')
    .build()
    .getParentNode();
    
    it("should return the node with the underline class, when called with a node with no underline class", () => {
        const node = underline.findNodeWithUnderlineClass(paragraphWithUnderlineSpanAndTextnode.childNodes[1]);
        expect((node as HTMLSpanElement).textContent).toEqual(testElements.underlinedText);
      }) 

  it("should return the node with the underline class, when called from a nested child", () => {
      const startNode = paragraphWithUnderlineSpanAndNestedPlainSpan.childNodes[1]
      const node = underline.findNodeWithUnderlineClass(startNode);
      expect((node as HTMLSpanElement).className).toContain('underline');
      const underlineNode = paragraphWithUnderlineSpanAndNestedPlainSpan.childNodes[0] as HTMLSpanElement;
      expect((node as HTMLSpanElement).id).toEqual(underlineNode.id)
    }) 

    it("should return the node with the underline, when called from a child node of a child", () => {
      const startNode = paragraphWithUnderlineSpanAndNestedPlainSpan.childNodes[0].childNodes[0];
      const node = underline.findNodeWithUnderlineClass(startNode);
      expect((node as HTMLSpanElement).className).toContain('underline');
      const underlineNode = paragraphWithUnderlineSpanAndNestedPlainSpan.childNodes[0] as HTMLSpanElement;
      expect((node as HTMLSpanElement).id).toEqual(underlineNode.id)
    })
  })


})




