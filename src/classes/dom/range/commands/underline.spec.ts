import { RHBase } from "../range-base";
import { RH } from '../RH';
import { Style } from '../../../../models/styles/styles'
import {
  UNDERLINE,
  paragraphWithUnderlineSpanAndNestedPlainSpan,
  paragraphWithUnderlineSpanAndTextnode,
  paragraphWithPlainSpans,
  textEditorSetup
} from '../../range-2/test-builder-classes';
import {JSDOM } from 'jsdom';


describe("class style", () => {
  let rangeBase: RHBase;
  let range: Range;
  let rh: RH;
  const dom = new JSDOM('<!doctype html><html><body><p>some text</p></body></html>')

    beforeEach(() => {
      range = document.createRange();
      console.log('%c⧭', 'color: #ffa280', range);
      rangeBase = new RHBase(range);

    })
    it("should underline text",() => {
      // range = dom.window.document.createRange();
      const startNode = paragraphWithPlainSpans.childNodes[1];
      const endNode = paragraphWithPlainSpans.childNodes[1]
      range.setStart(startNode, 3);
      range.setEnd(endNode, 5);
      rh = new RH(range);
      const style: Style = {style: 'text-decoration', value: UNDERLINE};
      rh.applyStyle('span', style , 'class');
      console.log('%c⧭', 'color: #514080', paragraphWithPlainSpans);
      expect(paragraphWithPlainSpans).toContain('underline');
    })

  })