// Controls the sidebar
import store from '@/store';
import { Module, Mutation, Action, VuexModule, getModule } from 'vuex-module-decorators';
import {  PageData} from '@/models/page/page';
import {  
  ComponentDefinitions,
  ComponentDefinitionInterface
} from '@/models/components/base-component'
import {
  Notification,
  notificationDefault,
} from '@/models/notifications/notifications';
import  { PageModule } from '@/store/page/page';
import firebase from 'firebase';
import { 
  ComponentTypesEnum,
  enumerate 
} from '@/models/enums/componentTypes/componentTypes';

const SIDEBARCOLLECTION = 'component-definitions';

export type sidebarComponents =
  'image-editor'
  | 'sidebar-components'
  | 'container-editor';

export interface SidebarStateInterface {
  _sidebarElements: ComponentDefinitions,
  _showSidebar: boolean,
  _sidebarComponent: sidebarComponents,
}

@Module({ dynamic: true, name: 'sidebar', store })
class SidebarStore extends VuexModule implements SidebarStateInterface {
  _sidebarElements: ComponentDefinitions = new ComponentDefinitions();
  _showSidebar = false;
  _sidebarComponent: sidebarComponents = 'sidebar-components';

  @Mutation
  private addComponent(editorComponent: ComponentDefinitionInterface) {
    this._sidebarElements.add(editorComponent);
  }

  @Mutation
  private clearComponents() {
    this._sidebarElements = new ComponentDefinitions();
  }

  @Mutation
  private setSidebarVisibility(toggle: boolean) {
    this._showSidebar = toggle;
  }

  @Mutation
  private setSidebarEditor(component: sidebarComponents) {
    this._sidebarComponent = component;
  }

  @Action({ rawError: true })
  public toggleSidebar(toggle: boolean) {
    this.context.commit('setSidebarVisibility', toggle);
  }

  @Action({ rawError: true })
  public loadSideBarElements(): Promise<Notification> {
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
  public saveEditorElement(editorComponent: ComponentDefinitionInterface): Promise<Notification> {
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
  public updateSidebarEditor() {
    const componentType: PageData | undefined = PageModule.editedComponentRef;
    if (componentType) {
      const whichComponentType: ComponentTypesEnum = enumerate[componentType.type];
      console.log('%c%s', 'color: #00e600', whichComponentType);

      switch (whichComponentType) {
        case ComponentTypesEnum.image:
          console.log("is Image")
          this.context.commit('setSidebarEditor', 'image-editor' as sidebarComponents);
          break;
        case ComponentTypesEnum.text:
          this.context.commit('setSidebarEditor', 'text-editor' as sidebarComponents);
          break;
        case ComponentTypesEnum.jumbo || ComponentTypesEnum.pageTemplate || ComponentTypesEnum.groupingContainer || ComponentTypesEnum.navBar :
          this.context.commit('setSidebarEditor', 'container-editor' as sidebarComponents);
          break;
      }
    }
  }

  @Action
  public closeEditor() {
    const sidebarComponent: sidebarComponents = 'sidebar-components';
    this.context.commit('setSidebarEditor', sidebarComponent);
  }

 get getSidebarElements(): ComponentDefinitionInterface[] {
    return this._sidebarElements.componentDefinitions();
  }

   get getComponentDefinition(): (componentName: string)
    => ComponentDefinitionInterface | undefined {
    return (componentName: string) =>
      this._sidebarElements.getComponent(componentName);
  }

  public get showSidebar(): boolean {
    return this._showSidebar;
  }

  get sidebarComponentType(): string {
    return this._sidebarComponent;
  }
}

export const SidebarModule = getModule(SidebarStore);