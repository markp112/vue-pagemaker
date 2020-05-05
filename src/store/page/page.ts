import store from '@/store';
import { Module, Mutation, Action, VuexModule, getModule } from 'vuex-module-decorators';
import {
  ComponentContainer,
  PageElement,
  PageData,
} from '@/models/page/page';
import { Style } from '@/models/styles/styles';
import { ComponentTypesString } from '@/models/components/base-component';
import { BoxDimensions, BoxDimensionsInterface } from '@/models/components/box-dimension';

export interface PageStateInterface {
  _pageElements: PageData [],
  _editedComponentRef: ComponentContainer | PageElement | undefined ,
  _showEditDelete: boolean,
  _componentId: number,
}

@Module({ name: 'pagestore', store, dynamic: true })
class PageStore extends VuexModule implements PageStateInterface {

  ROOT = 'ROOT'
  //stores all the elements that make up a page
  public _pageElements: PageData [] = [];  
  // reference to the component currently being edited
  public _editedComponentRef: ComponentContainer | PageElement | undefined = undefined;
  // show the toolbar for selecting edit // delete
  public _showEditDelete = false;
  // unique number for each component always incremented and set to the max ref of the last component when loading
  public _componentId = 0;

  @Mutation 
  private pushPageElement(element: PageData): void {
    if(element){
      if(element.parentRef === this.ROOT ) {
        this._pageElements.push(element);
      } else { // component is nested within another
        if (this._pageElements.length > 0) {
          const parentElement = this._pageElements.filter(
              elem => { return elem.ref === element.parentRef })[0] as ComponentContainer;
          parentElement.addNewElement (element);
        }
      }
      this._componentId++;
    }
  }

  @Mutation 
  private deleteAPageElement(): void {
    if (this._editedComponentRef) {
    if (this._editedComponentRef.parentRef === this.ROOT) {
      this._pageElements = this._pageElements.filter(element =>{
        if (this._editedComponentRef) {
          return element.ref !== this._editedComponentRef.ref 
        }
      })
    } else {
      const parentComponent = this._pageElements.filter(element => {
        if (this._editedComponentRef) {
          return element.ref === this._editedComponentRef.parentRef
        }})[0];
        (parentComponent as ComponentContainer).deleteElement(this._editedComponentRef.ref)
      }
    }
  }

  @Mutation
  private setEditedComponentStyles(newStyle: Style) {
    
    if (this._editedComponentRef) {
      console.log('%c⧭', 'color: #7f2200', this._editedComponentRef);
      this._editedComponentRef.addStyle(newStyle);
    }
  }

  @Mutation 
  private clearPageElements(): void {
    this._pageElements = [];
  }

  @Mutation 
  private setEditedComponentRef(ref: PageData): void {
    this._editedComponentRef = ref;
  }

  @Mutation 
  private setShowEditDelete(show: boolean): void {
    this._showEditDelete = show;
  }

  @Mutation 
  private setComponentImage(url: string): void {
    if (this._editedComponentRef) {
      if (this._editedComponentRef.data) {
        const componentType: ComponentTypesString = this._editedComponentRef.type;
        if (componentType === 'image') {
            this._editedComponentRef.data.content  = url;
          }
        }
      }
  }

  @Mutation
  private setBoxDimensionsHeightandWidth(newDimensions: BoxDimensionsInterface) {
    if(this._editedComponentRef) this._editedComponentRef.updateBoxHeightandWidth(newDimensions);
  }

  //#endregion Mutations
  //#region  Actions
  @Action
  public updateEditedComponentRef(element: PageData){
    this.context.commit('setEditedComponentRef', element);
  }

  @Action
  public updateShowEditDelete(show: boolean) {
    this.context.commit("setShowEditDelete", show);
  }

  @Action
  public addNewPageElement(element: PageData) {
    this.context.commit("pushPageElement", element);
  }

  @Action 
  public deletePageElement(){
    this.context.commit('deleteAPageElement');
  }

  @Action
  public updateComponentImage(url: string) {
    this.context.commit('setComponentImage', url);
  }

  @Action
  public updateBoxDimensionHeightandWidth(newDimensions: BoxDimensionsInterface) {
    this.context.commit('setBoxDimensionsHeightandWidth', newDimensions);
  }

  @Action
  public updateParentClassProperties(classDef: string): void {
    if (this.editedComponentRef) {
      const parent = this.editedComponentRef.parent;
      if (parent) {
        parent.addClass(classDef);
      }
    }
  }

  @Action
  public updateEditedComponentStyles(newStyle: Style): void {
    this.context.commit('setEditedComponentStyles', newStyle);
  }

  @Action
  public updateComponentClassProperties(classDef: string): void {
    if (this.editedComponentRef) {
      const component: PageData = this.editedComponentRef as PageData;
      if (component) {
        component.addClass(classDef);
      }
    }
  }
  
  @Action getTheEditedComponentRef(): Promise<PageData> {
    return new Promise((resolve) => {
      resolve(this._editedComponentRef);
    });
  }

  public get editedComponentRef(): PageData | undefined {
    return this._editedComponentRef;
  }

  public get showEditDelete(): boolean {
    return this._showEditDelete;
  }

  public get pageElements(): PageData[] {
    return this._pageElements.sort(this.compare);
  }

  private compare(a: PageData, b: PageData) {
    if (a.id > b.id) return 1
    if (a.id < b.id) return -1
    return 0
  }

}

export const PageModule = getModule(PageStore);