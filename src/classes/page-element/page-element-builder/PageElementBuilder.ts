import { ComponentRef, ComponentTypesString, width, height, left, top, ActionEvent } from '@/models/components/base-component';
import { BoxDimensions, BoxDimensionsInterface } from '@/models/components/box-dimension';
import { ComponentTypes, LOREMIPSUM } from '@/models/components/components';
import { Style } from '@/models/styles/styles';
import { ButtonElement } from '../page-components/button-element/ButtonElement';
import { PageContainer } from '../PageContainer/PageContainer';
import { PageElement } from '../PageElement';
import { TextElement } from '../page-components/text-element/TextElement';
import { ImageElement } from '../page-components/image-element/ImageElement';

export class PageElementBuilder {
  private _name = ''; //name of the component
  private _ref: ComponentRef = ''; // unique ref of this component in the Dom
  private _componentHTMLTag = ''; // component tag
  private _isContainer = false; // can contain  other elements
  private _styles: Style[] = []; // css styles
  private _parent!: PageContainer; // parent Object
  private _parentRef: ComponentRef = ''; // string ref to the parent
  private _classDefinition = 'bg-gray-200';
  private _type: ComponentTypesString = undefined; // what is this component as in image text etc
  private _data: ComponentTypes = undefined;
  private _boxDimensions: BoxDimensions = new BoxDimensions(width, height, top, left);
  private _actionEvent: ActionEvent = new ActionEvent('Navigation', '');
  private _content ='';

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

  setParent(parent: PageContainer): PageElementBuilder {
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

  setBoxDimensions(boxDimensionsData: BoxDimensionsInterface): PageElementBuilder {
    const boxDimensions = new BoxDimensions(
      boxDimensionsData.width,
      boxDimensionsData.height,
      boxDimensionsData.top,
      boxDimensionsData.left
      )
    this._boxDimensions = boxDimensions;
    return this;
  }

  setActionEvent(actionEvent: ActionEvent): PageElementBuilder {
    this._actionEvent = actionEvent;
    return this;
  }

  setContent(content: string) {
    this._content = content;
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

  public get parent(): PageContainer {
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

  public get content(): string {
    return this._content;
  }

// required to create an empty container / element when initialising props.
  public build(): PageElement {
    return new PageElement(this);
  }

  public buildAButton(): ButtonElement {
    this._content = 'click me';
    return new ButtonElement(this);
  }

  public buildATextElement(): TextElement {
    this._content = LOREMIPSUM;
    return new TextElement(this);
  }

  public buildAnImage(): ImageElement {
    if (this._content === '') {
      this._content = 'https://firebasestorage.googleapis.com/v0/b/page-maker-69fb1.appspot.com/o/assets%2Fimages%2Fimageplaceholder.png?alt=media&token=149d3e60-0fc4-49de-9e23-5fea91458240';
    }
    return new ImageElement(this);
  }

  public buildAContainer(): PageContainer {
    return new PageContainer(this);
  }
}