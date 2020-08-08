import { ComponentTypes, Button,  Text, LOREMIPSUM, Image, Dimensions } from '../components/components';
import {
  ComponentRef,
  top,
  left,
  width,
  height,
  ComponentTypesString,
  ActionEvent,
} from '@/models/components/base-component';
import {
  BoxDimensions,
  BoxDimensionsInterface,
} from '../components/box-dimension';
import { Style } from '@/models/styles/styles';
//interface for an html Style

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
  action: ActionEvent;
}

export type StyleTypes = 'border';
export interface PageContainerInterface extends PageElementInterface {
  elements: PageElement[];
}

export type PageData = PageElement | ComponentContainer;

export class PageElement implements Partial<PageElementInterface> {
  private _name: string; //** name of the component  */
  private _ref: ComponentRef; //**  unique ref of this component in the Dom */
  private _componentHTMLTag: string; //** component tag */
  private _isContainer: boolean; //** can contain  other elements */
  private _styles: Style[]; //** css styles */
  private _parent!: ComponentContainer; //** parent Object */
  private _parentRef: ComponentRef; //** string ref to the parent */
  private _classDefinition: string; //** String of tailwind classes to be applied to an element */
  private _type: ComponentTypesString; //** what is this component as in image text etc */
  private _data: ComponentTypes; //** holds associated user data i.e. the data the user inputs */
  private _boxDimensions: BoxDimensions; 
  private _actionEvent: ActionEvent; //** if this component support events ActionEvent defines the event type and action */
  private classList: string [] = [];

  constructor(pageElementBuilder: PageElementBuilder) {
    this._name = pageElementBuilder.name;
    this._ref = pageElementBuilder.ref;
    this._componentHTMLTag = pageElementBuilder.componentHTMLTag;
    this._isContainer = pageElementBuilder.isContainer;
    this._styles = pageElementBuilder.styles;
    this._parent = pageElementBuilder.parent;
    this._parentRef = pageElementBuilder.parentRef;
    this._classDefinition = pageElementBuilder.classDefinition;
    this._type = pageElementBuilder.type;
    this._data = pageElementBuilder.data;
    this._boxDimensions = pageElementBuilder.boxDimensions;
    this._actionEvent = pageElementBuilder.actionEvent;
    this.classList = pageElementBuilder.classDefinition.split(' ');
  }

  get name(): string {
    return this._name;
  }

  set name(newName: string) {
    this._name = newName;
  }

  get ref(): ComponentRef {
    return this._ref;
  }

  set ref(newRef: ComponentRef) {
    this._ref = newRef;
  }

  get componentHTMLTag(): string {
    return this._componentHTMLTag;
  }

  set componentHTMLTag(newComponent: string) {
    this._componentHTMLTag = newComponent;
  }

  get isContainer(): boolean {
    return this._isContainer;
  }

