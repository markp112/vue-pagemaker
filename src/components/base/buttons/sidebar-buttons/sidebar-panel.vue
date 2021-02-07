<template>
  <div class="sidebar-panel">
    <span class="flex flex-row justify-end mr-2 mb-4 w-full">
      <close-button @onClick="closeButtonClick"></close-button>
    </span>
    <div class="mt-4">
      <div
        class="w-full"
        v-for="(toolbar, index) in $props.toolbarPanel.sidebarPanels"
        :key="index"
      >
        <sidebar-accordian :accordianTitle="toolbar.toolbarTitle" class="mb-4">
          <sidebar-toolbar
            :toolbarItems="toolbar"
            @iconClick="iconClick($event)"
          >
          </sidebar-toolbar>
        </sidebar-accordian>
      </div>
      <sidebar-accordian accordianTitle="Margins" class="mb-4">
        <margin-buttons></margin-buttons>
      </sidebar-accordian>
      <sidebar-accordian accordianTitle="Colours" class="mb-4">
        <colour-select flexAlignment="vertical" :showLabels="true">
        </colour-select>
      </sidebar-accordian>
      <sidebar-accordian accordianTitle="Borders" class="mb-4">
        <border-buttons class="mt-2"></border-buttons>
      </sidebar-accordian>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Emit } from "vue-property-decorator";
import { SidebarPanel } from "@/models/sidebar/button-definition/sidebar-buttons";
import { SidebarModule } from "@/store/sidebar/sidebar";
import { PageModule } from "@/store/page/page";
import SidebarToolbarScreen from "./sidebar-toolbar.vue";
import CloseButton from "@/components/base/buttons/close-button/close-button.vue";
import ColourSelect from "@/components/base/pickers/colour-picker/colour-select.vue";
import Accordian from "@/components/base/accordian/sidebar-accordian/sidebar-accordian.vue";
import BorderButtons from "@/components/base/buttons/borders/borders.vue";
import Margins from "@/components/base/buttons/sidebar-buttons/margins/margins.vue";

@Component({
  props: {
    toolbarPanel: {
      default: (): SidebarPanel => {
        return new SidebarPanel();
      }
    }
  },
  components: {
    "close-button": CloseButton,
    "sidebar-toolbar": SidebarToolbarScreen,
    "colour-select": ColourSelect,
    "sidebar-accordian": Accordian,
    "border-buttons": BorderButtons,
    "margin-buttons": Margins
  }
})
export default class SidebarPanelScreen extends Vue {
  name = "SidebarPanelScreen";

  @Emit("iconClick")
  iconClick(classDef: string) {
    PageModule.updateComponentClassProperties(classDef);
  }

  closeButtonClick(): void {
    SidebarModule.closeEditor();
  }
}
</script>
