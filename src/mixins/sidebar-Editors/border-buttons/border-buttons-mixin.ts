import Vue from 'vue';
import Component from 'vue-class-component';
import { PageModule } from '@/store/page/page';
import {
  Border,
} from '@/models/styles/styles';
import { StyleTypes } from '@/models/page/page';

@Component
export class BorderButtonsMixin extends Vue {
  name = "BorderButtonMixin";

  borderDefintion:Border = Border.getInstance();
  
  setBorderStyle(): void {
    PageModule.updateEditedComponentStyles(this.borderDefintion.getStyle());
    PageModule.updateEditedComponentStyles(this.borderDefintion.getBorderRadius());
  }

  onBorderChange(): void {
    this.setBorderStyle();
  }

  onRemoveStyle(styleToRemove: StyleTypes): void {
    PageModule.deleteEditedComponentStyle(styleToRemove);
  }

  onShadowChange(classDef: string): void {
    PageModule.updateComponentClassProperties(classDef);
  }
}
