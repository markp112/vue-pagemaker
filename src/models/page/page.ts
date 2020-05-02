import { ComponentTypes } from '../components/components';
import {
  ComponentRef,
  top,
  left,
  width,
  height,
  ComponentTypesString
} from '@/models/components/base-component';
import { BoxDimensions, BoxDimensionsInterface } from '../components/box-dimension';
//interface for an html Style
export interface Style {
  style: string;
  value: string;
}

// represents the definition of the object the user has dropped on the page
export interface PageElementInterface {
  name: string;
  ref: ComponentRef;
  componentHTMLTag: string;
  isContainer: boolean;
  styles: Style[];
  parentRef: string;
  classDefinition: string;
  type: ComponentTypesString;
  data: ComponentTypes;
  boxDimensions: BoxDimensions;
}

export interface PageContainerInterface extends PageElementInterface {
  elements: PageElement[]
}

export type PageData = PageElement | ComponentContainer;

export class PageElement implements Partial<PageElementInterface> {
  private _name = '';  //name of the component
  private _ref: ComponentRef = ''; // unique ref of this component in the Dom
  private _componentHTMLTag = ''; // component tag
  private _isContainer = false; // can contain  other elements
  private _styles: Style[] = []; // css styles
  private _parent!: ComponentContainer; // parent Object
 // parent Object
  private _parentRef: ComponentRef = ''; // string ref to the parent
  private _classDefinition = 'bg-gray-200';
  private _type: ComponentTypesString = undefined; // what is this component as in image text etc
  private _data: ComponentTypes = undefined;
  private _boxDimensions: BoxDimensions = new BoxDimensions(width, height, top, left);

  get name(): string {
    return this._name
  }

  set name(newName: string) {
    this._name = newName
  }

  get ref(): ComponentRef {
    return this._ref
  }

  set ref(newRef: ComponentRef) {
    this._ref = newRef
  }

  get componentHTMLTag(): string {
    return this._componentHTMLTag
  }

  set componentHTMLTag(newComponent: string) {
    this._componentHTMLTag = newComponent
  }

  get isContainer(): boolean {
    return this._isContainer
  }

  set isContainer(newValue: boolean) {
    this._isContainer = newValue
  }

  get styles(): Style[] {
    return this._styles;
  }

  get type(): ComponentTypesString {
    return this._type;
  }

  set type(type: ComponentTypesString) {
    this._type = type;
  }

  get classDefinition(): string {
    return this._classDefinition;
  }

  set classDefinition(definition: string) {
    this._classDefinition = definition;
  }

  get parent(): ComponentContainer {
    return this._parent;
  }

  set parent(newParent: ComponentContainer) {
    this._parent = newParent;
  }

  get parentRef(): string {
    return this._parentRef
  }

  set parentRef(parentRef: string) {
    this._parentRef = parentRef;
  }

  get data(): ComponentTypes {
    return this._data;
  }

  set data(data: ComponentTypes) {
    this._data = data;
  }
  get boxDimensions(): BoxDimensions {
    return this._boxDimensions;
  }

  buildBoxDimensions(boxDimensions: BoxDimensionsInterface): void {
    this._boxDimensions = new BoxDimensions(boxDimensions.width, boxDimensions.height, boxDimensions.top, boxDimensions.left);
  }

  addStyle(newStyle: Style) {
    const existingStyle = this._styles.filter((element: Style) => element.style === newStyle.style)[0]
    if (!existingStyle) {
      this._styles.push(newStyle)
    } else {
      this._styles = this._styles.filter((element: Style) => element.style !== newStyle.style);
      this._styles.push(newStyle)
    }
  }

  // height(): string {
  //   if (this._classDefinition) {
  //     const classDef = this._classDefinition;
  //     const posOfHeight = classDef.indexOf('h-');
  //     const height = classDef.substring(posOfHeight, classDef.indexOf(' ', posOfHeight) );
  //     return height;
  //   }
  //   else return '';
  // }
  
  addClass(classDef: string): void {
    if (classDef.indexOf('flex') >= 0) {
      this.processFlex(classDef);
    }
    if(classDef.indexOf('w-') >= 0) {
      this.processWidths(classDef);
    }
  }

  private cutString(stringToCutFrom: string, wordToCut: string): string {
    const index =  stringToCutFrom.indexOf(wordToCut);
    if (index >= 0) {
      return  stringToCutFrom.split(' ').filter(word => word !== wordToCut).join(' ');
    } else return stringToCutFrom;
  }

  private processWidths(classDef: string) {
    const index = this.classDefinition.indexOf('w-');
    if (index >= 0) {
      let tempclass = this.classDefinition;
      tempclass = this.cutString(tempclass, 'w-2/12');
      tempclass = this.cutString(tempclass, 'w-4/12');
      tempclass = this.cutString(tempclass, 'w-6/12');
      tempclass = this.cutString(tempclass, 'w-8/12');
      tempclass = this.cutString(tempclass, 'w-10/12');
      tempclass = this.cutString(tempclass, 'w-full');
      tempclass = this.cutString(tempclass, 'w-auto');
      tempclass += ` ${classDef}`;
      this.classDefinition = tempclass;
    } else {
      this.classDefinition += ` ${classDef}`;
    }
  }

  private processFlex(classDef: string): void {
    const index = this.classDefinition.indexOf('flex');
    if (index >= 0) {
      let tempclass = this.classDefinition;
      tempclass = this.cutString(tempclass, 'flex');
      tempclass = this.cutString(tempclass, 'flex-row');
      tempclass = this.cutString(tempclass, 'justify-center');
      tempclass = this.cutString(tempclass, 'justify-between');
      tempclass = this.cutString(tempclass, 'justify-around');
      tempclass = this.cutString(tempclass, 'justify-end');
      tempclass = this.cutString(tempclass, 'justify-start');
      tempclass += ` ${classDef}`;
      this.classDefinition = tempclass;
    } else {
      this.classDefinition += ` ${classDef}`;
    }
  }
}

export class ComponentContainer extends PageElement {
  private _elements: PageData[];

  constructor() {
    super();
    this._elements = [];
  }

  get elements(): PageData[] {
    return this._elements;
  }

  addNewElement(newElement: PageData) {
    const existingElement = this._elements.filter((element: PageData) => element.ref === newElement.ref)[0];
    if (!existingElement) {
      this._elements.push(newElement);
    } else {
      this._elements = this._elements.filter((element: PageData) => element.ref !== newElement.ref);
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