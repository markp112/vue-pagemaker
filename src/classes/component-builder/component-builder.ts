import Vue from 'vue';
import NavbarEditor from '@/components/page-builder-elements/nav-bars/nav-bar/nav-bar.vue';
import BaseButton from '@/components/page-builder-elements/buttons/base-button.vue';
import store from "@/store/";
import { PageData, PageContainer } from '@/models/page/page';

export type ComponentTypes = NavbarEditor | BaseButton | null
export class ComponentBuilder {

  getComponentID (event: DragEvent): string | undefined {
    const dataTransfer = event.dataTransfer;
    return dataTransfer ? dataTransfer.getData('text') : undefined;
  }

  buildComponent(componentId: string | undefined, ref: string): PageData {
    switch(componentId) {
      case 'NavBar':
        return this.buildNavBar(ref);
      default:
        return this.buildNavBar(ref);
    }

  }

  // buildComponent(componentId: string | undefined): ComponentTypes {
  //   switch (componentId) {
  //     case 'Navbar':
  //       return this.buildNavBar();
  //     case 'BaseButton':
  //       return this.buildBaseButton();
  //   }
  //   return null
  // }

  private buildNavBar(ref: string ): PageContainer {
    const navBar:PageContainer ={
      name: "navBar",
      ref: ref,
      isContainer: true,
      elements: [],
      styles: [],
      component:'nav-bar-editor'

    }
    return navBar;
  }


  // private buildNavBar():NavbarEditor {
  //   const componentClass = Vue.extend(NavbarEditor)
  //   const instance:NavbarEditor = new componentClass({
  //     propsData:{ $store: store}
  //   })
  //   instance.$mount();
  //   return instance;
  // }

  private buildBaseButton(): BaseButton {
    const componentClass = Vue.extend(BaseButton);
    const instance:BaseButton = new componentClass({
      propsData: {buttonLabel:"label"}
    })
    instance.$mount();
    return instance;
  }

}