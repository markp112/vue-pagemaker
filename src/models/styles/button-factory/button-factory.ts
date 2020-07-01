import { ButtonIconClassList } from '@/models//styles/button-icon/button-icon-class-list/button-icon-class-list'
import { ButtonIconBuilder } from '@/models/styles/builders/class-list-builder';
import { ButtonIconNumericBuilder, ButtonIconNumericBuilderWrapper } from '../builders/button-icon-numeric';
import { ButtonIconNumeric } from '../button-icon/button-numeric-list/button-numeric-list';

export type ButtonReturnTypes =
  | ButtonIconClassList
  | ButtonIconNumeric;

export type ButtonRequestTypes = 
  | 'Shadow'
  | 'border-styles'
  | 'border-direction'
  | 'font-weight'
  | 'font-size'
  | 'border-radius';

export class ButtonFactory {
 
  public createButton(type:'class-list' | 'numeric', whichButton: ButtonRequestTypes): ButtonReturnTypes {

    switch(type) {
      case 'class-list' :
        return this.buildClassList(whichButton);
      case 'numeric' :
        return this.buildNumeric(whichButton);
    }
  }

  private buildClassList(whichButton: ButtonRequestTypes): ButtonIconClassList {
    return new ButtonIconBuilder().build(whichButton);
  }

  private buildNumeric(whichButton: ButtonRequestTypes): ButtonIconNumeric {
      return new ButtonIconNumericBuilderWrapper().build(whichButton);
  }

}
