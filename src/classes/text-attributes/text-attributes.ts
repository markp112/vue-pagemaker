import { BoxUnits } from '@/models/components/box-dimension';

export type TextStyleTypes =
  | 'background-color'
  | 'color'
  | 'border-color'
  | 'borderEdge'  
  | 'borderStyle'
  | 'borderWidth'
  | 'fontFamily'
  | 'fontSize'
  | 'fontWeight'
  | 'italic'
  | 'shadow'
  | 'underline'
  | 'undefined'

export interface StyleElement {
  styleName: TextStyleTypes;
  value: string;
  units: BoxUnits;
}

export class TextAttributes  {
  private static instance: TextAttributes;
  classOrStyle:  'class' | 'style' | 'undefined' = 'undefined' ;
  italic = false;
  underline = false;
  styleName = '';
  value = '';
  units = '';

  public static getInstance(): TextAttributes {
    if (!TextAttributes.instance) {
      TextAttributes.instance = new TextAttributes();
    }
    return TextAttributes.instance;
  }

  applyStyle(styleElement: StyleElement): void {
    this.styleName = styleElement.styleName;
    this.units = '';
    this.value = styleElement.value;
    this.classOrStyle = 'style';
    switch (styleElement.styleName) {
      case 'fontSize':
        this.units =  styleElement.units;
        break;
      case 'fontWeight':
        this.classOrStyle = 'class';
        break;
      case 'italic':
        this.italic = !this.italic;
        this.value = this.italic ? 'italic' : 'not-italic';
        this.classOrStyle = 'class';
        break
      case 'underline':
        this.underline = !this.underline;
        this.classOrStyle = 'class';
        this.value = this.underline ? 'underline' : 'no-underline'
        break;
    }
  }
}
