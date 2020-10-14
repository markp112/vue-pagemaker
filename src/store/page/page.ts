import store from '@/store';
import {
  Module,
  Mutation,
  Action,
  VuexModule,
  getModule,
} from 'vuex-module-decorators';
import {
  PageData,
  StyleTypes,
} from '@/models/page/page';
import {
  PageElement
} from "@/classes/page-element/PageElement";
import { ComponentContainer } from "@/classes/page-element/ComponentContainer";
import { Style } from '@/models/styles/styles';
import {
  ComponentTypesString,
  ActionEvent 
} from '@/models/components/base-component';
import { BoxDimensionsInterface } from '@/models/components/box-dimension';
import { Image } from '@/models/components/components';
import { PageElementClasses } from '@/classes/page-element/factory/page-element-factory';

export interface PageStateInterface {
  // _pageElements: PageData[];
  _pageElements: PageElementClasses[];

  _editedComponentRef: ComponentContainer | PageElement | undefined;
  _showEditDelete: boolean;
  _selectedComponent: string;
}

@Module({ name: 'pagestore', store, dynamic: true })
class PageStore extends VuexModule implements PageStateInterface {
  ROOT = 'ROOT';
  //stores all the elements that make up a page
  // public _pageElements: PageData[] = [];
  public _pageElements: PageElementClasses[] = [];
  // reference to the component currently being edited
  public _editedComponentRef:
    | ComponentContainer
    | PageElement
    | undefined = undefined;
  // show the toolbar for selecting edit // delete
  public _showEditDelete = false;
  // used to ensure only one component can be selected in the UI
  public _selectedComponent = '';

  @Mutation
  private pushPageElement(element: PageElementClasses): void {
    if (element) {
      console.log('%c⧭', 'color: #f863c6', element, "eleemtn");
      if (element.parentRef === this.ROOT) {
        this._pageElements.push(element);
      } else { // component is nested within another
        if (this._pageElements.length > 0) {
          const parentElement = this._pageElements.filter(
              elem => { 
                if (elem) {
                  return elem.ref === element.parentRef;
                }
              })[0] as ComponentContainer;
          parentElement.addNewElement(element);
        }
      }
    }
  }

  @Mutation
  private deleteAPageElement(): void {
    if (this._editedComponentRef) {
      if (this._editedComponentRef.parentRef === this.ROOT) {
        this._pageElements = this._pageElements.filter(element => {
          if (this._editedComponentRef) {
            if (element) {
              return element.ref !== this._editedComponentRef.ref;
            }
          }
        });
      } else {
        const parentComponent = this._editedComponentRef.parent;
        (parentComponent as ComponentContainer)
          .deleteElement(this._editedComponentRef.ref);
      }
    }
  }

  @Mutation
  private setEditedComponentStyles(newStyle: Style) {
    if (this._editedComponentRef) {
      this._editedComponentRef.addStyle(newStyle);
    }
  }

  @Mutation
  private removeEditedComponentStyle(styleToRemove: StyleTypes) {
    if (this._editedComponentRef) {
      this._editedComponentRef.removeStyle(styleToRemove);
    }
  }

  /** Add a class to the component currently being edited
   * classDef name of the Tailwind class to be added
  */
  @Mutation
  private setEditedComponentClass(classDef: string) {
    if (this._editedComponentRef) {
      const component: PageData = this._editedComponentRef as PageData;
      if (component) {
        component.addClass(classDef);
      }
    }
  }

  /** remove a class from the edited component class list
   * classDef name of the Tailwind class to be removed -
   */
  @Mutation
  private removeEditedComponentClass(classDef: string) {
    if (this._editedComponentRef) {
      const component: PageData = this._editedComponentRef as PageData;
      if (component) {
        component.removeClass(classDef);
      }
    }
  }

  /**clearPageElements - clear out all components on the current page */
  @Mutation
  private clearPageElements(): void {
    this._pageElements = [];
  }

  @Mutation
  private setEditedComponentRef(ref: PageData): void {
    this._editedComponentRef = ref;
    this._selectedComponent = ref.ref;
  }

