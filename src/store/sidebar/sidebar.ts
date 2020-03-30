
import { Module,  Mutation, Action, VuexModule } from 'vuex-module-decorators'
import {  EditorComponents, EditorComponentInterface } from '@/models/editor-components/editor-components'
import { Notification, notificationDefault } from '@/models/notifications/notifications';
import firebase from 'firebase';



@Module({name: 'SidebarElements' })
 export default class SidebarModule extends VuexModule {

  _sidebarElements: EditorComponents = new EditorComponents();


  @Mutation
  addComponent(editorComponent: EditorComponents) {
    this._sidebarElements = editorComponent
  }

  @Mutation
  clearSidebar() {
    console.log("Clear called")
    this._sidebarElements = new EditorComponents()
  }

  @Action({rawError: true}) 
  loadSideBarElements(): Promise<Notification> {
    const firestore = firebase.firestore();
    const notification: Notification = notificationDefault;
    const sidebarCollection = 'sidebar-page-layout'
    return new Promise((resolve, reject) => {
      this.context.commit('clearSidebar')
      firestore.collection(sidebarCollection).get()
      .then (collection => {
        const editorComponent = new EditorComponents();
        collection.forEach(sidebarElements => {
          const component: EditorComponentInterface = sidebarElements.data() as EditorComponentInterface;
          editorComponent.Add(component);
        });
        this.context.commit('addComponent', editorComponent);
        resolve(notification);
      })
    })
  }

  get sidebarElements(): EditorComponents {
    return this._sidebarElements;
  }

}