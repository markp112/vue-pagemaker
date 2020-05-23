<template>
  <div
    class="snackbar-wrapper z-50 w-full"
    :class="{'snackbar-show': snackbarContent.show, 'snackbar-hide': !snackbarContent.show }" 
    v-if="snackbarContent.show" 
  >
    <div class= "flex flex-row w-4/12 shadow-xl border-gray-500 border" >
      <div
        class="w-2/12"
        :class="getIndicatorColour"
      >
      .
      </div>
      <div class="w-8/12 p-2 flex flex-col">
        <div class="self-center font-semibold">
          {{ snackbarContent.title }}
        </div>
        <div class="self-start">
          {{ snackbarContent.message }}
        </div>
      </div>
    </div>
  </div>
  
</template>

<script lang="ts">

import Component  from 'vue-class-component';
import { Prop, Vue, Emit } from 'vue-property-decorator';
import { SnackbarMessage, initSnackbarMessage } from '../../../../models/notifications/snackbar';
import { SnackbarModule } from '@/store/snackbar/snackbar';

@Component
export default class Snackbar extends Vue {
  
  get snackbarContent(): SnackbarMessage {
    return SnackbarModule.snackbarMessage;
  }

  get getIndicatorColour(): string {
    return SnackbarModule.snackbarMessage.type;
  }

  updated() {
    setTimeout(() => {
      SnackbarModule.hide();
    }, SnackbarModule.snackbarMessage.duration);
  }
}
</script>

<style lang="postcss">

.snackbar-wrapper {
  position: fixed;
  bottom: 10px;
  left: 50%;
  z-index: 10;
  width: 200px;
}

.snackbar-show {
  opacity: 1;
  visibility: visible;
  -webkit-animation: fadein 0.5s;
  animation: fadein 0.5s;
}

.snackbar-hide {
  opacity: 0;
  visibility: hidden;
  -webkit-animation: fadeout 0.8s;
  animation: fadeout 0.8s;
}

.error {
  background-color: rgb(184, 65, 65);
}

.success {
  background-color: rgb(51, 117, 51);
}

.warning {
  background-color: rgb(196, 134, 21);
}

.info {
  background-color: rgb(54, 54, 151);
}
  

@-webkit-keyframes fadein {
    from {bottom: 0; opacity: 0;} 
    to {bottom: 10px; opacity: 1;}
}

@keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 10px; opacity: 1;}
}

@-webkit-keyframes fadeout {
    from {bottom: 10px; opacity: 1;} 
    to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
    from {bottom: 10px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
}
</style>