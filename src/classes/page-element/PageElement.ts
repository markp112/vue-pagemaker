import {
  ComponentRef,
  ComponentTypesString,
  ActionEvent,
} from "@/models/components/base-component";
import {
  BoxDimensions,
  BoxDimensionsInterface,
  Dimension
} from "../../models/components/box-dimension";
import { Style, StyleTags } from "@/models/styles/styles";
import {
  PageElementFirebaseData,
  PageElementInterface
} from "@/classes/page-element/models/pageElements/PageElementModel";
import { PageElementBuilder } from "@/classes/page-element/page-element-builder/PageElementBuilder";
import { PageContainer } from "./PageContainer/PageContainer";

export type StyleTypes = "border";

export class PageElement implements Partial<PageElementInterface> {
  private _name: string; //** name of the component  */
  private _ref: ComponentRef; //**  unique ref of this component in the Dom */
  private _componentHTMLTag: string; //** component tag */
  private _isContainer: boolean; //** can contain  other elements */
  private _styles: Style[]; //** css styles */
  private _parent!: PageContainer; //** parent Object */
  private _parentRef: ComponentRef; //** string ref to the parent */
  private _classDefinition: string; //** String of tailwind classes to be applied to an element */
  private _type: ComponentTypesString; //** what is this component as in image text etc */
  private _boxDimensions: BoxDimensions;
  private _actionEvent: ActionEvent; //** if this component support events ActionEvent defines the event type and action */
  private _content: string;
  private classList: string[] = [];
  private _isAbsolute = false;

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
    this._boxDimensions = pageElementBuilder.boxDimensions;
    this._actionEvent = pageElementBuilder.actionEvent;
    this.classList = pageElementBuilder.classDefinition.split(" ");
    this._content = pageElementBuilder.content;
    this._isAbsolute = pageElementBuilder.isAbsolute;
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

  get parent(): PageContainer {
    return this._parent;
  }

  set parent(newParent: PageContainer) {
    this._parent = newParent;
  }

  get parentRef(): string {
    return this._parentRef;
  }

  set parentRef(parentRef: string) {
    this._parentRef = parentRef;
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

  get id(): number {
    const index = this._ref.indexOf("::");
    return parseInt(this._ref.substring(index + 1));
  }

  get content(): string {
    return this._content;
  }

  set content(content: string) {
    this._content = content;
  }

  get isAbsolute(): boolean {
    return this._isAbsolute;
  }

  set isAbsolute(isAbsolute: boolean) {
    this._isAbsolute = isAbsolute;
  }

  buildBoxDimensions(boxDimensions: BoxDimensionsInterface): void {
    this._boxDimensions = new BoxDimensions(boxDimensions);
  }

  public getBaseElementContent(): PageElementFirebaseData {
    return {
      name: this._name,
      ref: this._ref,
      componentHTMLTag: this._componentHTMLTag,
      isContainer: this._isContainer,
      styles: this._styles,
      parentRef: this._parentRef,
      classDefinition: this.classDefinition,
      type: this._type,
      actionEvent: this._actionEvent.toObject,
      boxDimensions: this._boxDimensions.toObject,
      content: this._content,
      isAbsolute: this._isAbsolute
    };
  }

  public reSize(boxDimensions: BoxDimensionsInterface): void {
    this._boxDimensions.height = boxDimensions.height;
    this._boxDimensions.width = boxDimensions.width;
  }

  public setLocation(top: Dimension, left: Dimension): void {
    this._boxDimensions.top = top;
    this._boxDimensions.left = left;
  }

  constructStyle(styleName: StyleTags, value: string): Style {
    const style: Style = {
      style: styleName,
      value: value
    };
    return style;
  }

  setDefaultStyle() {
    // to be implemented in inherited classes
  }

  addStyle(newStyle: Style) {
    if (newStyle.style === 'transparency') {
      const backgroundColour = this._styles.filter(el => el.style === 'backgroundColor');
      if (backgroundColour.length > 0) {
        const currentStyle = backgroundColour[0];
        const hexValue = parseInt(newStyle.value).toString(16);
        currentStyle.value = `${currentStyle.value.substring(0,7)}${hexValue}`;
        currentStyle.style = 'backgroundColor'
      }
      this._styles = this._styles.filter(el => el.style !== newStyle.style);
      this._styles.push(newStyle);
    }
  }

  addStyles(styles: Style[]) {
    this._styles = [...styles];
  }

  removeStyle(styleToRemove: string) {
    this._styles = this._styles.filter(el => !el.style.includes(styleToRemove));
  }

  public updateRefWithNewId(id: string) {
    const index = this._ref.indexOf("::");
    const newRef = this._ref.substring(0, index + 1);
    this._ref = `${newRef}${id}`;
  }

  addClass(classDef: string): void {
    const stem = !classDef.includes("-")
      ? classDef
      : classDef.substr(0, classDef.indexOf("-") + 1);
    this.removeClass(stem);
    this.classList.push(classDef);
    this.classDefinition = this.classList.join(" ").trim();
  }

  getStylesToString(): string {
    let style = "";
    const styles: Style[] = this.styles;
    if (styles.length > 0) {
      styles.forEach(element => {
        style += `${element.style}:${element.value};`;
      });
    }
    style += `${this.boxDimensions.heightAsStyle};${this.boxDimensions.widthAsStyle};`;
    if (this.isAbsolute) {
      style += `${this.boxDimensions.topAsStyle};${this.boxDimensions.leftAsStyle};`;
    }
    return style;
  }

  /** removeClass removes a class from the component, but it must be the full class name */
  removeClass(classDef: string): void {
    const tempClassList = this.classList.filter(
      className => !className.includes(classDef)
    );
    this.classList = tempClassList;
  }
}
