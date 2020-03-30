import { IconInterface, initIcon } from '../font-awesome/icon';

export interface EditorComponentInterface {
  name: string,
  icon: IconInterface
  type: EditorComponentTypes,
}
 interface EditorComponentsInterface {
  editorComponents: EditorComponentInterface [];
}
export enum EditorComponentTypes {
  Image,
  Text,
  Jumbo,
  navBar,
  LinksMenu,
  Button, 
}

export const initEditorComponents: EditorComponentInterface = {
  name: '',
  icon: initIcon,
  type: EditorComponentTypes.Image,
}

export class EditorComponents implements EditorComponentsInterface {
  private _editorComponents: EditorComponentInterface [];
  

  constructor() {
    this._editorComponents =[];
  }

  get editorComponents(): EditorComponentInterface[] {
    return this._editorComponents;
  }

  clear(){
    this._editorComponents = [];
  }

  Add(editorComponent: EditorComponentInterface) {
    this._editorComponents.push(editorComponent);
  }

  get(name: string): EditorComponentInterface {
    const component: EditorComponentInterface = this._editorComponents.filter(component => component.name === name)[0];
    return component;
  }
}