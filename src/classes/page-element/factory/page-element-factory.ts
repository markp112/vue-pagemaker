import { ComponentDefinitionInterface, ComponentTypesString } from '@/models/components/base-component';
import { ButtonElement } from '../page-components/button-element/ButtonElement';
import { PageContainer } from '../PageContainer/PageContainer';
import { PageElementBuilder } from '../page-element-builder/PageElementBuilder';
import { TextElement } from '../page-components/text-element/TextElement';
import { ImageElement } from '../page-components/image-element/ImageElement';
import { ROOT } from '@/utils/constants';
import { BoxDimensions, BoxDimensionsInterface } from '@/models/components/box-dimension';


export type PageElementClasses = 
| ButtonElement
| TextElement
| ImageElement
| PageContainer
| undefined


/**
 * @description factory to build page elements as required e.g. button, text area etc
 * called with the component type required and the properties linked to that component
 */
export class PageElementFactory {

  public createElement(): PageElementClasses;

  public createElement(type: ComponentTypesString, ref: string): PageElementClasses;

  public createElement(
    type: ComponentTypesString,
    ref: string,
    component: ComponentDefinitionInterface,
    parent: PageContainer | null
  ): PageElementClasses;

  public createElement(
    type?: ComponentTypesString,
    ref?: string,
    component?: ComponentDefinitionInterface,
    parent?: PageContainer | null
  ): PageElementClasses {
    if (type === undefined) {
      return undefined;
    }
    if (type === 'rootContainer' && ref) {
      return this.buildRootContainer(ref);
    }
    if (type && component && ref ) {
      if (!parent) {
        return this.buildRootContainer(ref);
      } else {
        if (component.isContainer) {
          return this.createContainer(component, ref, parent);
        } else {
          return this.createComponent(component, ref, parent);
        }
      }
    }
  }

  private createContainer (
    component: ComponentDefinitionInterface,
    ref: string,
    parent: PageContainer): PageContainer {
      const container : PageContainer = new PageElementBuilder()
        .setRef(ref)
        .setIsContainer(true)
        .setName(component.componentName)
        .setParent(parent)
        .setType(component.type)
        .setComponentHtmlTag(component.componentRef)
        .setClassDefintion(component.class)
        .setBoxDimensions(component.boxDimensions)
        .buildAContainer();
      container.parentRef = container.parent.ref;
      return container;
  }

  private createComponent (
    component: ComponentDefinitionInterface,
    ref: string,
    parent: PageContainer): PageElementClasses {
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

  private getBoxDimensions(boxDimensionsInterface: BoxDimensionsInterface): BoxDimensions {
    console.log('%c⧭', 'color: #607339', boxDimensionsInterface);
    const boxDimensions: BoxDimensions = new BoxDimensions(
      boxDimensionsInterface.width,
      boxDimensionsInterface.height,
      boxDimensionsInterface.top,
      boxDimensionsInterface.left,
    );
    return boxDimensions;
  } 

  private buildAButton(
    component: ComponentDefinitionInterface,
    ref: string,
    parent: PageContainer
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
    parent: PageContainer
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
    parent: PageContainer
  ): ImageElement {
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

  private buildRootContainer(ref: string): PageContainer {
    const container : PageContainer = new PageElementBuilder()
      .setRef(ref)
      .setIsContainer(true)
      .setName(ROOT)
      .buildAContainer();
      container.parentRef = container.ref;
      return container;
  }
}