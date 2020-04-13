import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { PageElement, ComponentContainer, PageData } from '@/models/page/page';
import { Image } from '@/models/components/components';

@Module({name: 'PageModule' })
export default class PageModule extends VuexModule {

  ROOT = 'ROOT'
  //stores all the elements that make up a page
  _pageElements: PageData [] = [];  
  // reference to the component currently being edited
  _editedComponentRef!: PageData;
  // show the toolbar for selecting edit // delete
  _showEditDelete = false;
  // unique number for each component always incremented and set to the max ref of the last component when loading
  _componentId = 0;

  @Mutation pushPageElement(element: PageData): void {
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

  @Mutation deleteAPageElement(): void {
    if (this._editedComponentRef.parentRef === this.ROOT) {
      this._pageElements = this._pageElements.filter(element => element.ref !== this._editedComponentRef.ref)
    } else {
      const parentComponent = this._pageElements.filter(element => element.ref === this._editedComponentRef.parentRef)[0];
      (parentComponent as ComponentContainer).deleteElement(this._editedComponentRef.ref)
    }
  }

  @Mutation clearPageElements(): void {
    this._pageElements = [];
  }

  @Mutation setEditedComponentRef(ref: PageData): void {
    this._editedComponentRef = ref;
  }

  @Mutation setShowEditDelete(show: boolean): void {
    this._showEditDelete = show;
  }

  @Mutation setComponentImage(url: string): void {
    if (this._editedComponentRef) {
      if (this._editedComponentRef.data) {
        if (this._editedComponentRef.type === "Image") {
            this._editedComponentRef.data.content  = url;
          }
        }
      }
  }

  //#endregion Mutations
  //#region  Actions
  @Action
  updateEditedComponentRef(element: PageData){
    this.context.commit('setEditedComponentRef', element);
  }


  @Action
  updateShowEditDelete(show: boolean) {
    this.context.commit("setShowEditDelete", show);
  }

  @Action
  addNewPageElement(element: PageData) {
    this.context.commit("pushPageElement", element);
  }

  @Action 
  deletePageElement(){
    this.context.commit('deleteAPageElement');
  }

  @Action
  updateComponentImage(url: string) {
    this.context.commit('setComponentImage', url);
  }

  @Action
  updateParentClassProperties(classDef: string): void {
    if (this.editedComponentRef) {
      const parent = this.editedComponentRef.parent;
      if (parent) {
        parent.addClass(classDef);
      }
    }
  }

  @Action
  updateComponentClassProperties(classDef: string): void {
    if (this.editedComponentRef) {
      const component: ComponentContainer = this.editedComponentRef as ComponentContainer;
      if (component) {
        console.log('%c⧭', 'color: #f2ceb6', component);
        component.addClass(classDef);
      }
    }
  }
  

  get editedComponentRef(): PageData {
    console.log("editedComponentRef called",  this._editedComponentRef)
    return this._editedComponentRef;
  }

  get showEditDelete(): boolean {
    return this._showEditDelete;
  }

  get pageElements(): PageData[] {
    return this._pageElements;
  }

  get nextComponentId():number {
    return this._componentId;
  }

}