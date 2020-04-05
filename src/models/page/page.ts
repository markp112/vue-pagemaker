export interface Style {
  style: string;
  value: string;
}

export type ComponentRef = string;

export interface PageElementInterface {
  name: string;
  ref: ComponentRef;
  component: string;
  isContainer: boolean;
  styles: Style [];
  parent: ComponentRef;
}

export interface PageContainerInterface extends PageElementInterface {
  elements: PageElement []
}

export type PageData = PageElement | PageContainer;

export class PageElement implements PageElementInterface {
  private _name: string;  //name of the component
  private _ref: ComponentRef; // unique ref of this component in the Dom
  private _component: string; // component tag
  private _isContainer: boolean; // can contain  other elements
  private _styles: Style[]; // css styles
  private _parent: ComponentRef; // ref to parent element

  constructor() {
    this._name = '';
    this._ref = '';
    this._component = '';
    this._isContainer = false;
    this._styles = [];
    this._parent = ''
  }

  get name(): string {
    return this._name
  }

  set name(newName: string ) {
    this._name = newName
  }

  get ref(): ComponentRef {
    return this._ref
  }

  set ref(newRef: ComponentRef) {
    this._ref = newRef
  }

  get component(): string {
    return this._component
  }

  set component(newComponent: string) {
    this._component = newComponent
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

  addStyle(newStyle: Style) {
    const existingStyle = this._styles.filter((element: Style) => element.style === newStyle.style )[0]
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

export class PageContainer extends PageElement {
  private  _elements: PageData[];

    constructor(){
      super();
      this._elements = [];
    }

    get elements(): PageData[] {
      return this._elements;
    }
    
    addNewElement(newElement: PageData) {
      const existingElement = this._elements.filter((element: PageData) => element.ref === newElement.ref)[0];
      if(!existingElement) {
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