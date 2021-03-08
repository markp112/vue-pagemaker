<template>
  <div
    class="bg-gray-500 w-24 h-8 flex flex-row justify-between absolute p-1 rounded-md z-10 right-0 top-0 shadow-xl"
    v-if="isVisible"
  >
    <div class="relative" v-if="showPen">
      <img
        src="@/assets/icons/fountain_pen-24.png"
        alt="edit text"
        @click="editPenClick()"
        @mouseover="showPenToolTip=true"
        @mouseleave="showPenToolTip=!showPenToolTip"
        class="cursor-pointer hover:bg-site-secondary-light"
      />
        <tooltip
          tooltip="Edit text"
          :showToolTip="showPenToolTip"
        ></tooltip>

    </div>
    <div class="relative">
      <img
        src="@/assets/icons/trash_can-24.png"
        alt="remove item"
        @click="trashClick()"
        @mouseover="showBinToolTip=true"
        @mouseleave="showBinToolTip=!showBinToolTip"
        class="cursor-pointer hover:bg-site-secondary-light"
      />
        <tooltip
          tooltip="delete element"
          :showToolTip="showBinToolTip"
        ></tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ToolTip from "@/components/base/notifications/tooltip/tooltip.vue";
import { Emit } from "vue-property-decorator";
import { PageModule } from "@/store/page/page";
import { SidebarModule } from "@/store/sidebar/sidebar";

@Component({
  props: {
    showMe: { default: false }
  },
  components: {
    tooltip: ToolTip
  }
})
export default class EditDeleteOption extends Vue {
  name = 'edit menu'
  localShowMe = false;
  showPenToolTip = false;
  showBinToolTip = false;
  
  created() {
    this.localShowMe = this.$props.showMe;
  }

  updated() {
    this.showPenToolTip = this.showBinToolTip = false;
  }

  editPenClick(): void {
    PageModule.updateShowEditDelete(false);
    SidebarModule.updateSidebarEditor(true);
  }

  @Emit("deleteClicked")
  trashClick(): void {
    PageModule.updateShowEditDelete(false);
    PageModule.deletePageElement();
    SidebarModule.setSidebarMenuTo("sidebar-components");
  }

  get isVisible(): boolean {
    this.localShowMe = PageModule.showEditDelete;
    return this.localShowMe;
  }

  get showPen(): boolean {
    return PageModule.editedComponentType === 'text';
  }
}
</script>
