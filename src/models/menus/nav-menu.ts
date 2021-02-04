export interface IsVisible {
  (): boolean;
}

export interface NavMenuInterface {
  id: number;
  navText: string;
  navLink: string;
  isVisible?: IsVisible;
}

export class NavMenuItem implements NavMenuInterface {
  _id: number;
  _navText: string;
  _navLink: string;
  _isVisible: IsVisible

  constructor(id: number, navText: string, navLink: string, isVisible =() => {return true}) {
    this._id = id;
    this._navLink = navLink;
    this._navText = navText;
    this._isVisible = isVisible;
  }

  get navLink(): string {
    return this._navLink;
  }

  get navText(): string {
    return this._navText;
  }

  get id(): number {
    return this._id;
  }

  get isVisible(): IsVisible {
    return this._isVisible;
  }
}
