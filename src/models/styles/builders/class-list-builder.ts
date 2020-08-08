import { ButtonRequestTypes } from '@/models/styles/button-factory/button-factory';
import {
  ButtonIconClassList,
  ButtonIconClassListBuilder,
} from '@/models/styles/builders/button-icon-class-list';
import {
  shadowIconList,
  borderEdgeIconList,
  lineStyleIconList,
  fontWeightIconList,
  IconPickerInterface,
} from '@/models/components/icon-picker-models';
import { ButtonIconClassInterface } from '../button-icon/button-icon';
import { ButtonIconClassBuilder } from './button-icon-class-builder';
import { StyleTypes } from '@/classes/text-attributes/text-attributes';
import { ImpactedAttributeTypes } from '@/classes/sidebarButtonEventManager/sidebarButtonEventManager';

export class ButtonIconBuilder {
  build(whichButton: ButtonRequestTypes): ButtonIconClassList {
    switch (whichButton) {
      case 'Shadow':
        return this.buildIconList(
          'shadow',
          'shadow',
          shadowIconList,
          'shadows',
          'shadows-32.png'
        );
      case 'border-direction':
        return this.buildIconList(
          'border',
          'borderEdge',
          borderEdgeIconList,
          'border edge',
          'project_stage_planning-32.png'
        );
      case 'border-styles':
        return this.buildIconList(
          'border',
          'borderStyle',
          lineStyleIconList,
          'border style',
          'sketch-32.png'
        );
      case 'fontWeight':
        return this.buildIconList(
          'text',
          'fontWeight',
          fontWeightIconList,
          'font weight',
          'font_bold-32.png'
        );
      default:
        throw new Error('ButtonIconBuilder: unknown Button List Type');
    }
  }

  private buildIconList(
    styledElement: ImpactedAttributeTypes,
    classType: StyleTypes,
    iconList: IconPickerInterface[],
    toolTip: string,
    iconImage: string
  ): ButtonIconClassList {
    const icons: ButtonIconClassInterface[] = [];
    iconList.forEach(icon => {
      const biCB: ButtonIconClassInterface = new ButtonIconClassBuilder()
        .withClassNameActive(icon.class)
        .withIconImage(icon.icon)
        .withToolTip(icon.tooltip)
        .build();
      icons.push(biCB);
    });
    return new ButtonIconClassListBuilder()
      .withStyledElement(styledElement)
      .withClassType(classType)
      .withIconImage(iconImage)
      .withToolTip(toolTip)
      .withClassNames(icons)
      .build();
  }
}
