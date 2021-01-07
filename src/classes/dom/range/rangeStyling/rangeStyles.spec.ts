import { RangeStyles } from './rangeStyles';
import {
  paragraphWithUnderlineSpanAndNestedPlainSpan,
  paragraphWithStyledSpan,
  paragraphWithPlainSpans,
  paragraphWithUnderlineSpanAndNestedUnderlineSpan,
} from '../../range-2/test-builder-classes.spec';
import { Style } from '@/models/styles/styles';

describe("when isStyleTag is called", () => {
    const rangeStyle = new RangeStyles();

  it("should return true if passed 'style'", ()=> {
    const result = rangeStyle.isStyleTag('style');
    expect(result).toBeTruthy();
  })
  
  it("should return false if passed 'class'", ()=> {
    const result = rangeStyle.isStyleTag('class');
    expect(result).toBeFalsy();
  })
})

describe("When setStyleOrClass is called with a style", () => {
  const rangeStyle = new RangeStyles();

  it("It should call setStyle", () => {
      const setStyleSpy = jest.spyOn(rangeStyle, 'setStyle');
      const style: Style = { style: 'font-size', value: '24px' };
      const node: Node = paragraphWithPlainSpans.childNodes[1];
      const node2 = rangeStyle.setStyleOrClass(node, style, 'style');
      expect(setStyleSpy).toHaveBeenCalled();
  })

  it("It should have a style tag set", () => {
      const style: Style = { style: 'font-size', value: '24px' };
      const node: Node = paragraphWithPlainSpans.childNodes[1];
      const node2 = rangeStyle.setStyleOrClass(node, style, 'style');
      expect((node2 as HTMLSpanElement).outerHTML.includes('style="')).toBe(true);
      expect((node2 as HTMLSpanElement).outerHTML.includes('font-size: 24px;')).toBe(true);
  })

  it("It should add a new style to an existing style", () => {
      const style: Style = { style: 'font-size', value: '24px' };
      const node: Node = paragraphWithStyledSpan.childNodes[1];
      const node2 = rangeStyle.setStyleOrClass(node, style, 'style');
      expect((node2 as HTMLSpanElement).outerHTML.includes('style="')).toBe(true);
      expect((node2 as HTMLSpanElement).outerHTML.includes('font-size: 24px;')).toBe(true);
      expect((node2 as HTMLSpanElement).outerHTML.includes('color: red;')).toBe(true);
  })

})

describe("When setStyleOrClass is called with a class", () => {
  const rangeStyle = new RangeStyles();

  it("It should call setClass", () => {
      const setStyleSpy = jest.spyOn(rangeStyle, 'setClass');
      const style: Style = { style: 'text-decoration', value: 'underline' };
      const node: Node = paragraphWithPlainSpans.childNodes[1];
      const node2 = rangeStyle.setStyleOrClass(node, style, 'class');
      expect(setStyleSpy).toHaveBeenCalled();
  })

  it("It should have a class property", () => {
      const style: Style = { style: 'text-decoration', value: 'underline' };
      const node: Node = paragraphWithPlainSpans.childNodes[1];
      const node2 = rangeStyle.setStyleOrClass(node, style, 'class');
      expect((node2 as HTMLSpanElement).outerHTML.includes('class="')).toBe(true);
      expect((node2 as HTMLSpanElement).outerHTML.includes('text-decoration underline')).toBe(true);
  })

  it("It should add a new class to an existing class", () => {
      const style: Style = { style: 'text-decoration', value: 'italic' };
      const node: Node = paragraphWithUnderlineSpanAndNestedPlainSpan.childNodes[0];
      const node2 = rangeStyle.setStyleOrClass(node, style, 'class');
      expect((node2 as HTMLSpanElement).outerHTML.includes('class="')).toBe(true);
      expect((node2 as HTMLSpanElement).outerHTML.includes('underline')).toBe(true);
      expect((node2 as HTMLSpanElement).outerHTML.includes('italic')).toBe(true);
  })

})

describe("When clearExistingClasses is called", () => {
  const rangeStyle = new RangeStyles();

  it("It should clear all class content from the node of that class type", () => {
      const setStyleSpy = jest.spyOn(rangeStyle, 'setClass');
      const style: Style = { style: 'underline', value: '' };
      const node: Node = paragraphWithUnderlineSpanAndNestedPlainSpan.childNodes[0];
      let outerHtml = (node as HTMLSpanElement).outerHTML;
      expect(outerHtml.includes('class="underline"')).toBe(true);
      const node2 = rangeStyle.clearExistingClasses(node, style);
      outerHtml = (node2 as HTMLSpanElement).outerHTML;
      expect(outerHtml.includes('class=""')).toBe(true);
  })

  it("It should clear all class content from the node and child nodes of that class type", () => {
    const setStyleSpy = jest.spyOn(rangeStyle, 'setClass');
    const style: Style = { style: 'underline', value: '' };
    const node: Node = paragraphWithUnderlineSpanAndNestedUnderlineSpan.childNodes[0];
    console.log((node as HTMLSpanElement).innerHTML, node.childNodes.length)
    let childNode: Node = node.childNodes[1];
    let outerHtml = (childNode as HTMLSpanElement).outerHTML;
    expect(outerHtml.includes('class="underline"')).toBe(true);
    const node2 = rangeStyle.clearExistingClasses(node, style);
    outerHtml = (node2 as HTMLSpanElement).outerHTML;
    expect(outerHtml.includes('class=""')).toBe(true);
    childNode = node2.childNodes[1];
    outerHtml = (childNode as HTMLSpanElement).outerHTML;
    expect(outerHtml.includes('class=""')).toBe(true);
  })
})