
import { Module,  Mutation, Action, VuexModule } from 'vuex-module-decorators'
import {  EditorComponents, EditorComponentInterface } from '@/models/editor-components/editor-components'
import { Notification, notificationDefault } from '@/models/notifications/notifications';
import firebase from 'firebase';

const SIDEBARCOLLECTION = 'sidebar-page-layout';

@Module({name: 'SidebarElements' })
 export default class SidebarModule extends VuexModule {

  _sidebarElements: EditorComponents = new EditorComponents();
  _showSidebar = false;
  

  @Mutation
  addComponent(editorComponent: EditorComponents) {
    this._sidebarElements = editorComponent
  }
  
  @Mutation addUpdateElement(element:EditorComponentInterface) {
    this._sidebarElements.AddorUpdate(element);
  }

  @Mutation
  clearSidebar() {
    this._sidebarElements = new EditorComponents()
  }

  @Mutation
  setSidebarVisibility(toggle: boolean) {
    this._showSidebar = toggle
  }

  @Action ({rawError: true})
  toggleSidebar(toggle: boolean) {
    this.context.commit("setSidebarVisibility", toggle)
  }

  @Action({rawError: true}) 
  loadSideBarElements(): Promise<Notification> {
    const firestore = firebase.firestore();
    const notification: Notification = notificationDefault;
    
    return new Promise((resolve, reject) => {
      this.context.commit('clearSidebar')
      firestore.collection(SIDEBARCOLLECTION).get()
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

  @Action({rawError: true})
  saveEditorElement(editorComponent: EditorComponentInterface): Promise<Notification> {
    const notification: Notification = notificationDefault;
    return new Promise((resolve, reject) => {
      const firestore = firebase.firestore();
      const data = editorComponent;
      firestore.collection(SIDEBARCOLLECTION).doc(data.name).set(data)
      .then(() => {
        this.context.commit('addUpdateElement',editorComponent);
        resolve(notification);
      })
      .catch(err => {
        notification.status = "Error";
        notification.message = err;
        reject(notification);
      })
    })
  }

  get sidebarElements(): EditorComponents {
    return this._sidebarElements;
  }

  get showSidebar(): boolean {
    return this._showSidebar
  }

}