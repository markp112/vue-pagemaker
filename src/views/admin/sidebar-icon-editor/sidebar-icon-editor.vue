<template>
<section class="h-screen overflow-hidden">
  <p class="mt-2 text-center">Side Bar Icon Editor</p>
  <div class="flex flex-row justify-start h-full overflow-hidden">
    <div class=" w-2/12 border-r-2 border-gray-500  flex-wrap mt-8 ml-2">
      <create-new  @onClick="createNew"></create-new>
      <ul class="flex flex-row justify-start align-top mt-4">
        <li v-for="(element,idx) in icons" :key="idx" class="text-2xl w-4/12 cursor-pointer">
          <font-awesome-icon :icon="element.icon.icon" :prefix="element.icon.prefix" @click="iconClicked(idx)"/>
        </li>
      </ul>
    </div>
    <div class="flex flex-col justify-start ml-5 mt-5 w-9/12">
      <form submit.prevent>
        <label for="page-name">Name:</label>
        <input type="text"
          id="icon-name"
          v-model="editorComponent.name"
          class="input-control"
          placeholder="name of the editor component"
        >
        <label for="icon">Select Icon</label>
        <div>
          <span class="h-8 w-8 bg-accent1 text-center font-bold align-middle border cursor-pointer relative inline-block" @click="showIconPicker()">...</span>
            <span>
              <font-awesome-icon v-if="editorComponent.icon !==''" class="ml-2 inline-block text-2xl align-middle"
              :icon="editorComponent.icon.icon" 
              :prefix="editorComponent.icon.prefix" name="icon" ref="icon">
              </font-awesome-icon>
            </span>
          <icon-picker @icon-clicked="iconPickerClick" id="icon-picker" ref="icon-picker"></icon-picker>
        </div>
        <label for="type">Type</label>
        <select name="type" id="type" v-model="editorComponent.type" class="input-control">
          <option v-for="item in componentType" :key="item"  :selected="item == editorComponent.type">{{ item }}</option>
        </select>
        <submit-cancel v-on:cancelClicked="cancelClick()"  v-on:saveClicked="saveClick()" ></submit-cancel>
      </form>
    </div>
  </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import IconPicker from '@/components/base/pickers/icon-picker/icon-picker.vue';
import SubmitCancel from '@/components/base/buttons/submit-cancel/submit-cancel.vue';
import InvalidForm from '@/components/base/notifications/invalid-form.vue';
import { EditorComponentInterface, initEditorComponents, EditorComponentTypes } from '../../../models/editor-components/editor-components'
import { SnackbarMessage, SnackbarTypes, SnackBarGenerator } from '@/models/notifications/snackbar';
import { IconInterface, initIcon } from '@/models/font-awesome/icon';
import { initAuthStatus } from '../../../models/user/user';
import { Notification, notificationDefault } from '../../../models/notifications/notifications';
import CreateNew from '@/components/base/buttons/create-new/create-new.vue'


@Component({
  components:{
    'icon-picker': IconPicker,
    'submit-cancel': SubmitCancel,
    'invalid-form': InvalidForm,
    'create-new': CreateNew,
  }
})
export default class SidebarIconEditor extends Vue {
  name="Sidebar Icon Editor"
  editorComponent = {
    name: '',
    icon: initIcon,
    type: EditorComponentTypes.Image,

  }
  componentType: string[] = [
    'Image',
    'Text',
    'Jumbo',
    'Nav Bar',
    'Links Menu',
    'Button', 
    ]
  

  created(): void {
    this.$store.dispatch('loadSideBarElements');
    this.editorComponent = initEditorComponents;
    this.$store.dispatch('toggleSidebar', false);
  }
  
  iconPickerClick(icon: IconInterface): void {
    this.editorComponent.icon = icon;
  
  }

  showIconPicker(): void {
    this.$store.dispatch('toggleIconPicker', true)
  }
  
  iconClicked(idx: number){
    const tempElement =  this.$store.getters.sidebarElements.editorComponents[idx];
    this.editorComponent = this.$store.getters.sidebarElements.editorComponents[idx];
    this.editorComponent.icon = tempElement.icon;
  }
  createNew():void {
    this.editorComponent = initEditorComponents;
  }
  saveClick(): void {
    this.$store.dispatch('saveEditorElement', this.editorComponent)
    .then(result  => {
        const notification = result as Notification;
        if(notification.status === "ok") {
          const snackbarMessage: SnackbarMessage = SnackBarGenerator.snackbarSuccess(`The ${this.editorComponent.name} has been created`,'Page Saved')
          this.$store.dispatch('showSnackbar', snackbarMessage)
          this.$router.push('/iconeditor')
        } else {
          this.showErrorsnackbar(notification.message, "Error on Save")
        }
      })
  }
  
  showErrorsnackbar(message: string, title: string ) {
      const snackbarMessage = SnackBarGenerator.snackbarError(message ,title)
      this.$store.dispatch('showSnackbar', snackbarMessage)
  }

  get icons(): EditorComponentInterface[] {
    return this.$store.getters.sidebarElements.editorComponents
  }

}

</script>