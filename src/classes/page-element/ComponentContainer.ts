import { ComponentRef } from '@/models/components/base-component';
import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';
import { PageElement } from './PageElement';
import { PageElementClasses } from './factory/page-element-factory';
import { SiteDefaults } from '../settings/site-defaults/site-defaults';


export class ComponentContainer extends PageElement {
  private _elements: PageElementClasses[];

  constructor(pageElementBuilder: PageElementBuilder) {
    super(pageElementBuilder);
    this._elements = [];
  }

  get elements(): PageElementClasses[] {
    return this._elements;
  }

  setDefaultStyle() {
    const siteDefaults = SiteDefaults.getInstance();
    this.addStyle(this.constructStyle('fontFamily', siteDefaults.typography.fontName));
    this.addStyle(this.constructStyle('fontSize', siteDefaults.typography.fontSizeBody));
    const siteColours = siteDefaults.colours;
    this.addStyle(this.constructStyle('backgroundColor', siteColours.surface));
    this.addStyle(this.constructStyle('color', siteColours.textOnSurface))

  }

  addNewElement(newElement: PageElementClasses) {
    if (newElement) {
      const existingElement = this._elements.filter(
        (element) => {
          if (element) {
            element.ref === newElement.ref
          }
        } 
      )[0];
      if (!existingElement) {
        this._elements.push(newElement);
      } else {
        this._elements = this._elements.filter(
          (element) => {
            if (element) {
              element.ref !== newElement.ref
            }
          }
        );
        this._elements.push(newElement);
      }
    }
  }

  getAnElement(ref: ComponentRef): PageElementClasses {
    return this._elements.filter(element => {
      if (element) {
        return element.ref === ref;
      }
    })[0];
  }

  deleteElement(ref: ComponentRef) {
    this._elements = this._elements.filter(element => {
      if (element) {
        return element.ref !== ref
      }
    });
  }
}
