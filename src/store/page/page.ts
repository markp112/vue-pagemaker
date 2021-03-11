import store from '@/store';
import {
  Module,
  Mutation,
  Action,
  VuexModule,
  getModule
} from 'vuex-module-decorators';
// import {
//   PageData,
//   StyleTypes,
// } from '@/models/page/page';
import { StyleTypes } from '@/classes/page-element/PageElement';
import { PageContainer } from '@/classes/page-element/PageContainer/PageContainer';
import { Style } from '@/models/styles/styles';
import {
  ComponentTypesString,
  ActionEvent
} from '@/models/components/base-component';
import { BoxDimensionsInterface } from '@/models/components/box-dimension';
import { Image } from '@/models/components/components';
import { PageElementClasses } from '@/classes/page-element/factory/page-element-factory';
import { ImageElement } from '@/classes/page-element/page-components/image-element/ImageElement';
import { Notification } from '@/models/notifications/notifications';
import { FirebaseDataBuilder } from '@/classes/page-element/firebase-data/FirebaseDataBuilder';

export interface PageStateInterface {
  _pageId: string;
  _pageElements: PageElementClasses[];
  _theEditedComponent: PageElementClasses;
  _showEditDelete: boolean;
  _selectedComponent: string;
  _selectedComponentType: ComponentTypesString;
  _editComponentContent: string;
}

@Module({ dynamic: true , name: 'pagestore', store, })
class PageStore extends VuexModule implements PageStateInterface {
  ROOT = 'ROOT';
  public _pageId = '';
  //stores all the elements that make up a page
  // public _pageElements: PageData[] = [];
  public _pageElements: PageElementClasses[] = [];
  // reference to the component currently being edited
  public _theEditedComponent!: PageElementClasses;
  // show the toolbar for selecting edit // delete
  public _showEditDelete = false;
  // used to ensure only one component can be selected in the UI
  public _selectedComponent = '';
  // holds the type of the selected component to be reactive
  public _selectedComponentType: ComponentTypesString = undefined;
  // create reactive content
  public _editComponentContent = '';

  @Mutation
  private setPageId(pageId: string) {
    this._pageId = pageId;
  }

  @Mutation
  private pushPageElement(element: PageElementClasses): void {
    if (element) {
      if (element.parentRef === this.ROOT) {
        this._pageElements.push(element);
      } else {
        // component is nested within another
        if (this._pageElements.length > 0) {
          const parentElement = this._pageElements.filter(elem => {
            if (elem) {
              return elem.ref === element.parentRef;
            }
          })[0] as PageContainer;
          parentElement.addNewElement(element);
        }
      }
    }
  }

  @Mutation
  private deleteAPageElement(): void {
    if (this._theEditedComponent) {
      if (this._theEditedComponent.parentRef === this.ROOT) {
        this._pageElements = this._pageElements.filter(element => {
          if (this._theEditedComponent) {
            if (element) {
              return element.ref !== this._theEditedComponent.ref;
            }
          }
        });
      } else {
        const parentComponent = this._theEditedComponent.parent;
        (parentComponent as PageContainer).deleteElement(
          this._theEditedComponent.ref
        );
      }
    }
  }

  @Mutation
  private setEditedComponentStyles(newStyle: Style) {
    if (this._theEditedComponent) {
      this._theEditedComponent.addStyle(newStyle);
    }
  }

  @Mutation
  private removeEditedComponentStyle(styleToRemove: StyleTypes) {
    if (this._theEditedComponent) {
      this._theEditedComponent.removeStyle(styleToRemove);
    }
  }

  /** Add a class to the component currently being edited
   * classDef name of the Tailwind class to be added
   */
  @Mutation
  private setEditedComponentClass(classDef: string) {
    if (this._theEditedComponent) {
      const component: PageElementClasses = 
        this._theEditedComponent as PageElementClasses;
      if (component) {
        component.addClass(classDef);
      }
    }
  }

  /** remove a class from the edited component class list
   * classDef name of the Tailwind class to be removed -
   */
  @Mutation
  private removeEditedComponentClass(classDef: string) {
    if (this._theEditedComponent) {
      const component: PageElementClasses =   
        this._theEditedComponent as PageElementClasses;
      if (component) {
        component.removeClass(classDef);
      }
    }
  }

  /**clearPageElements - clear out all components on the current page */
  @Mutation
  private clearPageElements(): void {
    this._pageElements = [];
  }

  @Mutation
  private setEditedComponentRef(component: PageElementClasses): void {
    console.log('%c%s', 'color: #0cdf28', 'setEditedComponentRef');
    // this._theEditedComponent = undefined;
    this._theEditedComponent = component;
    console.log('%c⧭', 'color: #1d3f73', component);
    this._selectedComponent = component ? component.ref : '';
    this._selectedComponentType = this._theEditedComponent
      ? this._theEditedComponent.type
      : undefined;
    this._editComponentContent = this._theEditedComponent
      ? this._theEditedComponent.content
      : '';
  }

