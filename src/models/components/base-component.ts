import { IconInterface, initIcon } from '../font-awesome/icon';
import { ComponentTypes } from '../components/components';
import { BoxDimensions, Dimension } from './box-dimension';

// unique reference for this component when dropped on the page
export type ComponentRef = string;

export type ComponentTypesString = undefined | 'jumbo' | 'button' | 'navBar' | 'pageTemplate' | 'text' | 'image' | 'groupingContainer';
export const ComponentTypesArray = [ 'jumbo' , 'button' , 'navBar', 'pageTemplate', 'text', 'image', 'groupingContainer' ];

export interface ComponentDefinitionInterface {
  //  unique name for this component
  componentName: string;
  // class defintion which controls the layout of this element
  class: string;
  componentRef: ComponentRef; // the html tag used to put this element on the page
  isContainer: boolean; // is a container or component 
  sidebarIcon: IconInterface; // icon for this component
  type: ComponentTypesString; // what is this see types
  boxDimensions: BoxDimensions;
}

export const top: Dimension = new Dimension(0, 'px');
export const left: Dimension = new Dimension(0, 'px');
export const width: Dimension = new Dimension(0, 'px');
export const height: Dimension = new Dimension(0, 'px');

export const initComponentDefinition = {
  componentName: '',
  class: '',
  componentRef: '',
  isContainer: false,
  sidebarIcon: initIcon,
  type: undefined,
  boxDimensions: new BoxDimensions(width, height, top, left),
  
}

export class ComponentDefinition implements ComponentDefinitionInterface {
  componentName = '';
  class = '';
  componentRef: ComponentRef = 'generic';
  isContainer = false;
  sidebarIcon: IconInterface = initIcon;
  type: ComponentTypesString = undefined;
  boxDimensions: BoxDimensions = new BoxDimensions(width, height, top, left);

  get toObject(): Record<string, any> {
    return {
      componentName: this.componentName,
      class: this.class,
      isContainer: this.isContainer,
      sidebarIcon: this.sidebarIcon,
      componentRef: this.componentRef,
      type: this.type,
      boxDimensions: this.boxDimensions.toObject
    };
  }
}

export interface ComponentContentInterface extends ComponentDefinitionInterface {
  content: ComponentTypes;     // for when a component needs data e.g. picture element, text etc
}

export type ComponentDefinitionTypes = ComponentDefinitionInterface | ComponentContentInterface;


export class ComponentDefinitions {
  _componentDefinitions: ComponentDefinitionTypes[];

  constructor() {
    this._componentDefinitions = [];
  }

  add(newComponent: ComponentDefinitionTypes): void {
    const component: ComponentDefinitionTypes | undefined = this.getComponent(newComponent.componentName);
    if (component !== undefined) {
      this.delete(component.componentName);
    }
    this._componentDefinitions.push(newComponent);
  }

  delete(componentName: string): void {
    this._componentDefinitions = this._componentDefinitions.filter(
      (component: ComponentDefinitionTypes) => component.componentName !== componentName);
  }

  getComponent(componentName = '', componentRef = ''): ComponentDefinitionTypes | undefined {
    if (componentName === '' && componentRef === '') return;
    if (componentRef !== '') {
      return this._componentDefinitions.filter(comp => comp.componentRef === componentRef)[0];
    } else {
      return this._componentDefinitions.filter(comp => comp.componentName === componentName)[0];
    }
  }

  componentDefinitions(): ComponentDefinitionTypes[] {
    return this._componentDefinitions;
  }
}
