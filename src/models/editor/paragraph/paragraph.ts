import Guid from "@/utils//guid";

export class Paragraph {
  _hasUnderline: boolean;
  _id = "";

  constructor(hasUnderline: boolean, id = Guid.newSmallGuid()) {
    this._hasUnderline = hasUnderline;
    this._id = id;
  }

  get hasUnderline(): boolean {
    return this._hasUnderline;
  }

  set hasUnderline(hasUnderline: boolean) {
    this._hasUnderline = hasUnderline;
  }

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }
}
