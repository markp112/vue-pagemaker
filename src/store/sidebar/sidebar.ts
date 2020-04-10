
import { Module,  Mutation, Action, VuexModule } from 'vuex-module-decorators'
// import {  EditorComponents, EditorComponentInterface } from '@/models/editor-components/editor-components'
import { ComponentDefinitions, ComponentDefinitionInterface } from '@/models/page/page';
import { Notification, notificationDefault } from '@/models/notifications/notifications';
import firebase from 'firebase';

const SIDEBARCOLLECTION = 'component-definitions';

@Module({name: 'SidebarElements' })
 export default class SidebarModule extends VuexModule {

  _sidebarElements: ComponentDefinitions = new ComponentDefinitions();
  _showSidebar = false;
  

  @Mutation
  addComponent(editorComponent: ComponentDefinitionInterface) {
    this._sidebarElements.add(editorComponent)
  }
  
  @Mutation
  clearComponents() {
    this._sidebarElements = new ComponentDefinitions()
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
      this.context.commit('clearComponents')
      firestore.collection(SIDEBARCOLLECTION).get()
      .then (collection => {
        this.context.commit('clearComponents')
        collection.forEach(sidebarElements => {
          const component: ComponentDefinitionInterface = sidebarElements.data() as ComponentDefinitionInterface;
          this.context.commit('addComponent', component);
        });
        resolve(notification);
      })
    })
  }

  @Action({rawError: true})
  saveEditorElement(editorComponent: ComponentDefinitionInterface): Promise<Notification> {
    const notification: Notification = notificationDefault;
    return new Promise((resolve, reject) => {
      const firestore = firebase.firestore();
      const data = editorComponent;
      firestore.collection(SIDEBARCOLLECTION).doc(data.componentName).set(data)
      .then(() => {
        this.context.commit('addComponent',editorComponent);
        resolve(notification);
      })
      .catch(err => {
        notification.status = "Error";
        notification.message = err;
        reject(notification);
      })
    })
  }

  get sidebarElements(): ComponentDefinitionInterface[] {
    return this._sidebarElements.componentDefinitions();
  }
  
  get componentDefinition():(componentName: string) => ComponentDefinitionInterface | undefined {
    return (componentName: string) =>
      this._sidebarElements.getComponent(componentName)
    } ;
    
  

  get showSidebar(): boolean {
    return this._showSidebar
  }

}