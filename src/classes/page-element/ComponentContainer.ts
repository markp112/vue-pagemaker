import { ComponentRef } from '@/models/components/base-component';
import { PageData } from '../../models/page/page';
import { PageElementBuilder } from './PageElementBuilder';
import { PageElement } from './PageElement';


export class ComponentContainer extends PageElement {
  private _elements: PageData[];

  constructor(pageElementBuilder: PageElementBuilder) {
    super(pageElementBuilder);
    this._elements = [];
  }

  get elements(): PageData[] {
    return this._elements;
  }

  addNewElement(newElement: PageData) {
    const existingElement = this._elements.filter(
      (element: PageData) => element.ref === newElement.ref
    )[0];
    if (!existingElement) {
      this._elements.push(newElement);
    } else {
      this._elements = this._elements.filter(
        (element: PageData) => element.ref !== newElement.ref
      );
      this._elements.push(newElement);
    }
  }

  getAnElement(ref: ComponentRef): PageData {
    return this._elements.filter((element: PageData) => element.ref === ref)[0];
  }

  deleteElement(ref: ComponentRef) {
    this._elements = this._elements.filter(element => element.ref !== ref);
  }
}
