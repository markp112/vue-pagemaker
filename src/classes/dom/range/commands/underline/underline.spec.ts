import {
  UNDERLINE,
  paragraphWithUnderlineSpanAndNestedPlainSpan,
  paragraphWithUnderlineSpanAndTextnode,
  paragraphWithPlainSpans,
  textEditorSetup
} from '../../rangeStyling/test-builder-classes.spec';
import { Underline } from "./underline";
import { setStartMock, setEndMock, setCommonAncestorMock } from '@/mocks/mocks.ts'
import { assert } from "chai";


describe("underline", () => {
  let range: Range;
  let underline: Underline;

    describe('getNodesInSelectionUnderlineStatus', () => {

      it('Should return both the start and end nodes as underlined if nested within an underline Span', () => {
          const baseNode = paragraphWithUnderlineSpanAndTextnode;
          setStartMock(baseNode.childNodes[0].childNodes[0]);
          setEndMock(baseNode.childNodes[0].childNodes[0]);
          setCommonAncestorMock(baseNode.childNodes[0].childNodes[0]);
          range = document.createRange();
          underline = new Underline(range);
          const underlinedElement = underline.getNodesInSelectionUnderlineStatus();
          assert.isTrue(underlinedElement.startContent);
          assert.isTrue(underlinedElement.endContent);
          assert.isTrue(underlinedElement.selectedContent);
      })

      it('should return all elements as false if nothing is underlined', () => {
          const baseNode = paragraphWithUnderlineSpanAndTextnode;
          setStartMock(baseNode.childNodes[1]);
          setEndMock(baseNode.childNodes[1]);
          setCommonAncestorMock(baseNode.childNodes[1]);
          range = document.createRange();
          underline = new Underline(range);
          const underlinedElement = underline.getNodesInSelectionUnderlineStatus();
          assert.isFalse(underlinedElement.startContent);
          assert.isFalse(underlinedElement.endContent);
          assert.isFalse(underlinedElement.selectedContent);
      })
    })

    describe('isParentUnderlined', () => {
    
      it('should return false if the parent node is not underlined', () => {
        const baseNode = paragraphWithUnderlineSpanAndTextnode;
        setStartMock(baseNode.childNodes[1]);
        setEndMock(baseNode.childNodes[1]);
        setCommonAncestorMock(baseNode.childNodes[1]);
        range = document.createRange();
        underline = new Underline(range);
        const result = underline.isParentUnderlined(range.startContainer);
        assert.isFalse(result);
      })
      it('should return true if the parent node is underlined', () => {
        const baseNode = paragraphWithUnderlineSpanAndTextnode;
        setStartMock(baseNode.childNodes[0].childNodes[0]);
        setEndMock(baseNode.childNodes[0].childNodes[0]);
        setCommonAncestorMock(baseNode.childNodes[0].childNodes[0]);
        range = document.createRange();
        underline = new Underline(range);
        const result = underline.isParentUnderlined(range.startContainer);
        assert.isTrue(result);
      })
    })

})