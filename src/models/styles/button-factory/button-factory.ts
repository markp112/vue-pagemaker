import { ButtonIconClassList } from '@/models/styles/builders/button-icon-class-list';
import { ButtonIconBuilder } from '@/models/styles/builders/class-list-builder';
import { ButtonIconNumericBuilderWrapper } from '../builders/button-icon-numeric';
import { ButtonIconNumeric } from '../button-icon/button-numeric-list/button-numeric-list';
import { ButtonIconClassWrapper } from '../builders/button-icon-class-builder';
import { ButtonIconClassInterface } from '../button-icon/button-icon';
import {
  ButtonIconDimension,
  ButtonIconDimensionBuilder,
} from '../builders/buttonIconDimension';

export type ButtonReturnTypes =
  | ButtonIconClassList
  | ButtonIconNumeric
  | ButtonIconClassInterface
  | ButtonIconDimension;

export type ButtonRequestTypes =
  | 'Shadow'
  | 'border-styles'
  | 'border-direction'
  | 'fontWeight'
  | 'fontSize'
  | 'italic-button'
  | 'underline-button'
  | 'border-radius'
  | 'border-thickness';

export type ClassOfButton =
  | 'class-list'
  | 'numeric'
  | 'class'
  | 'dimension';

export class ButtonFactory {
  public createButton(type: ClassOfButton, whichButton: ButtonRequestTypes): ButtonReturnTypes {
    switch (type) {
      case 'class-list':
        return this.buildClassList(whichButton);
      case 'numeric':
        return this.buildNumeric(whichButton);
      case 'class':
        return this.buildClass(whichButton);
      case 'dimension':
        return this.buildDimension();
    }
  }

  private buildClassList(whichButton: ButtonRequestTypes): ButtonIconClassList {
    return new ButtonIconBuilder().build(whichButton);
  }

  private buildNumeric(whichButton: ButtonRequestTypes): ButtonIconNumeric {
    return new ButtonIconNumericBuilderWrapper().build(whichButton);
  }

  private buildClass(whichButton: ButtonRequestTypes): ButtonIconClassInterface {
    return new ButtonIconClassWrapper().build(whichButton);
  }

  private buildDimension(): ButtonIconDimension {
    return new ButtonIconDimensionBuilder()
      .withComponentName('plus-minus')
      .withDimension(0, 'px')
      .withIconImage('thickness-32.png')
      .withToolTip('border thickness')
      .withStyle('borderWidth', '')
      .build();
  }
}
