<template>
  <div class="bg-gray-500 w-24 h-8 flex flex-row justify-between absolute p-2 rounded-md z-10 right-0 top-0 shadow  shadow-xl" v-if="isVisible">
    <font-awesome-icon
      icon="pencil-alt"
      prefix="fas"
      @click="editClick()"
      class="cursor-pointer hover:text-secondary-900"
    >
    </font-awesome-icon>
    <font-awesome-icon
      icon="trash-alt"
      prefix="fas"
      @click="trashClick()"
      class="cursor-pointer hover:text-secondary-900"
    >
    </font-awesome-icon>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import { PageModule } from '@/store/page/page';
import { SidebarModule } from '@/store/sidebar/sidebar';

@Component({
  props: {
    showMe: { default: false }
  }
})
export default class EditDeleteOption extends Vue {
  localShowMe = false;
  created() {
    this.localShowMe = this.$props.showMe
  }

  editClick(): void {
    PageModule.updateShowEditDelete(false);
    SidebarModule.updateSidebarEditor();
  }

  @Emit('deleteClicked')
  trashClick(): void {
    PageModule.updateShowEditDelete(false);
    PageModule.deletePageElement();
    SidebarModule.setSidebarMenuTo('sidebar-components');
  }

  get isVisible(): boolean {
    this.localShowMe = PageModule.showEditDelete;
    return this.localShowMe;
  }
}
</script>
