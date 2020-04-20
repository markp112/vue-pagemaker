import { IconInterface, initIcon } from '../font-awesome/icon';
import { ComponentTypes } from '../components/components';
import { ComponentTypesEnum } from '../enums/componentTypes/componentTypes';

//interface for an html Style
export interface Style {
  style: string;
  value: string;
}

//definition for a component as dropped on the page from a sidebar
export interface ComponentDefinitionInterface {
  //  unique name for this component
  componentName: string;
  // class defintion which controls the layout of this element
  class: string;
  componentRef: ComponentRef; // the html tag used to put this element on the page
  isContainer: boolean; // is a container or component 
  sidebarIcon: IconInterface; // icon for this component
  type: ComponentTypesEnum; // what is this see types
}

export interface DataComponentDefinitionInterface extends ComponentDefinitionInterface {
  data: ComponentTypes; // for when a component needs data e.g. picture element
}

export type ComponentDefinitionTypes = ComponentDefinitionInterface | DataComponentDefinitionInterface;
export class ComponentDefinitions {
  _componentDefinitions: ComponentDefinitionTypes[];

  constructor() {
    this._componentDefinitions = [];
  }

  add(newComponent: ComponentDefinitionTypes): void {
    const component: ComponentDefinitionTypes | undefined = this.getComponent(newComponent.componentName);
    if (component !== undefined) {
      this.delete(component.componentName);
    }
    this._componentDefinitions.push(newComponent);
  }

  delete(componentName: string): void {
    this._componentDefinitions = this._componentDefinitions.filter(
      (component: ComponentDefinitionTypes) => component.componentName !== componentName);
  }

  getComponent(componentName = '', componentRef = ''): ComponentDefinitionTypes | undefined {
    if (componentName === '' && componentRef === '') return;
    if (componentRef !== '') {
      return this._componentDefinitions.filter(comp => comp.componentRef === componentRef)[0];
    } else {
      return this._componentDefinitions.filter(comp => comp.componentName === componentName)[0];
    }
  }

  componentDefinitions(): ComponentDefinitionTypes[] {
    return this._componentDefinitions;
  }
}

export const initComponentDefinition = {
  componentName: '',
  class: '',
  componentRef: '',
  isContainer: false,
  sidebarIcon: initIcon,
  type: ComponentTypesEnum.undefined,
}

// unique reference for this component when dropped on the page
export type ComponentRef = string;

// represents the definition of the object the user has dropped on the page
export interface PageElementInterface {
  name: string;
  ref: ComponentRef;
  componentHTMLTag: string;
  isContainer: boolean;
  styles: Style[];
  parentRef: string;
  classDefinition: string;
  type: ComponentTypesEnum;
  data: ComponentTypes;
}

export interface PageContainerInterface extends PageElementInterface {
  elements: PageElement[]
}

export type PageData = PageElement | ComponentContainer;

export class PageElement implements Partial<PageElementInterface> {
  private _name: string;  //name of the component
  private _ref: ComponentRef; // unique ref of this component in the Dom
  private _componentHTMLTag: string; // component tag
  private _isContainer: boolean; // can contain  other elements
  private _styles: Style[]; // css styles
  private _parent!: ComponentContainer; // parent Object
 // parent Object
  private _parentRef: ComponentRef; // string ref to the parent
  private _classDefinition: string;
  private _type: ComponentTypesEnum // what is this component as in image text etc
  private _data: ComponentTypes;

  constructor() {
    this._name = '';
    this._ref = '';
    this._componentHTMLTag = '';
    this._isContainer = false;
    this._styles = [];
    this._parentRef = 'ROOT';
    this._classDefinition = '';
    this._type = ComponentTypesEnum.undefined;
    this._data = undefined;
  }

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

  get type(): ComponentTypesEnum {
    return this._type;
  }

  set type(type: ComponentTypesEnum) {
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

  addStyle(newStyle: Style) {
    const existingStyle = this._styles.filter((element: Style) => element.style === newStyle.style)[0]
    if (!existingStyle) {
      this._styles.push(newStyle)
    } else {
      this._styles = this._styles.filter((element: Style) => element.style !== newStyle.style);
      this._styles.push(newStyle)
    }
  }

  height(): string {
    if (this._classDefinition) {
      const classDef = this._classDefinition;
      const posOfHeight = classDef.indexOf('h-');
      const height = classDef.substring(posOfHeight, classDef.indexOf(' ', posOfHeight) );
      return height;
    }
    else return '';
  }
  
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
    console.log('%c%s', 'color: #733d00', index);
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