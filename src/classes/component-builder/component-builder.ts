import { PageData, PageContainer, PageElement, ComponentRef, ComponentDefinitionInterface } from '@/models/page/page';
export const _componentClasses: ComponentDefinitionInterface[] = []


export class ComponentBuilder {

  getComponentName (event: DragEvent): string {
    const dataTransfer = event.dataTransfer;
    return dataTransfer ? dataTransfer.getData('text') : '';
  }

  buildComponent(component: ComponentDefinitionInterface, ref: string , parent: ComponentRef): PageData {
    if(component.isContainer) return this.buildContainer(component, ref, parent)
    else return this.buildTheComponent(component, ref, parent);
  }
  
  private buildContainer(component: ComponentDefinitionInterface ,ref: string, parent: ComponentRef) {
    const container: PageContainer = new PageContainer();
    container.name = component.componentName
    container.ref = ref;
    container.classDefinition = component.class;
    container.componentHTMLTag =  component.componentRef; 
    container.parent = parent;
    return container
  }

  private buildTheComponent(component: ComponentDefinitionInterface, ref: string, parent: ComponentRef): PageElement {
    const genericButton = new PageElement();
    genericButton.ref = ref;
    genericButton.isContainer = false;
    genericButton.classDefinition = component.class;
    genericButton.componentHTMLTag =  component.componentRef;
    genericButton.parent = parent;
    return genericButton

  }

}