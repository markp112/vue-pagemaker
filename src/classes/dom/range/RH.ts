import { RangeRow } from './single-row';
import { MultiRow } from './multi-row';
import { HTMLTags, ClassOrStyle } from './range-base';
import { Style } from '@/models/styles/styles';

export class RH  {
  range: Range;
  constructor (range: Range) {
    this.range = range;
  }

  applyStyle(htmlTag: HTMLTags, style: Style, classOrStyle: ClassOrStyle ): void {
    if (!this.range) throw new Error('RH: Range not set');
    if (this.range.commonAncestorContainer.nodeName === 'DIV') {
      const multiRow = new MultiRow(this.range)
      multiRow.process(htmlTag, style, classOrStyle)
    } else {
      const singleRow: RangeRow = new RangeRow(this.range);
      console.log('%c⧭', 'color: #cc0088', classOrStyle);
      console.log('%c⧭', 'color: #1d3f73', style);
      console.log('%c⧭', 'color: #bfffc8', htmlTag);
      console.log('%c⧭', 'color: #735656', singleRow);
      singleRow.process(htmlTag, style, classOrStyle);
    }
  }
}
