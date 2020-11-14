<template>
<section class="h-screen overflow-hidden">
  <p class="mt-2 text-center">Side Bar Icon Editor</p>
  <div class="flex flex-row justify-start h-full overflow-hidden">
    <div class=" w-2/12 border-r-2 border-gray-500  flex-wrap mt-8 ml-2">
      <create-new  @onClick="createNew"></create-new>
      <ul class="flex flex-row justify-start flex-wrap align-top mt-4">
        <li v-for="(element,idx) in icons" :key="idx" class="text-2xl w-4/12 cursor-pointer">
          <icon-image 
            :icon="element.sidebarIcon" 
            @iconClick="iconClicked"
            >
          </icon-image>
        </li>
      </ul>
    </div>
    <div class="flex flex-col justify-start ml-5 mt-5 w-9/12">
      <form submit.prevent>
        <label for="page-name">Name:</label>
        <input type="text"
          id="icon-name"
          v-model="editorComponent.componentName"
          class="input-control"
          placeholder="name of the editor component"
        >
        <label for="htmlTag">HTML Tag:</label>
        <input type="text"
          id="htmlTag"
          v-model="editorComponent.componentRef"
          class="input-control"
          placeholder="HtmlTag for component on page container or generic"
        >
        <label for="icon">Select Icon</label>
        <div>
          <span class="h-8 w-8 bg-accent1 text-center font-bold align-middle border cursor-pointer relative inline-block" @click="showIconPicker()">...</span>
            <span>
              <div v-if="editorComponent.sidebarIcon.icon !==''" class="inline-block">
                <icon-image :icon="iconLocal" classDef="ml-2 inline-block text-2xl align-middle"></icon-image>
              </div>
            </span>
          <icon-picker @icon-clicked="iconPickerClick" id="icon-picker" ref="icon-picker"></icon-picker>
        </div>
        <label for="type">Type</label>
        <select name="type" id="type" v-model="editorComponent.type" class="input-control">
          <option v-for="item in componentType" :key="item"  :selected="item == editorComponent.type">{{ item }}</option>
        </select>
        <label for="classDefinition">Class:</label>
        <input type="text"
          id="classDefinition"
          v-model="classDef"
          class="input-control"
          placeholder="css classes to define the component"
        >
        <div class="dimensions">
          <label for="type">Width</label>
          <input type="text"
            id="width"
            v-model="editorComponent.boxDimensions.width.value"
            class="input-control"
            placeholder="width as a number"
          >
          <label for="type">Units</label>
          <input type="text"
            id="width-units"
            v-model="editorComponent.boxDimensions.width.units"
            class="input-control"
            placeholder="px | % | em"
          >
          <label for="type">Height</label>
          <input type="text"
            id="height"
            v-model="editorComponent.boxDimensions.height.value"
            class="input-control"
            placeholder="width as a number"
          >
          <label for="type">Units</label>
          <input type="text"
            id="height-units"
            v-model="editorComponent.boxDimensions.height.units"
            class="input-control"
            placeholder="px | % | em"
          >
        </div>
        <div class="dimensions">
          <label for="type">Left</label>
          <input type="text"
            id="left"
            v-model="editorComponent.boxDimensions.left.value"
            class="input-control"
            placeholder="width as a number"
          >
          <label for="type">Units</label>
          <input type="text"
            id="left-units"
            v-model="editorComponent.boxDimensions.left.units"
            class="input-control"
            placeholder="px | % | em"
          >
          <label for="type">Top</label>
          <input type="text"
            id="top"
            v-model="editorComponent.boxDimensions.top.value"
            class="input-control"
            placeholder="width as a number"
          >
          <label for="type">Units</label>
          <input type="text"
            id="top-units"
            v-model="editorComponent.boxDimensions.top.units"
            class="input-control"
            placeholder="px | % | em"
          >
        </div>
        <label for="isContainer">Container:</label>
        <input type="checkbox" name="isContainer" id="active" :value="editorComponent.isContainer" class="mt-5 w-1/12" v-model="editorComponent.isContainer">
        <submit-cancel v-on:cancelClicked="cancelClick()"  v-on:saveClicked="saveClick()" ></submit-cancel>
      </form>
      <p class="w-full bg-gray-400 mt-2 p-2 text-accent-600 text-center font-bold">Component Preview</p>
      <div class="relative bg-gray-300">
        <div class="mt-2 absolute" :class="classDef" :style="getStyles">Component</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import IconPicker from '@/components/base/pickers/icon-picker/icon-picker.vue';
