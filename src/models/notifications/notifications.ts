export type statusCodes = 'ok' | 'Error';

export interface Notification {
  status: statusCodes;
  message: string;
}

export const notificationDefault: Notification =  { status : 'ok', message: '' };
