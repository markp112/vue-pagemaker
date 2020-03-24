<template>

    <div class="border-2 border-secondary rounded-md p-0 fixed bottom-0 md:left-0 md:h-sidebar w-1/5 ml-2 mb-2 mt-2">
    
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Emit, Vue } from 'vue-property-decorator';

@Component
export default class SideBar extends Vue {
  isShowSideBar = true;

  chevronClicked() {
    this.isShowSideBar = !this.isShowSideBar;
    this.resizeEvent(this.isShowSideBar);
  }

 @Emit('resize')
 resizeEvent(isShowSideBar: boolean) {
   return this.isShowSideBar
 }

}
</script>

<style lang="postcss">
  .icon-size {
    font-size: 1.5em;
  }

@screen md {
.side-bar-show {
    @apply w-1/5;
  }

  .side-bar-hidden {
    @apply w-1/12;
  }
}
</style>