import SubmitCancel from '@/components/base/buttons/submit-cancel/submit-cancel.vue';
import InvalidForm from '@/components/base/notifications/invalid-form.vue';
import { SnackbarMessage, SnackbarTypes, SnackBarGenerator } from '@/models/notifications/snackbar';
import { initIcon, IconInterface } from '@/models/font-awesome/icon';
import { initAuthStatus } from '../../../models/user/user';
import { 
  Notification,
  notificationDefault
} from '../../../models/notifications/notifications';
import CreateNew from '@/components/base/buttons/create-new/create-new.vue';
import { 
  ComponentDefinitionInterface,
  initComponentDefinition,
  ComponentDefinition,
} from '@/models/components/base-component';
import { SidebarModule } from '@/store//sidebar/sidebar';
import { ComponentPropsModule } from '@/store/component-props/component-props';
import { SnackbarModule } from '@/store/snackbar/snackbar';
import  IconImage from '@/components/base/icon-image/icon-image.vue';
import { BoxDimensions } from '../../../models/components/box-dimension';
import { ComponentTypesArray } from '@/models/components/base-component';

@Component({
  components:{
    'icon-picker': IconPicker,
    'icon-image': IconImage,
    'submit-cancel': SubmitCancel,
    'invalid-form': InvalidForm,
    'create-new': CreateNew,
  }
})
export default class SidebarIconEditor extends Vue {
  name = 'Sidebar Icon Editor';
  classDef = '';
  iconLocal: IconInterface = initIcon;
  editorComponent: ComponentDefinition = new ComponentDefinition();
  componentType = ComponentTypesArray;

  created(): void {
    SidebarModule.loadSideBarElements();
    SidebarModule.toggleSidebar(false);
  }

  getPath(image: string): string {
    const path = require.context('@/assets/icons',false,/\.png$/);
    return path(`./${image}`);
  }

  iconPickerClick(icon: IconInterface): void {
    this.iconLocal = icon;
    this.editorComponent.sidebarIcon = icon;
  }

  showIconPicker(): void {
    ComponentPropsModule.toggleIconPicker(true);
  }

  iconClicked(icon: IconInterface) {
    const component: ComponentDefinitionInterface = SidebarModule.getSidebarAllIcons.filter(element => element.sidebarIcon.icon === icon.icon)[0];
    this.editorComponent.componentName = component.componentName;
    this.editorComponent.componentRef = component.componentRef;
    this.editorComponent.class = component.class;
    this.editorComponent.isContainer = component.isContainer;
    this.editorComponent.sidebarIcon = component.sidebarIcon;
    this.editorComponent.type = component.type;
    this.editorComponent.boxDimensions = new BoxDimensions(
      component.boxDimensions.width, 
      component.boxDimensions.height, 
      component.boxDimensions.left, 
      component.boxDimensions.top,
      component.boxDimensions.borderWidthLeft,
      component.boxDimensions.borderWidthRight,
      component.boxDimensions.padding
    );
    this.iconLocal = icon;
    this.classDef = this.editorComponent.class;
  }

  createNew(): void {
    this.editorComponent = new ComponentDefinition();
  }

  saveClick(): void {
    this.editorComponent.class = this.classDef;
    const component: ComponentDefinitionInterface = this.editorComponent.toObject as ComponentDefinitionInterface;
    SidebarModule.saveEditorElement(component)
    .then(result  => {
      const notification = result as Notification;
      if(notification.status === "ok") {
        const snackbarMessage: SnackbarMessage = SnackBarGenerator.snackbarSuccess(`The ${this.editorComponent.componentName} has been created`,'Page Saved');
        SnackbarModule.showSnackbar(snackbarMessage);
        this.$router.push('/iconeditor');
      } else {
        this.showErrorsnackbar(notification.message, "Error on Save");
      }
    })
  }

  showErrorsnackbar(message: string, title: string): void {
    const snackbarMessage = SnackBarGenerator.snackbarError(message ,title);
    SnackbarModule.showSnackbar(snackbarMessage);
  }

  get icons(): ComponentDefinitionInterface[] {
    return SidebarModule.getSidebarAllIcons;
  }

  get getStyles(): string {
    const boxDimension: BoxDimensions = this.editorComponent.boxDimensions;
    return boxDimension.getDimensionsAsStyleString;
  }
}

</script>

<style lang="postcss" scoped>
.dimensions {
  @apply flex flex-row justify-start flex-wrap w-full;
}

.dimensions input {
  @apply w-16 mt-2;
}

.dimensions label { 
  @apply w-12 ml-2 inline-block;
}
</style>
