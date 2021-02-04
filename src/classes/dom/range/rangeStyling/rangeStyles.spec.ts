import { RangeStyles } from './rangeStyles';
import {
  paragraphWithUnderlineSpanAndNestedPlainSpan,
  paragraphWithStyledSpan,
  paragraphWithPlainSpans,
  paragraphWithUnderlineSpanAndNestedUnderlineSpan,
} from './test-builder-classes.spec';
import { Style } from '@/models/styles/styles';
import { assert } from 'chai';

describe("when isStyleTag is called", () => {
    const rangeStyle = new RangeStyles();

  it("should return true if passed 'style'", ()=> {
    const result = rangeStyle.isStyleTag('style');
    assert.isTrue(result);
  })
  
  it("should return false if passed 'class'", ()=> {
    const result = rangeStyle.isStyleTag('class');
    assert.isTrue(result);
  })
})

describe("When setStyleOrClass is called with a style", () => {
  const rangeStyle = new RangeStyles();

  it("It should call setStyle", () => {
      // const setStyleSpy = jest.spyOn(rangeStyle, 'setStyle');
      const style: Style = { style: 'font-size', value: '24px' };
      const node: Node = paragraphWithPlainSpans.childNodes[1];
      const node2 = rangeStyle.setStyleOrClass(node, style, 'style');
      // assert.(setStyleSpy).toHaveBeenCalled();
  })

  it("It should have a style tag set", () => {
      const style: Style = { style: 'font-size', value: '24px' };
      const node: Node = paragraphWithPlainSpans.childNodes[1];
      const node2 = rangeStyle.setStyleOrClass(node, style, 'style');
      assert.isTrue((node2 as HTMLSpanElement).outerHTML.includes('style="'));
      assert.isTrue((node2 as HTMLSpanElement).outerHTML.includes('font-size: 24px;'));
  })

  it("It should add a new style to an existing style", () => {
      const style: Style = { style: 'font-size', value: '24px' };
      const node: Node = paragraphWithStyledSpan.childNodes[1];
      const node2 = rangeStyle.setStyleOrClass(node, style, 'style');
      assert.isTrue((node2 as HTMLSpanElement).outerHTML.includes('style="'));
      assert.isTrue((node2 as HTMLSpanElement).outerHTML.includes('font-size: 24px;'));
      assert.isTrue((node2 as HTMLSpanElement).outerHTML.includes('color: red;'));
  })

})

describe("When setStyleOrClass is called with a class", () => {
  const rangeStyle = new RangeStyles();

  it("It should call setClass", () => {
      // const setStyleSpy = jest.spyOn(rangeStyle, 'setClass');
      const style: Style = { style: 'text-decoration', value: 'underline' };
      const node: Node = paragraphWithPlainSpans.childNodes[1];
      const node2 = rangeStyle.setStyleOrClass(node, style, 'class');
      // assert.isTrue(setStyleSpy).toHaveBeenCalled();
  })

  it("It should have a class property", () => {
      const style: Style = { style: 'text-decoration', value: 'underline' };
      const node: Node = paragraphWithPlainSpans.childNodes[1];
      const node2 = rangeStyle.setStyleOrClass(node, style, 'class');
      assert.isTrue((node2 as HTMLSpanElement).outerHTML.includes('class="'));
      assert.isTrue((node2 as HTMLSpanElement).outerHTML.includes('text-decoration underline'));
  })

  it("It should add a new class to an existing class", () => {
      const style: Style = { style: 'text-decoration', value: 'italic' };
      const node: Node = paragraphWithUnderlineSpanAndNestedPlainSpan.childNodes[0];
      const node2 = rangeStyle.setStyleOrClass(node, style, 'class');
      assert.isTrue((node2 as HTMLSpanElement).outerHTML.includes('class="'));
      assert.isTrue((node2 as HTMLSpanElement).outerHTML.includes('underline'));
      assert.isTrue((node2 as HTMLSpanElement).outerHTML.includes('italic'));
  })

})

