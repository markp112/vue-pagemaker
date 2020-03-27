import { IconInterface, initIcon } from '../font-awesome/icon';

export interface PageInterface {
  name: string
  icon: IconInterface
  created: Date
  edited: Date
  active: boolean

}

export class Page implements PageInterface {
  _name: string
  _icon: IconInterface
  _created: Date
  _edited: Date
  _active: boolean
  
  constructor(){
    this._name = '';
    this._icon = initIcon;
    this._created = new Date();
    this._edited = new Date();
    this._active = false;
  }

  get name (): string {
    return this._name
  }
  set name( name: string ) {
    this._name = name
  }

  get icon (): IconInterface {
    return this._icon
  }
  set icon(icon: IconInterface) {
    this._icon = icon
  }

  get created(): Date {
    return this._created
  }
  set created( created: Date) {
    this._created = created
  }

  get edited(): Date {
    return this._edited
  }
  set edited( edited: Date) {
    this._edited = edited
  }

  get active(): boolean {
    return this._active
  }

  set active(active: boolean) {
    this._active = active;
  }

  getPageDataAsObject():PageInterface {
    const page = {
      name: this._name,
      icon: this._icon,
      created: this._created,
      edited: this.edited,
      active: this.active,
    }
    return page;
  }
}