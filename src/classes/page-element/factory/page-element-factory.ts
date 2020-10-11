import { ComponentDefinitionInterface } from '@/models/components/base-component';
import { ButtonElement } from '../page-components/button-element/ButtonElement';
import { ComponentContainer } from '../ComponentContainer';
import { PageElementBuilder } from '../page-element-builder/PageElementBuilder';
import { TextElement } from '../page-components/text-element/TextElement';
import { ImageElement } from '../page-components/image-element/ImageElement';

export type PageElementTypes = 
| 'button'
| 'text'

export class PageElementFactory {

  // createElement(type: Object);
  createElement(
    type: PageElementTypes,
    component: ComponentDefinitionInterface,
    ref: string,
    parent: ComponentContainer
  ): ButtonElement;

  public createElement(
    type: PageElementTypes,
    component: ComponentDefinitionInterface,
    ref: string,
    parent: ComponentContainer
  ): ButtonElement | TextElement |ImageElement | undefined {
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
    if (type === 'text') {
      return this.buildAnImageElement(
        component,
        ref,
        parent,
      )
    }
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
    .setComponentHtmlTag(component.componentRef)
    .setClassDefintion(component.class)
    .setRef(ref)
    .setType(component.type)
    .buildAButton();
    return buttonElement;
  }

  private buildATextElement(
    component: ComponentDefinitionInterface,
    ref: string,
    parent: ComponentContainer
  ): TextElement {
    const textElement: ButtonElement = new PageElementBuilder()
    .setName(component.componentName)
    .setParent(parent)
    .setIsContainer(false)
    .setComponentHtmlTag(component.componentRef)
    .setClassDefintion(component.class)
    .setRef(ref)
    .setType(component.type)
    .buildATextElement();
    return textElement;
  }

  private buildAnImageElement(component: ComponentDefinitionInterface,
    ref: string,
    parent: ComponentContainer
  ): ImageElement {
    const imageElement: ImageElement = new PageElementBuilder()
    .setName(component.componentName)
    .setParent(parent)
    .setIsContainer(false)
    .setComponentHtmlTag(component.componentRef)
    .setClassDefintion(component.class)
    .setRef(ref)
    .setType(component.type)
    .buildAnImage();
    return imageElement;

  }
}