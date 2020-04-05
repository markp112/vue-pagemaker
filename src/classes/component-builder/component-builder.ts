import Vue from 'vue';
import NavbarEditor from '@/components/page-builder-elements/nav-bars/nav-bar/nav-bar.vue';
import BaseButton from '@/components/page-builder-elements/buttons/base-button.vue';
import store from "@/store/";
import { PageData, PageContainer, PageElement, ComponentRef } from '@/models/page/page';

export type ComponentTypes = NavbarEditor | BaseButton | null
export class ComponentBuilder {

  getComponentID (event: DragEvent): string {
    const dataTransfer = event.dataTransfer;
    return dataTransfer ? dataTransfer.getData('text') : '';
  }

  buildComponent(componentId: string | undefined, ref: ComponentRef, parent: ComponentRef): PageData {
    console.log('%c%s', 'color: #00a3cc', parent, "Parent ===>");
    switch(componentId) {
      case 'NavBar':
        return this.buildNavBar(ref, parent);
      case 'BaseButton':
        return this.buildBaseButton(ref, parent);
      case 'genericButton':
        return this.buildGenericButton(ref, parent);
      default:
        return this.buildNavBar(ref,parent);
    }

  }

  private buildNavBar(ref: string, parent: ComponentRef ): PageContainer {
    const navBar: PageContainer = new PageContainer();
    navBar.name = "navBar";
    navBar.ref = ref;
    navBar.isContainer = true;
    navBar.component = 'nav-bar-editor';
    navBar.parent = parent;
    return navBar;
  }

  private buildBaseButton(ref: string, parent: ComponentRef): PageElement {
    const baseButton = new PageElement();
    baseButton.name = 'baseButton';
    baseButton.ref = ref;
    baseButton.isContainer = false;
    baseButton.addStyle( {style:'background-color', value:'#004455' } ); 
    baseButton.addStyle( {style:'width', value: '150px' } ); 
    baseButton.addStyle( {style:'height', value:'40px' } );
    baseButton.component = 'base-button';
    baseButton.parent = parent,
    console.log('baseButton==>',baseButton)
    return baseButton
  }

  private buildGenericButton(ref: string, parent: ComponentRef): PageElement {
    const genericButton = new PageElement();
    genericButton.ref = ref;
    genericButton.ref = ref;
    genericButton.isContainer = false;
    genericButton.addStyle( {style:'background-color', value:'#772255' } ); 
    genericButton.addStyle( {style:'width', value: '100px' } ); 
    genericButton.addStyle( {style:'height', value:'40px' } );
    genericButton.component = 'base-button';
    genericButton.parent = parent,
    console.log('genericButton==>',genericButton)
    return genericButton

  }

}