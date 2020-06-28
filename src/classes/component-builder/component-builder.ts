import { PageData, ComponentContainer, PageElement, PageElementBuilder } from '@/models/page/page';
import { ComponentDefinitionInterface, ComponentTypesString } from '@/models/components/base-component'
import { Button, Text, LOREMIPSUM, Image } from '@/models/components/components';
export const _componentClasses: ComponentDefinitionInterface[] = []


export class ComponentBuilder {

  getComponentName (event: DragEvent): string {
    const dataTransfer = event.dataTransfer;
    return dataTransfer ? dataTransfer.getData('text') : '';
  }

  buildComponent(component: ComponentDefinitionInterface, ref: string, parent: ComponentContainer): PageData {
    if(component.isContainer) return this.buildContainer(component, ref, parent)
    else return this.buildTheComponent(component, ref, parent);
  }
  
  private buildContainer(component: ComponentDefinitionInterface, ref: string, parent:  ComponentContainer) {
    const container: ComponentContainer = new ComponentContainer(
        new PageElementBuilder()
          .setName(component.componentName)
          .setRef(ref)
          .setIsContainer(component.isContainer)
          .setClassDefintion(component.class)
          .setComponentHtmlTag(component.componentRef)
          .setType(component.type)        
        );
    container.buildBoxDimensions(component.boxDimensions);
    if(parent.ref !== 'ROOT') { container.parent = parent };
    container.parentRef = parent.ref;
    return container
  }

  private buildBaseComponent(component: ComponentDefinitionInterface, ref: string, parent: ComponentContainer): PageElementBuilder {
    return new PageElementBuilder()
      .setName(component.componentName)
      .setParent(parent)
      .setIsContainer(false)
      .setComponentHtmlTag(component.componentRef)
      .setClassDefintion(component.class)
      .setRef(ref)
      .setType(component.type);
  }

  private buildTheComponent(component: ComponentDefinitionInterface, ref: string, parent: ComponentContainer): PageElement {
    let theComponent: PageElement | null = null;
    const componentType: ComponentTypesString = component.type;
    switch (componentType) {
      case  'button': 
        theComponent = this.buildBaseComponent(component, ref, parent).buildAButton();
        break;
      case 'text':
        theComponent = this.buildBaseComponent(component, ref, parent).buildATextComponent();
        break;
      case 'image':
        theComponent = this.buildBaseComponent(component, ref, parent).buildAnImage();
        break;
      default:
        theComponent = this.buildBaseComponent(component, ref, parent).build();
    }
    theComponent.buildBoxDimensions(component.boxDimensions);
    return theComponent;
  }
}