<template>
  <div class="sidebar-button-panel">
    <img src="@/assets/icons/increase_indent-32.png" 
          class=" cursor-pointer hover:bg-gray-800"
          @click="indentClick()"
          >
    <img src="@/assets/icons/reduce_indent-32.png" 
        class=" cursor-pointer hover:bg-gray-800"
        @click="outdentClick()"
        >
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';

@Component
export default class IndentOutdent extends Vue {
  name = "IndentOutdent";

  @Emit('onIndentClick')
  indentClick() {
    return;
  }

  @Emit('onOutdentClick')
  outdentClick() {
    return;
  }

}
</script>
