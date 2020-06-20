import Vue from 'vue';
import Component from 'vue-class-component';
import { PageModule } from '@/store/page/page';
import {
  Style,
  BorderInterface,
  Border,
  BorderBuilder,
} from '@/models/styles/styles';
import { StyleTypes } from '@/models/page/page';

@Component
export class BorderButtonsMixin extends Vue {
  name = "BorderButtonMixin";
  borderStyle: Style | null = null;
  borderColour = 'rgba(0, 0, 0, 1)';
  borderDefintion: BorderInterface | null = null;

  setBorderStyle(border: Border): void {
    PageModule.updateEditedComponentStyles(border.getBorderStyle());
    PageModule.updateEditedComponentStyles(border.getBorderRadius());
  }

  onBorderChange(borderStyle: BorderInterface): void {
    const border: Border = this.buildBorder(borderStyle);
    this.setBorderStyle(border);
  }

  onRemoveStyle(styleToRemove: StyleTypes): void {
    PageModule.deleteEditedComponentStyle(styleToRemove);
  }

  buildBorder(borderStyle: BorderInterface): Border {
    this.borderDefintion = borderStyle;
    return new BorderBuilder()
      .setStyle(borderStyle.style)
      .setBorderDirection(borderStyle.borderDirection)
      .setWidth(borderStyle.width)
      .setBorderRadius(borderStyle.borderRadius)
      .setColour(this.borderColour)
      .build();
  }

  onShadowChange(classDef: string): void {
    PageModule.updateComponentClassProperties(classDef);
  }
}
