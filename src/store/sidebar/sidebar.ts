// Controls the sidebar

import { Module, Mutation, Action, VuexModule } from 'vuex-module-decorators';
import {
  ComponentDefinitions,
  ComponentDefinitionInterface,
  PageData,
} from '@/models/page/page';
import {
  Notification,
  notificationDefault,
} from '@/models/notifications/notifications';
import  PageModule from '@/store/page/page'
import firebase from 'firebase';
import store from '@/store';

const SIDEBARCOLLECTION = 'component-definitions';
type sidebarComponents = 'image-editor'
  | 'sidebar-components'
  | 'container-editor';

@Module({ name: 'sidebar', store })
export default class SidebarModule extends VuexModule {
  _sidebarElements: ComponentDefinitions = new ComponentDefinitions();
  _showSidebar = false;
  _sidebarComponent: sidebarComponents = 'sidebar-components';

  @Mutation
  addComponent(editorComponent: ComponentDefinitionInterface) {
    this._sidebarElements.add(editorComponent);
  }

  @Mutation
  clearComponents() {
    this._sidebarElements = new ComponentDefinitions();
  }

  @Mutation
  setSidebarVisibility(toggle: boolean) {
    this._showSidebar = toggle;
  }

  @Mutation
  setSidebarEditor(component: sidebarComponents) {
    this._sidebarComponent = component;
  }

  @Action({ rawError: true })
  toggleSidebar(toggle: boolean) {
    this.context.commit('setSidebarVisibility', toggle);
  }

  @Action({ rawError: true })
  loadSideBarElements(): Promise<Notification> {
    const firestore = firebase.firestore();
    const notification: Notification = notificationDefault;
    return new Promise((resolve, reject) => {
      this.context.commit('clearComponents');
      firestore.collection(SIDEBARCOLLECTION)
        .get()
        .then(collection => {
          this.context.commit('clearComponents');
          collection.forEach(sidebarElements => {
            const component: ComponentDefinitionInterface = sidebarElements.data() as ComponentDefinitionInterface;
            this.context.commit('addComponent', component);
          });
          resolve(notification);
        })
        .catch(err => {
          notification.message = err;
          notification.status = 'Error';
          reject(notification);
        });
    });
  }

  @Action({ rawError: true })
  saveEditorElement(editorComponent: ComponentDefinitionInterface): Promise<Notification> {
    const notification: Notification = notificationDefault;
    return new Promise((resolve, reject) => {
      const firestore = firebase.firestore();
      const data = editorComponent;
      firestore.collection(SIDEBARCOLLECTION)
        .doc(data.componentName)
        .set(data)
          .then(() => {
            this.context.commit('addComponent',editorComponent);
            resolve(notification);
          })
          .catch(err => {
            notification.status = 'Error';
            notification.message = err;
            reject(notification);
          })
    })
  }

  @Action({ rawError: true })
  updateSidebarEditor() {
    const componentType: PageData = this.context.rootGetters.editedComponentRef;
    console.log("Store = ", store.getters.editedComponentRef)
    console.log('%c⧭', 'color: #733d00', this.context.rootGetters.editedComponentRef);
    console.log('%c⧭', 'color: #e50000', componentType);
    let whichComponentType = '';
    if (componentType.isContainer) {
      whichComponentType = 'container'; 
    } else {
      whichComponentType = componentType.type;
    }
      console.log('%c%s', 'color: #aa00ff', whichComponentType);

    switch (whichComponentType) {
      case 'Image':
        this.context.commit('setSidebarEditor', 'image-editor' as sidebarComponents);
        break;
      case 'container':
        this.context.commit('setSidebarEditor', 'container-editor' as sidebarComponents);
        break;
    }
  }

  @Action
  closeEditor() {
    const sidebarComponent: sidebarComponents = 'sidebar-components';
    this.context.commit('setSidebarEditor', sidebarComponent);
  }

  get sidebarElements(): ComponentDefinitionInterface[] {
    return this._sidebarElements.componentDefinitions();
  }

  get componentDefinition(): (componentName: string)
    => ComponentDefinitionInterface | undefined {
    return (componentName: string) =>
      this._sidebarElements.getComponent(componentName);
  }

  get showSidebar(): boolean {
    return this._showSidebar;
  }

  get sidebarComponentType(): string {
    return this._sidebarComponent;
  }
}