  @Mutation
  private setEditedComponentContent(content: string): void {
    if (this._theEditedComponent) {
      this._theEditedComponent.content = content;
      this._editComponentContent = content;
    }
  }

  @Mutation
  private setShowEditDelete(show: boolean): void {
    this._showEditDelete = show;
  }

  @Mutation
  private setComponentImage(image: Image): void {
    if (this._theEditedComponent) {
      if (this._theEditedComponent.type === 'image') {
        (this._theEditedComponent as ImageElement).setImage(image);
      }
    }
  }

  @Mutation
  private setBoxDimensionsHeightandWidth(
    newDimensions: BoxDimensionsInterface
  ) {
    if (this._theEditedComponent) {
      this._theEditedComponent.reSize(newDimensions);
    }
  }

  @Mutation
  private setEditedComponentActionEvent(actionEvent: ActionEvent) {
    if (this._theEditedComponent) {
      this._theEditedComponent.actionEvent = actionEvent;
    }
  }

  @Mutation
  private setPageElements(elements: PageElementClasses[]) {
    this._pageElements = elements;
  }
  //#endregion Mutations

  //#region  Actions
  @Action
  public updatePageId(pageId: string) {
    this.context.commit('setPageId', pageId);
  }

  @Action
  public clear() {
    this.context.commit('clearPageElements')
  }

  @Action
  public updateEditedComponentRef(element: PageElementClasses) {
    this.context.commit('setEditedComponentRef', element);
  }

  @Action
  public updateShowEditDelete(show: boolean) {
    this.context.commit('setShowEditDelete', show);
  }

  @Action
  public addNewPageElement(element: PageElementClasses) {
    this.context.commit('pushPageElement', element);
  }

  @Action
  public deletePageElement() {
    this.context.commit('deleteAPageElement');
  }

  @Action
  public updateComponentImage(image: Image) {
    this.context.commit('setComponentImage', image);
  }

  @Action
  public updateBoxDimensionHeightandWidth(
    newDimensions: BoxDimensionsInterface
  ) {
    this.context.commit('setBoxDimensionsHeightandWidth', newDimensions);
  }

  @Action
  public updateParentClassProperties(classDef: string): void {
    if (this.getComponentRef) {
      const parent = this.getComponentRef.parent;
      if (parent) {
        parent.addClass(classDef);
      }
    }
  }

  @Action
  public deleteEditedComponentStyle(styleToRemove: StyleTypes): void {
    this.context.commit('removeEditedComponentStyle', styleToRemove);
  }

  @Action
  public updateEditedComponentStyles(newStyle: Style): void {
    this.context.commit('setEditedComponentStyles', newStyle);
  }

  @Action
  public updateComponentClassProperties(classDef: string): void {
    this.context.commit('setEditedComponentClass', classDef);
  }

  @Action
  public deleteClassFromEditedComponent(classDef: string): void {
    this.context.commit('removeEditedComponentClass', classDef);
  }

  @Action
  public updateEditedComponentData(newContent: string): void {
    this.context.commit('setEditedComponentContent', newContent);
  }

  @Action
  public updateEditedComponentActionEvent(actionEvent: ActionEvent) {
    this.context.commit('setEditedComponentActionEvent', actionEvent);
  }

  @Action
  public savePageContent(): Promise<Notification> {
    const firebaseData = new FirebaseDataBuilder();
    return new Promise((resolve, reject) => {
      const pageElements = this.pageElements;
      const pageId = this.PageId;
      firebaseData
        .savePageData(pageElements, pageId)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  @Action
  public updatePageElements(elements: PageElementClasses[]) {
    this.context.commit('setPageElements', elements);
  }
  // #region Actions
  // #region getters

  public get PageId(): string {
    return this._pageId;
  }

  public get getComponentRef(): PageElementClasses {
    return this._theEditedComponent;
  }

  public get editedComponentType(): ComponentTypesString {
    return this._selectedComponentType;
  }

  public get editedComponentData(): string {
    return this._editComponentContent;
  }

  public get showEditDelete(): boolean {
    return this._showEditDelete;
  }

  public get pageElements(): PageElementClasses[] {
    return this._pageElements.sort(this.compare);
  }

  public get selectedComponent(): string {
    return this._selectedComponent;
  }

  private compare(a: PageElementClasses, b: PageElementClasses) {
    if (a && b) {
      if (a.id > b.id) return 1;
      if (a.id < b.id) return -1;
    }
    return 0;
  }
}

export const PageModule = getModule(PageStore);
