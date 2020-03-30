<template>
<section>
  <p>Side Bar Icon Editor</p>
  <div class="flex flex-row justify-start">
    
    <div class="flex flex-col justify-start align-top w-3/12 border-gray-500 h-full">
      <ul>
        <li v-for="(element,idx) in icons" :key="idx">
          <font-awesome-icon :icon="element.icon.icon" :prefix="element.icon.prefix" @click="iconClicked(idx)"/>
        </li>
      </ul>
    </div>  
    <div class="flex flex-col justify-evenly w-9/12">
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
          <span class="h-8 w-8 bg-accent1 text-center font-bold align-middle border cursor-pointer relative inline-block" @click="iconPickerClicked()">...</span>
            <span>
              <font-awesome-icon v-if="editorComponent.icon !==''" class="ml-2 inline-block text-lg align-middle"
              :icon="editorComponent.icon.icon" 
              :prefix="editorComponent.icon.prefix" name="icon">
              </font-awesome-icon>
            </span>
          <icon-picker @icon-clicked="iconPickerClick" id="icon"></icon-picker>
        </div>
        <label for="type">Type</label>
        <select name="type" id="type" v-model="editorComponent.type">
          <option v-for="item in componentType" :key="item" value="item">{{ item }}</option>
        </select>

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
import { IconInterface } from '@/models/font-awesome/icon';

@Component({
  components:{
    'icon-picker': IconPicker,
    'submit-cancel': SubmitCancel,
    'invalid-form': InvalidForm,
  }
})
export default class SidebarIconEditor extends Vue {
  name="Sidebar Icon Editor"
  editorComponent!: EditorComponentInterface;
  componentType: string[] = [
    'Image',
    'Text',
    'Jumbo',
    'Nav Bar',
    'Links Menu',
    'Button', 
    ]

  created() {
    this.$store.dispatch('loadSideBarElements');
    this.editorComponent = initEditorComponents;
  }
  
  iconPickerClick(icon: IconInterface) {
    this.editorComponent.icon = icon
  }

  get icons(): EditorComponentInterface[] {
    console.log("this.$store.getters.sidebarElements.sidebarElements", this.$store.getters.sidebarElements.editorComponents)
    return this.$store.getters.sidebarElements.editorComponents
  }
}

</script>