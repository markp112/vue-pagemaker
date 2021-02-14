<template>
  <div class="sidebar-panel">
    <span class="flex flex-row justify-end mr-2 mb-4">
      <close-button @onClick="closeButtonClick"></close-button>
    </span>
    <div class="mr-2 mt-1 text-onPrimary">
      <sidebar-accordian accordianTitle="Colours" class="mb-4">
        <colour-select
          flexAlignment="vertical"
          :showLabels="true"
        ></colour-select>
      </sidebar-accordian>
      <sidebar-accordian accordianTitle="Borders" class="mb-4">
        <border-buttons class="mt-2"></border-buttons>
      </sidebar-accordian>
      <sidebar-accordian accordianTitle="Layout" class="mb-4">
        <text-component class="mt-2"></text-component>
      </sidebar-accordian>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import CloseButton from "@/components/base/buttons/close-button/close-button.vue";
import ColourSelect from "@/components/base/pickers/colour-picker/colour-select.vue";
import BorderButtons from "@/components/base/buttons/borders/borders.vue";
import TextComponetSideButtons from '@/components/base/buttons/text-component-sidebar/textComponentSidebar.vue';
import { PageModule } from "@/store/page/page";
import { SidebarModule } from "@/store//sidebar/sidebar";
import { ActionEvent } from "../../../../models/components/base-component";
import Accordian from "@/components/base/accordian/sidebar-accordian/sidebar-accordian.vue";

@Component({
  components: {
    "close-button": CloseButton,
    "colour-select": ColourSelect,
    "border-buttons": BorderButtons,
    "sidebar-accordian": Accordian,
    'text-component': TextComponetSideButtons,
  }
})
export default class TextComponentSidebar extends Vue {
  name = "text-component-sidebar";
  data = "";

  mounted() {
    const content = PageModule.editedComponentData;
    this.data = content;
  }

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
