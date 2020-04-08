import { PageData, PageContainer, PageElement, ComponentRef, ComponentDefinitionInterface } from '@/models/page/page';

export const componentClasses: ComponentDefinitionInterface[] = []


export class ComponentBuilder {

  getComponentID (event: DragEvent): string {
    const dataTransfer = event.dataTransfer;
    return dataTransfer ? dataTransfer.getData('text') : '';
  }

  buildComponent(componentId: string | undefined, ref: ComponentRef, parent: ComponentRef): PageData {


    // switch(componentId) {
    //   case 'NavBar':
    //     return this.buildNavBar(ref, parent);
    //   case 'genericButton':
    //     return this.buildGenericButton(ref, parent, componentId);
    //   default:
    //     return this.buildNavBar(ref,parent);
    // }

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
  
  private buildContainer(ref: string, parent: ComponentRef, componentId: string ) {
    const container: PageContainer = new PageContainer();
    container.name = componentId;
    container.ref = ref;
    const componentDef: ComponentDefinitionInterface = componentClasses.filter(component => component.componentName = componentId)[0];
    container.classDefinition = componentDef.class;
    container.component =  componentDef.componentRef;
    container.parent = parent;
    return container
  }


  private buildComponent(ref: string, parent: ComponentRef, componentId: string): PageElement {
    const genericButton = new PageElement();
    genericButton.ref = ref;
    genericButton.isContainer = false;
    const componentDef:ComponentDefinitionInterface = componentClasses.filter(component => component.componentName = componentId)[0];
    genericButton.classDefinition = componentDef.class;
    genericButton.component =  componentDef.componentRef;
    genericButton.parent = parent;
    return genericButton

  }

}