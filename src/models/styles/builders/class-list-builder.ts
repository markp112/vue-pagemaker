import { ButtonRequestTypes } from '@/models/styles/button-factory/button-factory';
import { ButtonIconClassList, ButtonIconClassListBuilder } from '../button-icon/button-icon-class-list/button-icon-class-list';
import {
  shadowIconList,
  borderEdgeIconList,
  lineStyleIconList,
  fontWeightIconList,
  IconPickerInterface,
} from '@/models/components/icon-picker-models';
import { ButtonIconClassInterface } from '../button-icon/button-icon';
import { ButtonIconClassBuilder } from './button-icon-class-builder';

export class ButtonIconBuilder {
  build(whichButton: ButtonRequestTypes): ButtonIconClassList {
    switch (whichButton) {
      case 'Shadow' :
        return this.buildIconList(shadowIconList, 'shadows', 'shadows-32.png');
      case 'border-direction' :
        return this.buildIconList(borderEdgeIconList, 'border edge', 'project_stage_planning-32.png');
      case 'border-styles':
        return this.buildIconList(lineStyleIconList, 'border style', 'sketch-32.png');
      case 'font-weight':
        return this.buildIconList(fontWeightIconList, 'font weight', 'font_bold-32.png' )
      default:
        throw new Error("BButtonIconBuilder: unknown Button List Type");     
    }
  }

  private buildIconList(
    iconList: IconPickerInterface[],
    toolTip: string,
    iconImage: string
  ): ButtonIconClassList {
    const icons: ButtonIconClassInterface[] = [];
    iconList.forEach(icon => {
      const biCB: ButtonIconClassInterface = new ButtonIconClassBuilder()
        .withClassName(icon.class)
        .withIconImage(icon.icon)
        .withToolTip(icon.tooltip)
        .build();
      icons.push(biCB);
    });
    return new ButtonIconClassListBuilder()
      .withIconImage(iconImage)
      .withToolTip(toolTip)
      .withClassNames(icons)
      .build();
  }
}
