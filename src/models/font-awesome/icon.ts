export interface IconInterface {
  icon: string;
  prefix: string;
  isImage: boolean;
}
export class Icon implements IconInterface {
  private _isImage: boolean;
  private _icon: string;
  private _prefix: string

  constructor(isImage: boolean, icon: string, prefix: string) {
    this._isImage = isImage;
    this._icon = icon;
    this._prefix = prefix;
  }

  get isImage(): boolean {
    return this._isImage;
  }

  set isImage(isImage: boolean) {
    this._isImage = isImage;
  }

  get icon(): string {
    return this._icon;
  }

  set icon(icon: string) {
    this._icon = icon;
  }

  get prefix(): string {
    return this._prefix;
  }

  set prefix(prefix: string) {
    this._prefix = prefix;
  }
}

export const initIcon = {
  icon: 'meh-blank',
  prefix: 'fas',
  isImage: false,
}

export class IconBuilder {

  buildImageIcon(image: string, prefix: string): IconInterface {
    return { isImage: true , icon: image, prefix: prefix };
  } 

  buildFontAwesomeIcon(icon: string, prefix: string): IconInterface {
    return { isImage: false , icon: icon, prefix: prefix };
  }

  public static buildPlaceholderIcon(): Icon {
    return new Icon(false,  'meh-blank', 'fas');
  }
}
