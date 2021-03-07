import Vue from 'vue';
import Component from 'vue-class-component';
import { PageModule } from '@/store/page/page';
import { Border } from '@/classes/borders/borders';
import { StyleTypes } from '@/classes/page-element/PageElement';
import { SidebarButtonEventManager } from '@/classes/sidebarButtonEventManager/sidebarButtonEventManager';

@Component
export class BorderButtonsMixin extends Vue {
  name = 'BorderButtonMixin';

  borderDefintion: Border = Border.getInstance();

  setBorderStyle(): void {
    const eventManager = SidebarButtonEventManager.getInstance();
    eventManager.updateEditedComponent();
  }

  onBorderChange(): void {
    this.setBorderStyle();
  }

  onRemoveStyle(styleToRemove: StyleTypes): void {
    PageModule.deleteEditedComponentStyle(styleToRemove);
  }

  onShadowChange(): void {
    const eventManager = SidebarButtonEventManager.getInstance();
    eventManager.updateEditedComponent();
  }
}
