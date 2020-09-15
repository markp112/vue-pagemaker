import { Style } from '@/models/styles/styles';
import { RangeBase } from "./range-base";
import { RangeStyle } from './range-style';
import {
  UNDERLINE,
  paragraphWithUnderlineSpanAndNestedPlainSpan,
  paragraphWithUnderlineSpanAndTextnode,
  textEditorSetup
} from './test-builder-classes';



describe("class style", () => {
  let rangeBase: RangeBase;
  let range: Range;
  let rangeStyle: RangeStyle;
  beforeEach(() => {
   document.body.appendChild(textEditorSetup);
   rangeStyle = new RangeStyle(range);
  })

  describe("applyStyle", () => {
    it("should given a node apply the style to the node", () => {
      let node = textEditorSetup.childNodes[0].childNodes[0];
      const style: Style = {style: 'fontSize', value: '16px'};
      const element = (rangeStyle.applyStyle(node, style) as HTMLElement);
      expect(element.style.fontSize).toEqual('16px')
    })

  })

  describe("removeStyleFromANode", () => {
    it("should given a node remove the style from that node", () => {
      let node = textEditorSetup.childNodes[0].childNodes[0];
      const style: Style = {style: 'fontSize', value: '16px'};
      node = (rangeStyle.applyStyle(node, style) as ChildNode);
      expect((node as HTMLElement).style.fontSize).toEqual('16px');
      const element = rangeStyle.removeStyleFromANode(node, style) as HTMLElement;
      expect(element.style.fontSize).toEqual('')
    })

  })

  describe("removeStyleFromChildNodes", () => {

    it("should given a Node remove the style from the Node and all its children", () => {
      // logDOM(textEditorSetup as HTMLElement)
      let node = textEditorSetup.childNodes[0].childNodes[0];
      const style: Style = { style: 'fontSize', value: '16px' };
      node = (rangeStyle.applyStyle(node, style) as ChildNode);
      const childNode = node.childNodes[1];
      rangeStyle.applyStyle(childNode, style);
      const childElement = childNode as HTMLElement;
      expect(childElement.style.fontSize).toEqual('16px');
      rangeStyle.removeStyleFromChildNodes(node, style);
      const parentElement = node as HTMLElement;
      expect(parentElement.style.fontSize).toEqual('');
      expect(childElement.style.fontSize).toEqual('');
    })
  })

})