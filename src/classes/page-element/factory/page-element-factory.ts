import { ComponentDefinitionInterface, ComponentTypesString } from '@/models/components/base-component';
import { ButtonElement } from '../page-components/button-element/ButtonElement';
import { ComponentContainer } from '../ComponentContainer';
import { PageElementBuilder } from '../page-element-builder/PageElementBuilder';
import { TextElement } from '../page-components/text-element/TextElement';
import { ImageElement } from '../page-components/image-element/ImageElement';
import { ROOT } from '@/utils/constants';
import { BoxDimensions, BoxDimensionsInterface } from '@/models/components/box-dimension';


export type PageElementClasses = 
| ButtonElement
| TextElement
| ImageElement
| ComponentContainer
| undefined


/**
 * @description factory to build page elements as required e.g. button, text area etc
 * called with the component type required and the properties linked to that component
 */
export class PageElementFactory {

  public createElement(
    type: ComponentTypesString,
    component: ComponentDefinitionInterface,
    ref: string,
    parent: ComponentContainer | null
  ): PageElementClasses {
    if (parent === null) {
      return this.buildRootContainer(ref);
    }
    if (component.isContainer) {
      return this.createContainer(component, ref, parent);
    } else {
      return this.createComponent(component, ref, parent);
    }
  }

  private createContainer (
    component: ComponentDefinitionInterface,
    ref: string,
    parent: ComponentContainer): ComponentContainer {

      const container : ComponentContainer = new PageElementBuilder()
        .setRef(ref)
        .setIsContainer(true)
        .setName(component.componentName)
        .setParent(parent)
        .setComponentHtmlTag(component.componentRef)
        .setClassDefintion(component.class)
        .setBoxDimensions(component.boxDimensions)
        .buildAContainer();
        container.parentRef = container.parent.ref;
        console.log('%c⧭', 'color: #e9a2a2', container);
      return container;

  }

  private createComponent (
    component: ComponentDefinitionInterface,
    ref: string,
    parent: ComponentContainer): PageElementClasses {
      const type = component.type;
      if (type === 'button') {
        return this.buildAButton(
          component,
          ref,
          parent,
        )
      }
      if (type === 'text') {
        return this.buildATextElement(
          component,
          ref,
          parent,
        )
      }
      if (type === 'image') {
        return this.buildAnImageElement(
          component,
          ref,
          parent,
        )
      }
    }

  private getBoxDimensions(boxDimensionsInteface: BoxDimensionsInterface): BoxDimensions {
    const boxDimensions: BoxDimensions = new BoxDimensions(
      boxDimensionsInteface.width,
      boxDimensionsInteface.height,
      boxDimensionsInteface.top,
      boxDimensionsInteface.left
    );
    return boxDimensions;
  } 

  private buildAButton(
    component: ComponentDefinitionInterface,
    ref: string,
    parent: ComponentContainer
  ): ButtonElement {
    
    const buttonElement: ButtonElement = new PageElementBuilder()
    .setName(component.componentName)
    .setParent(parent)
    .setIsContainer(false)
    .setBoxDimensions(this.getBoxDimensions(component.boxDimensions))
    .setComponentHtmlTag(component.componentRef)
    .setClassDefintion(component.class)
    .setRef(ref)
    .setType(component.type)
    .buildAButton();
    buttonElement.parentRef = buttonElement.parent.ref;
    return buttonElement;
  }

  private buildATextElement(
    component: ComponentDefinitionInterface,
    ref: string,
    parent: ComponentContainer
  ): TextElement {
    const textElement: TextElement = new PageElementBuilder()
    .setName(component.componentName)
    .setParent(parent)
    .setIsContainer(false)
    .setBoxDimensions(this.getBoxDimensions(component.boxDimensions))
    .setComponentHtmlTag(component.componentRef)
    .setClassDefintion(component.class)
    .setRef(ref)
    .setType(component.type)
    .buildATextElement();
    textElement.parentRef = textElement.parent.ref;
    return textElement;
  }

  private buildAnImageElement(component: ComponentDefinitionInterface,
    ref: string,
    parent: ComponentContainer
  ): ImageElement {
    console.log('%c⧭', 'color: #ff6600', component);
    const imageElement: ImageElement = new PageElementBuilder()
    .setName(component.componentName)
    .setParent(parent)
    .setIsContainer(false)
    .setBoxDimensions(this.getBoxDimensions(component.boxDimensions))
    .setComponentHtmlTag(component.componentRef)
    .setClassDefintion(component.class)
    .setRef(ref)
    .setType(component.type)
    .buildAnImage();
    imageElement.parentRef = imageElement.parent.ref;
    return imageElement;
  }

  private buildRootContainer(ref: string): ComponentContainer {
    const container : ComponentContainer = new PageElementBuilder()
      .setRef(ref)
      .setIsContainer(true)
      .setName(ROOT)
      .buildAContainer();
      container.parentRef = container.ref;
      return container;
  }
}