  set isContainer(newValue: boolean) {
    this._isContainer = newValue;
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
    return this._parentRef;
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

  get actionEvent(): ActionEvent {
    return this._actionEvent;
  }

  set actionEvent(actionEvent: ActionEvent) {
    this._actionEvent = actionEvent;
  }

  buildBoxDimensions(boxDimensions: BoxDimensionsInterface): void {
    this._boxDimensions = new BoxDimensions(
      boxDimensions.width,
      boxDimensions.height,
      boxDimensions.top,
      boxDimensions.left
    );
  }

  updateBoxHeightandWidth(boxDimensions: BoxDimensionsInterface): void {
        
    if (this._type === 'image') {
      const image: Image = this._data as Image;
      let newDimensions: Dimensions;
      if (image.maintainRatio) {
        if (boxDimensions.height.value !== image.scaledSize.height) {
           newDimensions = image.calcScalingRatio('height', boxDimensions.height.value);
        } else {
          newDimensions = image.calcScalingRatio('width', boxDimensions.width.value);
        }
        boxDimensions.height.value = newDimensions.height;
        boxDimensions.width.value = newDimensions.width;
      }
    }
   this._boxDimensions.height = boxDimensions.height;
   this._boxDimensions.width = boxDimensions.width;
  }

  addStyle(newStyle: Style) {
    this._styles = this._styles.filter(el => el.style !== newStyle.style);
    this._styles.push(newStyle);
  }

  removeStyle(styleToRemove: StyleTypes) {
    this._styles = this._styles.filter(el => !el.style.includes(styleToRemove));
  }

  get id(): number {
    const index = this._ref.indexOf('::');
    return parseInt(this._ref.substring(index + 1));
  }

  public updateRefWithNewId(id: string) {
    const index = this._ref.indexOf('::');
    const newRef = this._ref.substring(0, index + 1);
    this._ref = `${newRef}${id}`;
  }

  addClass(classDef: string): void {
    const stem = !classDef.includes('-') 
      ? classDef 
      : classDef.substr(0, classDef.indexOf('-') + 1) ;
    this.removeClass(stem);
    this.classList.push(classDef);
    this.classDefinition = this.classList.join(' ');
  }

  /** removeClass removes a class from the component, but it must be the full class name */
  removeClass(classDef: string): void {
    const tempClassList = this.classList.filter(
      className => !className.includes(classDef)
    );
    this.classList = tempClassList;
  }
}

export class PageElementBuilder {
  private _name = ''; //name of the component
  private _ref: ComponentRef = ''; // unique ref of this component in the Dom
  private _componentHTMLTag = ''; // component tag
  private _isContainer = false; // can contain  other elements
  private _styles: Style[] = []; // css styles
  private _parent!: ComponentContainer; // parent Object
  private _parentRef: ComponentRef = ''; // string ref to the parent
  private _classDefinition = 'bg-gray-200';
  private _type: ComponentTypesString = undefined; // what is this component as in image text etc
  private _data: ComponentTypes = undefined;
  private _boxDimensions: BoxDimensions = new BoxDimensions(width, height, top, left);
  private _actionEvent: ActionEvent = new ActionEvent(null, '');

  setName(name: string) {
    this._name = name;
    return this;
  }

  setRef(ref: string) {
    this._ref = ref;
    return this;
  }

  setComponentHtmlTag(htmlTag: string): PageElementBuilder {
    this._componentHTMLTag = htmlTag;
    return this;
  }

  setIsContainer(isContainer: boolean): PageElementBuilder {
    this._isContainer = isContainer;
    return this;
  }

  setStyles(styles: Style[]): PageElementBuilder {
    this._styles = styles;
    return this;
  }

  setParent(parent: ComponentContainer): PageElementBuilder {
    this._parent = parent;
    return this;
  }

  setClassDefintion(classDefintion: string): PageElementBuilder {
    this._classDefinition = classDefintion;
    return this;
  }

  setType(type: ComponentTypesString): PageElementBuilder {
    this._type = type;
    return this;
  }

  setData(data: ComponentTypes): PageElementBuilder {
    this._data = data;
    return this;
  }

  setBoxDimensions(boxDimensions: BoxDimensions): PageElementBuilder {
    this._boxDimensions = boxDimensions;
    return this;
  }

  setActionEvent(actionEvent: ActionEvent): PageElementBuilder {
    this._actionEvent = actionEvent;
    return this;
  }

  public get name(): string {
    return this._name;
  }

  public get ref(): ComponentRef {
    return this._ref;
  }

  public get componentHTMLTag(): string {
    return this._componentHTMLTag;
  }

  public get isContainer() {
    return this._isContainer;
  }

  public get styles(): Style[] {
    return this._styles;
  }

  public get parent(): ComponentContainer {
    return this._parent;
  }

  public get parentRef(): ComponentRef {
    return this._parentRef;
  }

  public get classDefinition() {
    return this._classDefinition;
  }

  public get type(): ComponentTypesString {
    return this._type;
  }

  public get data(): ComponentTypes {
    return this._data;
  }

  public get boxDimensions(): BoxDimensions {
    return this._boxDimensions;
  }

  public get actionEvent(): ActionEvent {
    return this._actionEvent;
  }

  public build(): PageElement {
    return new PageElement(this);
  }

  public buildAButton(): PageElement {
    this._data = new Button();
    this._data.content = 'Click Me';
    return new PageElement(this);
  }

  public buildATextComponent(): PageElement {
    this._data = new Text();
    this._data.content = LOREMIPSUM;
    return new PageElement(this);
  }

  public buildAnImage(): PageElement {
    this._data = new Image();
    return new PageElement(this);
  }
}

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
