<template>
  <div class="bg-gray-500 w-24 h-8 flex flex-row justify-between absolute p-2 rounded-md z-10 right-0 top-0 shadow  shadow-xl" v-if="isVisible">
    <font-awesome-icon icon="pencil-alt" prefix="fas" @click="editClick()" class="cursor-pointer hover:text-secondary-900"></font-awesome-icon>
    <font-awesome-icon icon="trash-alt" prefix="fas" @click="trashClick()" class="cursor-pointer hover:text-secondary-900"></font-awesome-icon>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Emit } from 'vue-property-decorator';

@Component({
  props: {
    showMe: { default: false }
  }
})
export default class EditDeleteOption extends Vue{
  localShowMe = false;
  created() {
    this.localShowMe = this.$props.showMe
  }

  editClick(): void {
    this.$store.dispatch("updateShowEditDelete", false);
    this.$store.dispatch("updateSidebarEditor");
  }


  @Emit('deleteClicked')
  trashClick(): void {
    this.$store.dispatch("updateShowEditDelete", false)
    return
  }

  get isVisible(): boolean {
    this.localShowMe = this.$store.getters.showEditDelete;
    return this.localShowMe;
  }
  
}
</script>