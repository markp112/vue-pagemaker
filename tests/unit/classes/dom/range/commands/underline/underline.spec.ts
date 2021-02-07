import {
  UNDERLINE,
  DomTestCaseData
} from '../../rangestyling/test-builder-classes';
import { Underline } from "../../../../../../../src/classes/dom/range/commands/underline/underline";
import { setStartMock, setEndMock, setCommonAncestorMock } from '@/mocks/mocks.ts'

describe("underline", () => {
  let range: Range;
  let underline: Underline;
  let domTestCaseData: DomTestCaseData = new DomTestCaseData();

  beforeEach(() => {
    domTestCaseData = new DomTestCaseData();
  })
    describe('getNodesInSelectionUnderlineStatus', () => {

      it('Should return both the start and end nodes as underlined if nested within an underline Span', () => {
          const baseNode = domTestCaseData.paragraphWithUnderlineSpanAndTextnode;
          setStartMock(baseNode.childNodes[0].childNodes[0]);
          setEndMock(baseNode.childNodes[0].childNodes[0]);
          setCommonAncestorMock(baseNode.childNodes[0].childNodes[0]);
          range = document.createRange();
          underline = new Underline(range);
          const underlinedElement = underline.getNodesInSelectionUnderlineStatus();
          expect(underlinedElement.startContent).toBe(true);
          expect(underlinedElement.endContent).toBe(true);
          expect(underlinedElement.selectedContent).toBe(true);
      })

      it('should return all elements as false if nothing is underlined', () => {
          const baseNode = domTestCaseData.paragraphWithUnderlineSpanAndTextnode;
          setStartMock(baseNode.childNodes[1]);
          setEndMock(baseNode.childNodes[1]);
          setCommonAncestorMock(baseNode.childNodes[1]);
          range = document.createRange();
          underline = new Underline(range);
          const underlinedElement = underline.getNodesInSelectionUnderlineStatus();
          expect(underlinedElement.startContent).toBe(false);
          expect(underlinedElement.endContent).toBe(false);
          expect(underlinedElement.selectedContent).toBe(false);
      })
    })

    describe('isParentUnderlined', () => {

      it('should return false if the parent node is not underlined', () => {
        const baseNode = domTestCaseData.paragraphWithUnderlineSpanAndTextnode;
        setStartMock(baseNode.childNodes[1]);
        setEndMock(baseNode.childNodes[1]);
        setCommonAncestorMock(baseNode.childNodes[1]);
        range = document.createRange();
        underline = new Underline(range);
        const result = underline.isParentUnderlined(range.startContainer);
        expect(result).toBeTruthy;
      })
      
      it('should return true if the parent node is underlined', () => {
        const baseNode = domTestCaseData.paragraphWithUnderlineSpanAndTextnode;
        setStartMock(baseNode.childNodes[0].childNodes[0]);
        setEndMock(baseNode.childNodes[0].childNodes[0]);
        setCommonAncestorMock(baseNode.childNodes[0].childNodes[0]);
        range = document.createRange();
        underline = new Underline(range);
        const result = underline.isParentUnderlined(range.startContainer);
        expect(result).toBeTruthy;
      })
    })
})
