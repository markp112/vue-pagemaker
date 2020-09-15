<template>
  <div class="sidebar-panel">
    <span class="flex flex-row justify-end mr-2 mb-4">
      <close-button @onClick="closeButtonClick"></close-button>
    </span>
    <div class="mr-2 mt-1 text-siteOnPrimary">
      <colour-select></colour-select>
      <border-buttons class="mt-2"></border-buttons>
      <sidebar-text-editor
        class="mt-2"
          :textValue="data"
        @onTextChange="onTextChange"
      >
      </sidebar-text-editor>
      <actions-select 
        onActionSelect="onActionSelect" 
        class="mt-2"
      >
      </actions-select>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import ColourSelect from '@/components/base/pickers/colour-picker/colour-select.vue';
import BorderButtons from '@/components/base/buttons/borders/borders.vue';
import SideBarTextEditor from '@/components/base/text/sidebar-text-editor/sidebar-text-editor.vue';
import ActionsSelect from '@/components/base/pickers/actions-select/actions-select.vue';
import { PageModule } from '@/store/page/page';
import { SidebarModule } from '@/store//sidebar/sidebar';
import { ActionEvent } from '../../../../models/components/base-component';

@Component({
  components: {
    'close-button': CloseButton,
    'colour-select': ColourSelect,
    'border-buttons': BorderButtons,
    'sidebar-text-editor': SideBarTextEditor,
    'actions-select': ActionsSelect,
  },
})
export default class ButtonEditor extends Vue {
  name = 'button-editor'
  data = PageModule.editComponentData;

  closeButtonClick(): void {
    SidebarModule.closeEditor();
  }

  onTextChange(text: string): void {
    PageModule.updateEditedComponentData(text);
  }

  onActionEvent(actionEvent: ActionEvent) {
    PageModule.updateEditedComponentActionEvent(actionEvent);
  }
}
</script>
