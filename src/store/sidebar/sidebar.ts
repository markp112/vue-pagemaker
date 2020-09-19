// Controls the sidebar
import store from '@/store';
import {
  Module,
  Mutation,
  Action,
  VuexModule,
  getModule
} from 'vuex-module-decorators';
import { PageData } from '@/models/page/page';
import { SidebarComponents } from '@/classes/sidebar-toolbar/sidebar-toolbar-buidler';
import {  
  ComponentDefinitions,
  ComponentDefinitionInterface,
  ComponentTypesString
} from '@/models/components/base-component';
import {
  Notification,
  notificationDefault,
} from '@/models/notifications/notifications';
import  { PageModule } from '@/store/page/page';
import firebase from 'firebase';

const SIDEBARCOLLECTION = 'component-definitions';

export interface SidebarStateInterface {
  _sidebarElements: ComponentDefinitions;
  _showSidebar: boolean;
  _sidebarComponent: SidebarComponents;
  _showTextModal: boolean;
}

@Module({ dynamic: true, name: 'sidebar', store })
class SidebarStore extends VuexModule implements SidebarStateInterface {
  _sidebarElements: ComponentDefinitions = new ComponentDefinitions();
  _showSidebar = false;
  _sidebarComponent: SidebarComponents = 'sidebar-components';
  _showTextModal = false;

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
  private setSidebarEditor(component: SidebarComponents) {
    this._sidebarComponent = component;
  }

  @Mutation
  private setShowTextModal(show: boolean) {
    this._showTextModal = show;
  }

  @Action({ rawError: true })
  public toggleSidebar(toggle: boolean) {
    this.context.commit('setSidebarVisibility', toggle);
  }

  /**
   * @description loads the icons for the page builder side bar e.g. button, jumbo etc
   */
  @Action({ rawError: true })
  public loadSideBarElements(): Promise<Notification> {
    const firestore = firebase.firestore();
    const notification: Notification = notificationDefault;
    return new Promise((resolve, reject) => {
      this.context.commit('clearComponents');
      firestore
        .collection(SIDEBARCOLLECTION)
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
      firestore
        .collection(SIDEBARCOLLECTION)
        .doc(data.componentName)
        .set(data)
          .then(() => {
            this.context.commit('addComponent', editorComponent);
            resolve(notification);
          })
          .catch(err => {
            notification.status = 'Error';
            notification.message = err;
            reject(notification);
          });
    })
  }

  @Action({ rawError: true })
  /** @description update the side bar menu with the editor linked to the component being edited
   * requires that the PageModule.editedComponetRef is set
   */
  public updateSidebarEditor() {
    const componentType: PageData | undefined = PageModule.editedComponentRef;
    if (componentType) {
      const whichComponentType: ComponentTypesString = componentType.type;
      switch (whichComponentType) {
        case 'image':
          this.context.commit('setSidebarEditor', 'image-editor' as SidebarComponents);
          break;
        case 'text':
          this.context.commit('setShowTextModal', true);
          break;
        case 'jumbo':
          this.context.commit('setSidebarEditor', 'container-editor' as SidebarComponents);
          break;
        case 'pageTemplate':
          this.context.commit('setSidebarEditor', 'container-editor' as SidebarComponents);
          break;
        case 'groupingContainer':
          this.context.commit('setSidebarEditor', 'container-editor' as SidebarComponents);
          break;
        case 'navBar':
          this.context.commit('setSidebarEditor', 'container-editor' as SidebarComponents);
          break;
        case 'button':
          this.context.commit('setSidebarEditor', 'button-editor');
          break;
      }
    }
  }

  @Action
  /** @description sets the side bar menu to the passed in string
   * @params sidebarMenu = name of the menu to show based on type of SidebarComponents
   */
  public setSidebarMenuTo(sidebarMenu: SidebarComponents) {
    this.context.commit('setSidebarEditor', sidebarMenu);
  }

  @Action
  public closeEditor() {
    const sidebarComponent: SidebarComponents = 'sidebar-components';
    this.context.commit('setSidebarEditor', sidebarComponent);
  }
 
  @Action
  public updateShowTextModal(show: boolean) {
    this.context.commit("setShowTextModal", show);
  }

  get getSidebarElements(): ComponentDefinitionInterface[] {
    return this._sidebarElements.componentDefinitions().filter(elem => elem.isContainer === false);
  }

  get getSidebarContainers(): ComponentDefinitionInterface[] {
    return this._sidebarElements.componentDefinitions().filter(elem => elem.isContainer === true);
  }

  get getSidebarAllIcons(): ComponentDefinitionInterface[] {
    return this._sidebarElements.componentDefinitions();
  }

  get getComponentDefinition():
    (componentName: string)
    => ComponentDefinitionInterface | undefined {
    return (componentName: string) =>
      this._sidebarElements.getComponent(componentName);
  }

  get showSidebar(): boolean {
    return this._showSidebar;
  }

  get sidebarComponentType(): SidebarComponents {
    return this._sidebarComponent;
  }

  get showTextModal(): boolean {
    return this._showTextModal;
  }
}

export const SidebarModule = getModule(SidebarStore);
