import { Style } from '@/models/styles/styles';
import { RangeBase } from '../range-base';


export class Underline extends RangeBase {

  constructor(range: Range) {
    super(range);
  }
  
  private underline: Style = {
    style: 'text-decoration',
    value: 'underline',
  };

  add(spanNode: HTMLSpanElement): Node {
    return this.addClass(spanNode, this.underline);
  }

 

}