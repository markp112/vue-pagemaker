import { BoxUnits } from '@/models/components/box-dimension';

export type TextStyleTypes =
  | 'background-color'
  | 'color'
  | 'border-color'
  | 'borderEdge'  
  | 'border-radius'
  | 'borderStyle'
  | 'borderWidth'
  | 'fontFamily'
  | 'fontSize'
  | 'fontWeight'
  | 'italic'
  | 'not-italic'
  | 'shadow'
  | 'underline'
  | 'no-underline'
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
    console.log('%c⧭', 'color: #917399', styleElement);
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
        this.classOrStyle = 'class';
        break
      case 'not-italic':
        this.classOrStyle = 'class';
        break
      case 'underline':
        this.classOrStyle = 'class';
        break;
      case 'no-underline':
        this.classOrStyle = 'class';
        break;
    }
  }
}
