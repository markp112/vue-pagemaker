export interface NavMenuInterface {
  id: number;
  navText: string;
  navLink: string;
}

export class NavMenuItem implements NavMenuInterface {
  _id: number;
  _navText: string;
  _navLink: string;

  constructor(id: number, navText: string, navLink: string) {
    this._id = id;
    this._navLink = navLink;
    this._navText = navText;
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
}
