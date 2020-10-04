import { Notification } from '@/models/notifications/notifications';
import { SnackbarMessage, SnackbarTypes } from '@/models/notifications/snackbar';
import { SnackbarModule } from '@/store/snackbar/snackbar';
import Vue from 'vue';
import Component from 'vue-class-component';


@Component
export class SnackbarMixin extends Vue {

  showSnackbar(notification: Notification, title: string) {
    const snackbarType: SnackbarTypes = notification.status === "ok" ? SnackbarTypes.Success : SnackbarTypes.Error;
    const snackbarMessage: SnackbarMessage = {
      message:  notification.message,
      title: title,
      type: snackbarType,
      duration: 3000,
      show: true,
     }
    SnackbarModule.showSnackbar(snackbarMessage);
  }

}