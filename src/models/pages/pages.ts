import { Icon, IconBuilder } from '../font-awesome/icon';
import { dateFormat } from 'vue-filter-date-format';

export interface PageInterface {
  name: string;
  icon: Icon;
  created: Date;
  edited: Date;
  active: boolean;
}

export class Page implements PageInterface {
  _name: string;
  _icon: Icon;
  _created: Date;
  _edited: Date;
  _active: boolean;

  constructor() {
    this._name = '';
    this._icon = IconBuilder.buildPlaceholderIcon();
    this._created = new Date();
    this._edited = new Date();
    this._active = false;
  }

  get name(): string {
    return this._name;
  }
  set name(name: string) {
    this._name = name;
  }

  get icon(): Icon {
    return this._icon;
  }
  set icon(icon: Icon) {
    this._icon = icon;
  }

  get created(): Date {
    return this._created;
  }
  set created(created: Date) {
    this._created = created;
  }

  get edited(): Date {
    return this._edited;
  }
  set edited(edited: Date) {
    this._edited = edited;
  }

  get active(): boolean {
    return this._active;
  }

  set active(active: boolean) {
    this._active = active;
  }

  get createdFormatted(): string {
    return dateFormat(this._created, 'DD mmm YYYY');
  }

  getPageDataAsObject(): PageInterface {
    const page = {
      name: this._name,
      icon: this._icon,
      created: this._created,
      edited: this.edited,
      active: this.active,
    };
    return page;
  }
}
