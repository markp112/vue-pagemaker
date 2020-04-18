import { PageData, ComponentContainer, PageElement, ComponentRef, ComponentDefinitionInterface } from '@/models/page/page';
import { Button, Text, LOREMIPSUM, Image, ComponentTypes } from '@/models/components/components';
import { ComponentTypesEnum, enumerate } from '@/models/enums/componentTypes/componentTypes';
export const _componentClasses: ComponentDefinitionInterface[] = []


export class ComponentBuilder {

  getComponentName (event: DragEvent): string {
    const dataTransfer = event.dataTransfer;
    return dataTransfer ? dataTransfer.getData('text') : '';
  }

  buildComponent(component: ComponentDefinitionInterface, ref: string , parent: ComponentContainer): PageData {
    if(component.isContainer) return this.buildContainer(component, ref, parent)
    else return this.buildTheComponent(component, ref, parent);
  }
  
  private buildContainer(component: ComponentDefinitionInterface ,ref: string, parent:  ComponentContainer) {
    const container: ComponentContainer = new ComponentContainer();
    container.name = component.componentName
    container.ref = ref;
    container.isContainer = component.isContainer;
    container.classDefinition = component.class;
    container.componentHTMLTag =  component.componentRef; 
    if(parent.ref !== 'ROOT') { container.parent = parent };
    container.parentRef = parent.ref;
    return container
  }

  private buildTheComponent(component: ComponentDefinitionInterface, ref: string, parent: ComponentContainer): PageElement {
    const genericComponent = new PageElement();
    genericComponent.ref = ref;
    genericComponent.isContainer = false;
    genericComponent.classDefinition = component.class;
    genericComponent.componentHTMLTag =  component.componentRef;
    genericComponent.parent = parent;
    genericComponent.parentRef = parent.ref;
    genericComponent.type = component.type;
    genericComponent.name = component.componentName;
    const componentType: ComponentTypesEnum = enumerate[component.type];

    console.log('%c%s', 'color: #917399', componentType, "Type", componentType === ComponentTypesEnum.text);
    switch (componentType) {
      case  ComponentTypesEnum.button: 
        genericComponent.data = new Button();
        genericComponent.data.content ='Click Me'
        break;
      case ComponentTypesEnum.text:
        console.log("this is text")
        genericComponent.data = new Text();
        genericComponent.data.content = LOREMIPSUM;
        break;
      case ComponentTypesEnum.image:
        genericComponent.data = new Image();
        break;

    }
    return genericComponent
  }
}