  @Mutation
  private setShowEditDelete(show: boolean): void {
    this._showEditDelete = show;
  }

  @Mutation
  private setComponentImage(image: Image): void {
    if (this._editedComponentRef) {
      if (this._editedComponentRef.data) {
        const componentType: ComponentTypesString = this._editedComponentRef.type;
        if (componentType === 'image') {
          image.parentDimensions.width = this._editedComponentRef.parent.boxDimensions.width.value;
          image.parentDimensions.height = this._editedComponentRef.parent.boxDimensions.height.value;
          this._editedComponentRef.data = image;
        }
      }
    }
  }

  @Mutation
  private setBoxDimensionsHeightandWidth(newDimensions: BoxDimensionsInterface) {
    if (this._editedComponentRef) {
      this._editedComponentRef.updateBoxHeightandWidth(newDimensions);
    }
  }

  @Mutation
  private setEditedComponentActionEvent(actionEvent: ActionEvent) {
    if (this.editedComponentRef) this.editedComponentRef.actionEvent = actionEvent;
  }
  //#endregion Mutations

  //#region  Actions
  @Action
  public updateEditedComponentRef(element: PageData) {
    this.context.commit('setEditedComponentRef', element);
  }

  @Action
  public updateShowEditDelete(show: boolean) {
    this.context.commit('setShowEditDelete', show);
  }

  @Action
  public addNewPageElement(element: PageElementClasses) {
    this.context.commit('pushPageElement', element);
  }
  // @Action
  // public addNewPageElement(element: PageData) {
  //   this.context.commit('pushPageElement', element);
  // }

  @Action
  public deletePageElement() {
    this.context.commit('deleteAPageElement');
  }

  @Action
  public updateComponentImage(image: Image) {
    this.context.commit('setComponentImage', image);
  }

  @Action
  public updateBoxDimensionHeightandWidth(newDimensions: BoxDimensionsInterface) {
    this.context.commit('setBoxDimensionsHeightandWidth', newDimensions);
  }

  @Action
  public updateParentClassProperties(classDef: string): void {
    if (this.editedComponentRef) {
      const parent = this.editedComponentRef.parent;
      if (parent) {
        parent.addClass(classDef);
      }
    }
  }

  @Action
  public deleteEditedComponentStyle(styleToRemove: StyleTypes): void {
    this.context.commit('removeEditedComponentStyle', styleToRemove);
  }

  @Action
  public updateEditedComponentStyles(newStyle: Style): void {
    this.context.commit('setEditedComponentStyles', newStyle);
  }

  @Action
  public updateComponentClassProperties(classDef: string): void {
    this.context.commit('setEditedComponentClass', classDef);
  }

  @Action
  public deleteClassFromEditedComponent(classDef: string): void {
    this.context.commit('removeEditedComponentClass', classDef);
  }

  @Action
  public updateEditedComponentData(newContent: string): void {
    if (this.editedComponentRef) {
      const component: PageData = this.editedComponentRef as PageData;
      if (component) {
        if (component.data) {
          component.data.content = newContent;
        }
      }
    }
  }

  @Action
  updateEditedComponentActionEvent(actionEvent: ActionEvent) {
    this.context.commit('setEditedComponentActionEvent', actionEvent);
  }

  // #region Actions
  // #region getters
  public get editedComponentRef(): PageData | undefined {
    return this._editedComponentRef;
  }

  public get editComponentData(): string {
    if (this._editedComponentRef) {
      return this._editedComponentRef.data !== undefined
        ? this._editedComponentRef.data.content
        : '';
    }
    return '';
  }

  public get showEditDelete(): boolean {
    return this._showEditDelete;
  }

  public get pageElements(): PageElementClasses[] {
    return this._pageElements.sort(this.compare);
  }

  public get selectedComponent(): string {
    return this._selectedComponent;
  }

  private compare(a: PageElementClasses, b: PageElementClasses) {
    if (a && b) {
      if (a.id > b.id) return 1;
      if (a.id < b.id) return -1;
    }
    return 0;
  }
}

export const PageModule = getModule(PageStore);
