export type statusCodes =
 | 'ok'
 | 'Error';
export type defaultNotificationMessages = 
| 'Sucess'
| string;

export interface Notification {
  status: statusCodes;
  message: defaultNotificationMessages;
}

export const notificationDefault: Notification =  { status : 'ok', message: '' };
