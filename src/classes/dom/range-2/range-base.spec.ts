import { RangeBase } from './range-base';
import { ClassOrStyle } from '../range/range-base';
import {
  UNDERLINE,
  paragraphWithUnderlineSpanAndNestedPlainSpan,
  paragraphWithUnderlineSpanAndTextnode,
  textEditorSetup
} from './test-builder-classes';


describe("findParentNodeWithClass", () => {

let rangeBase: RangeBase;

  beforeEach(() => {
    const range = document.createRange();
    rangeBase = new RangeBase(range);
  })
  
it("should return the null when the class cannot be found in the parent hierarchy", () => {
    const startNode = paragraphWithUnderlineSpanAndNestedPlainSpan.childNodes[1]
    let node = rangeBase.findParentNodeWithClass(startNode, UNDERLINE);
    expect(node).toBeNull();
    node = rangeBase.findParentNodeWithClass(paragraphWithUnderlineSpanAndTextnode.childNodes[1], UNDERLINE);
    expect(node).toBeNull();
  }) 

  it("should return the node with the class, when called from a child node of a child", () => {
    const startNode = paragraphWithUnderlineSpanAndNestedPlainSpan.childNodes[0].childNodes[0];
    const node = rangeBase.findParentNodeWithClass(startNode, UNDERLINE);
    expect((node as HTMLSpanElement).className).toContain(UNDERLINE);
    const underlineNode = paragraphWithUnderlineSpanAndNestedPlainSpan.childNodes[0] as HTMLSpanElement;
    expect((node as HTMLSpanElement).id).toEqual(underlineNode.id)
  })

  it("should return this node, when this node contains the class being searched for", () => {
    const startNode = paragraphWithUnderlineSpanAndNestedPlainSpan.childNodes[0];
    const node = rangeBase.findParentNodeWithClass(startNode, UNDERLINE);
    expect((node as HTMLSpanElement).className).toContain(UNDERLINE);
    const underlineNode = paragraphWithUnderlineSpanAndNestedPlainSpan.childNodes[0] as HTMLSpanElement;
    expect((node as HTMLSpanElement).id).toEqual(underlineNode.id)
  })
})

describe('isSelectedRangeASingleParagraph', () => {
  let rangeBase: RangeBase;
  let range: Range;
  beforeEach(() => {
   document.body.appendChild(textEditorSetup);
   rangeBase = new RangeBase(range);
  })
  it("should return true when a range selection is within a single paragraph", () => {
     
      if (textEditorSetup.parentNode) {
        let node = textEditorSetup.parentNode.childNodes[0].childNodes[0];
        if (node) {
          const isSingleLine = rangeBase.isSelectedRangeASingleParagraph(node);
          expect(isSingleLine).toBeTruthy();
        }
        node =  textEditorSetup.parentNode.childNodes[0].childNodes[0].childNodes[0];
        const isSingleLine = rangeBase.isSelectedRangeASingleParagraph(node);
        expect(isSingleLine).toBeTruthy();
      }
  })
  // multiple paragraphs will have the common ancestor as the div
  it("should return false when a range selection is multiple paragraphs", () => {
    if (textEditorSetup.parentNode) {
      const ancestorNode = textEditorSetup.parentNode.childNodes[0];
      const id = (ancestorNode as HTMLElement).id;
      const isSingleLine = rangeBase.isSelectedRangeASingleParagraph(ancestorNode);
      expect(isSingleLine).toBeFalsy();
    }
  })
})

describe("isStyleTag", () => {
  let rangeBase: RangeBase;
  let range: Range;

  beforeEach(() => {
    rangeBase = new RangeBase(range);
  }) 

  it("should return true when classorStyle equals style", () => {
      const style: ClassOrStyle = 'style';
      const isStyle = rangeBase.isStyleTag(style);
      expect(isStyle).toBeTruthy();
  }) 
})