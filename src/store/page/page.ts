import { Module, VuexModule, MutationAction, Mutation, Action } from 'vuex-module-decorators'
import {  Page } from '@/models/pages/pages.ts';
import { Notification, notificationDefault } from '@/models/notifications/notifications';
import { PageElement, PageContainer, PageData } from '@/models/page/page';




@Module({name: 'PageModule' })
export default class PageModule extends VuexModule {

  _pageElements: PageData [] = [];

  _editedComponentRef!: string;
  _showEditDelete = false;

  @Mutation pushPageElement(element: PageData){
    this._pageElements.push(element)
  }

  @Mutation deleteAPageElement(ref: string) {
    const temp = this._pageElements.filter(element => element.ref !== ref);
    this._pageElements = temp;
  }

  @Mutation clearPageElements() {
    this._pageElements = []
  }

  @Mutation setEditedComponentRef(ref: string) {
    this._editedComponentRef = ref
  }

  @Mutation setShowEditDelete(show: boolean) {
    this._showEditDelete = show
  }

  @Action
  updateEditedComponentRef(ref: string){
    this.context.commit('setEditedComponentRef', ref)
  }

  @Action
  updateShowEditDelete(show: boolean) {
    this.context.commit("setShowEditDelete", show)
  }

  @Action
  addNewPageElement(element: PageData) {
    this.context.commit("pushPageElement", element)
  }

  get editedComponentRef(): string {
    return this._editedComponentRef
  }

  get showEditDelete(): boolean {
    return this._showEditDelete
  }

  get pageElements(): PageData[] {
    return this._pageElements
  }


}