// import { ComponentTypes, Button, Text, LOREMIPSUM, Image } from '../../models/components/components';
// import {
//   ComponentRef,
//   top,
//   left,
//   width,
//   height,
//   ComponentTypesString,
//   ActionEvent
// } from '@/models/components/base-component';
// import { BoxDimensions } from '../../models/components/box-dimension';
// import { Style } from '@/models/styles/styles';
// import { PageElement } from './PageElement';
// import { ComponentContainer } from "./ComponentContainer";


// export class PageElementBuilder {
//   private _name = ''; //name of the component
//   private _ref: ComponentRef = ''; // unique ref of this component in the Dom
//   private _componentHTMLTag = ''; // component tag
//   private _isContainer = false; // can contain  other elements
//   private _styles: Style[] = []; // css styles
//   private _parent!: ComponentContainer; // parent Object
//   private _parentRef: ComponentRef = ''; // string ref to the parent
//   private _classDefinition = 'bg-gray-200';
//   private _type: ComponentTypesString = undefined; // what is this component as in image text etc
//   private _data: ComponentTypes = undefined;
//   private _boxDimensions: BoxDimensions = new BoxDimensions(width, height, top, left);
//   private _actionEvent: ActionEvent = new ActionEvent(null, '');

//   setName(name: string) {
//     this._name = name;
//     return this;
//   }

//   setRef(ref: string) {
//     this._ref = ref;
//     return this;
//   }

//   setComponentHtmlTag(htmlTag: string): PageElementBuilder {
//     this._componentHTMLTag = htmlTag;
//     return this;
//   }

//   setIsContainer(isContainer: boolean): PageElementBuilder {
//     this._isContainer = isContainer;
//     return this;
//   }

//   setStyles(styles: Style[]): PageElementBuilder {
//     this._styles = styles;
//     return this;
//   }

//   setParent(parent: ComponentContainer): PageElementBuilder {
//     this._parent = parent;
//     return this;
//   }

//   setClassDefintion(classDefintion: string): PageElementBuilder {
//     this._classDefinition = classDefintion;
//     return this;
//   }

//   setType(type: ComponentTypesString): PageElementBuilder {
//     this._type = type;
//     return this;
//   }

//   setData(data: ComponentTypes): PageElementBuilder {
//     this._data = data;
//     return this;
//   }

//   setBoxDimensions(boxDimensions: BoxDimensions): PageElementBuilder {
//     this._boxDimensions = boxDimensions;
//     return this;
//   }

//   setActionEvent(actionEvent: ActionEvent): PageElementBuilder {
//     this._actionEvent = actionEvent;
//     return this;
//   }

//   public get name(): string {
//     return this._name;
//   }

//   public get ref(): ComponentRef {
//     return this._ref;
//   }

//   public get componentHTMLTag(): string {
//     return this._componentHTMLTag;
//   }

//   public get isContainer() {
//     return this._isContainer;
//   }

//   public get styles(): Style[] {
//     return this._styles;
//   }

//   public get parent(): ComponentContainer {
//     return this._parent;
//   }

//   public get parentRef(): ComponentRef {
//     return this._parentRef;
//   }

//   public get classDefinition() {
//     return this._classDefinition;
//   }

//   public get type(): ComponentTypesString {
//     return this._type;
//   }

//   public get data(): ComponentTypes {
//     return this._data;
//   }

//   public get boxDimensions(): BoxDimensions {
//     return this._boxDimensions;
//   }

//   public get actionEvent(): ActionEvent {
//     return this._actionEvent;
//   }

//   public build(): PageElement {
//     return new PageElement(this);
//   }

//   public buildAButton(): PageElement {
//     this._data = new Button();
//     this._data.content = 'Click Me';
//     return new PageElement(this);
//   }

//   public buildATextComponent(): PageElement {
//     this._data = new Text();
//     this._data.content = LOREMIPSUM;
//     return new PageElement(this);
//   }

//   public buildAnImage(): PageElement {
//     this._data = new Image();
//     return new PageElement(this);
//   }
// }