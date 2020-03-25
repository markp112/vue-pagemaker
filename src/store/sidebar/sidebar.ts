
import { Module,  Mutation, Action, VuexModule } from 'vuex-module-decorators'
import {   EditorComponents, EditorComponentInterface } from '@/models/editor-components/editor-components'
import { Notification, notificationDefault } from '@/models/notifications/notifications';
import firebase from 'firebase';



@Module({name: 'SidebarElements' })
 export default class SidebarModule extends VuexModule {

  _sidebarElements: EditorComponents = new EditorComponents();


  @Mutation
  addComponent(editorComponent: EditorComponentInterface) {
    this._sidebarElements.Add(editorComponent);
  }

  @Mutation
  clear() {
    this._sidebarElements.clear();
  }

  @Action({rawError: true}) 
  loadSideBarElements(): Promise<Notification> {
    const firestore = firebase.firestore();
    const notification: Notification = notificationDefault;
    const sidebarCollection = 'sidebar-page-layout'
    return new Promise((resolve, reject) => {
      this.context.commit('clear')
      firestore.collection(sidebarCollection).get()
      .then (collection => {
        collection.forEach(sidebarElements => {
          const component: EditorComponentInterface = sidebarElements.data() as EditorComponentInterface;
          this.context.commit('addComponent', component);
        });
        resolve(notification);
      })
    })
  }

  get sidebarElements(): EditorComponents {
    return this._sidebarElements;
  }

}