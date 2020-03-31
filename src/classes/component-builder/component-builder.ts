import Vue from 'vue';
import NavbarEditor from '@/components/page-builder-elements/nav-bars/nav-bar/nav-bar.vue';
import store from "@/store/";

export type ComponentTypes = NavbarEditor | null
export class ComponentBuilder {

  getComponentID (event: DragEvent): string | undefined {
    const dataTransfer = event.dataTransfer;
    return dataTransfer ? dataTransfer.getData('text') : undefined;
  }

  buildComponent(componentId: string | undefined): ComponentTypes {
    switch (componentId) {
      case 'Nav-bar':
        return this.buildNavBar();
    }
    return null
  }

  private buildNavBar():NavbarEditor {
    const componentClass = Vue.extend(NavbarEditor)
    const instance:NavbarEditor = new componentClass({
      propsData:{ $store: store}
    })
    instance.$mount();
    return instance;
  }

}