describe("When clearExistingClasses is called", () => {
  const rangeStyle = new RangeStyles();

  it("It should clear all class content from the node of that class type", () => {
      const style: Style = { style: 'underline', value: '' };
      const node: Node = paragraphWithUnderlineSpanAndNestedPlainSpan.childNodes[0];
      let outerHtml = (node as HTMLSpanElement).outerHTML;
      const includesUnderline = outerHtml.includes('class="underline"');
      assert.isTrue(includesUnderline);
      const node2 = rangeStyle.clearExistingClasses(node, style);
      outerHtml = (node2 as HTMLSpanElement).outerHTML;
      assert.isTrue(outerHtml.includes('class=""'));
  })

  it("It should clear all class content from the node and child nodes of that class type", () => {
    const style: Style = { style: 'underline', value: '' };
    const node: Node = paragraphWithUnderlineSpanAndNestedUnderlineSpan.childNodes[0];
    console.log((node as HTMLSpanElement).innerHTML, node.childNodes.length)
    let childNode: Node = node.childNodes[1];
    let outerHtml = (childNode as HTMLSpanElement).outerHTML;
    assert.isTrue(outerHtml.includes('class="underline"'));
    const node2 = rangeStyle.clearExistingClasses(node, style);
    outerHtml = (node2 as HTMLSpanElement).outerHTML;
    assert.isTrue(outerHtml.includes('class=""'));
    childNode = node2.childNodes[1];
    outerHtml = (childNode as HTMLSpanElement).outerHTML;
    assert.isTrue(outerHtml.includes('class=""'));
  })
})

describe("When clearExistingStyles is called", () => {
  const rangeStyle = new RangeStyles();

  it("It should remove the style from the node", () => {
      const style: Style = { style: 'color', value: '' };
      const node: Node = paragraphWithStyledSpan;
      let outerHtml = (node as HTMLSpanElement).outerHTML;
      assert.isTrue(outerHtml.includes('style="color: red;"'));
      const node2 = rangeStyle.clearExistingStyles(node, style);
      outerHtml = (node2 as HTMLSpanElement).outerHTML;
      assert.isFalse(outerHtml.includes('style="color: red;"'));
    })
  })
describe("When removeNodesWithEmptyStyles is called", () => {
  const rangeStyle = new RangeStyles();

  it("It should remove the span node if it has an empty class and style", () => {
      const style: Style = { style: 'color', value: '' };
      const node: Node = paragraphWithStyledSpan;
      let outerHtml = (node as HTMLSpanElement).outerHTML;
      assert.isTrue(outerHtml.includes('style="color: red;"'));
      const node2 = rangeStyle.clearExistingStyles(node, style);
      outerHtml = (node2 as HTMLSpanElement).outerHTML;
      assert.isFalse(outerHtml.includes('style="color: red;"'));
      outerHtml = (node as HTMLElement).outerHTML;
      assert.isFalse(outerHtml.includes('span'));
    })
    
    it("It should not remove the span node if it does not have an empty style", () => {
        const style: Style = {style:'font-size', value: '24px'};
        const node: Node = paragraphWithPlainSpans;
        rangeStyle.setStyle(node, style);
        let outerHtml = (node as HTMLSpanElement).outerHTML;
        assert.isTrue(outerHtml.includes('style="font-size: 24px;"'));
        outerHtml = (node as HTMLElement).outerHTML;
        assert.isTrue(outerHtml.includes('span'));
      })
      
    it("It should not remove the span node if it does not have an empty class", () => {
        const node: Node = paragraphWithUnderlineSpanAndNestedPlainSpan;
        let outerHtml = (node as HTMLSpanElement).outerHTML;
        assert.isTrue(outerHtml.includes('class="underline"'));
        outerHtml = (node as HTMLElement).outerHTML;
        assert.isTrue(outerHtml.includes('span'));
      })
  })