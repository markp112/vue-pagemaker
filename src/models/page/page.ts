import { IconInterface } from '../font-awesome/icon';
import { ComponentTypes } from '../components/components';

//interface for an html Style
export interface Style {
  style: string;
  value: string;
}

//definition for a component as dropped on the page from a sidebar
export interface ComponentDefinitionInterface {
  componentName: string; //  unique name for this component
  class: string;    // class defintion which controls the layout of this element
  componentRef: ComponentRef; // the html tag used to put this element on the page
  isContainer: boolean;       // is a container or component 
  sidebarIcon: IconInterface; // icon for this component
  type: string;               // what is this see types
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
    const component: ComponentDefinitionTypes | undefined = this.getComponent(newComponent.componentName)
    if (component !== undefined) {
      this.delete(component.componentName)
    }
    this._componentDefinitions.push(newComponent)
  }

  delete(componentName: string): void {
    this._componentDefinitions = this._componentDefinitions.filter((component: ComponentDefinitionTypes) => component.componentName !== componentName);
  }

  getComponent(componentName = '', componentRef = ''): ComponentDefinitionTypes | undefined {
    if (componentName === '' && componentRef === '') return
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
  sidebarIcon: { icon: '', prefix: '' },
  type: '',
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
  parent: ComponentRef;
  classDefinition: string;
  type: string;
  data: ComponentTypes;
}

export interface PageContainerInterface extends PageElementInterface {
  elements: PageElement[]
}

export type PageData = PageElement | ComponentContainer;

export class PageElement implements PageElementInterface {
  private _name: string;  //name of the component
  private _ref: ComponentRef; // unique ref of this component in the Dom
  private _componentHTMLTag: string; // component tag
  private _isContainer: boolean; // can contain  other elements
  private _styles: Style[]; // css styles
  private _parent: ComponentRef; // ref to parent element
  private _classDefinition: string;
  private _type: string // what is this component as in image text etc
  private _data: ComponentTypes;

  constructor() {
    this._name = '';
    this._ref = '';
    this._componentHTMLTag = '';
    this._isContainer = false;
    this._styles = [];
    this._parent = ''
    this._classDefinition = '';
    this._type = '';
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
    return this._styles
  }

  get type(): string {
    return this._type
  }

  set type(type: string) {
    this._type = type
  }

  get classDefinition(): string {
    return this._classDefinition
  }

  set classDefinition(definition: string) {
    this._classDefinition = definition
  }

  get data(): ComponentTypes {
    return this._data
  }

  set data(data: ComponentTypes) {
    this._data = data
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

  get parent(): ComponentRef {
    return this._parent
  }

  set parent(newParent: ComponentRef) {
    this._parent = newParent
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
      this._elements.push(newElement)
    } else {
      this._elements = this._elements.filter((element: PageData) => element.ref !== newElement.ref);
      this._elements.push(newElement);
    }
  }

  getAnElement(ref: ComponentRef): PageData {
    return this._elements.filter((element: PageData) => element.ref === ref)[0];
  }

  deleteElement(ref: ComponentRef) {
    this._elements = this._elements.filter(element => element.ref !== ref)
  }
}