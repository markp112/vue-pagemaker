<template>
  <div class="sidebar-panel">
    <span class="flex flex-row justify-end mr-2 mb-4 w-full">
      <close-button @onClick="closeButtonClick"></close-button>
    </span>
    <div class="mt-4">
      <div class="w-full"
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
      <colour-select></colour-select>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Emit } from 'vue-property-decorator';
  import { SidebarToolbar, SidebarPanel } from '@/models/sidebar/button-definition/sidebar-buttons';
  import { SidebarModule } from '@/store//sidebar/sidebar';
  import { PageModule } from '@/store/page/page';
  import  SidebarToolbarScreen from './sidebar-toolbar.vue';
  import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
  import ColourSelect from '@/components/base/pickers/colour-picker/colour-select.vue';
  import Accordian from '@/components/base/accordian/sidebar-accordian/sidebar-accordian.vue';

  @Component({
    props: {
      toolbarPanel: {
        default: (): SidebarPanel => {
          return new SidebarPanel();
        },
      },
    },
    components: {
      'close-button': CloseButton,
      'sidebar-toolbar': SidebarToolbarScreen,
      'colour-select': ColourSelect,
      'sidebar-accordian': Accordian,
    },
  })
  export default class SidebarPanelScreen extends Vue {
    name = 'SidebarPanelScreen';
    
    @Emit('iconClick')
    iconClick(classDef: string) {
      PageModule.updateComponentClassProperties(classDef);
    }

    closeButtonClick(): void {
      SidebarModule.closeEditor();
    }
    
  }
  </script>