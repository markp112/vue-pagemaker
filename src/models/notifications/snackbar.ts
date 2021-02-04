export enum SnackbarTypes {
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
  Success = 'success',
}

export interface SnackbarMessage {
  message: string;
  title: string;
  type: SnackbarTypes;
  duration: number;
  show: boolean;
}

export const initSnackbarMessage: SnackbarMessage = {
  message: '',
  title: '',
  type: SnackbarTypes.Success,
  duration: 5000,
  show: false,
}

export class SnackBarGenerator {
  static _snackBar: SnackbarMessage = initSnackbarMessage;

  private static setBaseProperties(message: string, title: string, duration?: number): void {
    this._snackBar.message = message;
    this._snackBar.title = title;
    this._snackBar.duration = duration === undefined ? 5000 : duration;
    this._snackBar.show = true;
  }

  static snackbarError(title: string, message: string, duration?: number ): SnackbarMessage {
    this.setBaseProperties(message, title, duration);
    this._snackBar.type = SnackbarTypes.Error;
    return this._snackBar;
  }

  static snackbarInfo(title: string, message: string, duration?: number ): SnackbarMessage {
    this.setBaseProperties(message, title, duration);
    this._snackBar.type = SnackbarTypes.Info;
    return this._snackBar;
  }

  static snackbarSuccess(title: string, message: string, duration?: number ): SnackbarMessage {
    this.setBaseProperties(message, title, duration);
    this._snackBar.type = SnackbarTypes.Success;
    return this._snackBar;
  }

  static snackbarWarning(title: string, message: string, duration?: number ): SnackbarMessage {
    this.setBaseProperties(message, title, duration);
    this._snackBar.type = SnackbarTypes.Warning;
    return this._snackBar;
  }
}