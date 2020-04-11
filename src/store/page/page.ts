import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { PageElement, ComponentContainer, PageData } from '@/models/page/page';

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

  @Mutation pushPageElement(element: PageData) {
    console.log('pushPageElement',element)
    if(element.parent === this.ROOT ) {
      this._pageElements.push(element);
    } else { // component is nested within another
      const childElement: ComponentContainer = this._pageElements.filter(elem => elem.ref === element.parent)[0] as ComponentContainer;
      childElement.addNewElement (element);
    }
    this._componentId++;
  }

  @Mutation deleteAPageElement() {
    if (this._editedComponentRef.parent === this.ROOT) {
      this._pageElements = this._pageElements.filter(element => element.ref !== this._editedComponentRef.ref)
    } else {
      const parentComponent = this._pageElements.filter(element => element.ref === this._editedComponentRef.parent)[0];
      (parentComponent as ComponentContainer).deleteElement(this._editedComponentRef.ref)
    }
  }

  @Mutation clearPageElements() {
    this._pageElements = []
  }

  @Mutation setEditedComponentRef(ref: PageData) {
    this._editedComponentRef = ref
  }

  @Mutation setShowEditDelete(show: boolean) {
    this._showEditDelete = show
  }

  @Action
  updateEditedComponentRef(element: PageData){
    this.context.commit('setEditedComponentRef', element)
  }

  @Action
  updateShowEditDelete(show: boolean) {
    this.context.commit("setShowEditDelete", show)
  }

  @Action
  addNewPageElement(element: PageData) {
    this.context.commit("pushPageElement", element)
  }

  @Action 
  deletePageElement(){
    this.context.commit('deleteAPageElement');
  }

  get editedComponentRef(): PageData {
    return this._editedComponentRef
  }

  get showEditDelete(): boolean {
    return this._showEditDelete
  }

  get pageElements(): PageData[] {
    return this._pageElements
  }

  get nextComponentId():number {
    return this._componentId
  }

}