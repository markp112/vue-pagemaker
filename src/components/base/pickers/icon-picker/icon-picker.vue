<template>
    <ul v-if="isShowMe" class="w-20 bg-gray-800 p-2 z-10 flex flex-row flex-wrap justify-start shadow-lg rounded-md absolute ">
      <li v-for="(icon,idx) in icons" :key="idx" class="icon-list ">
        <font-awesome-icon :icon="icon.icon"
            :prefix="icon.prefix"
            class="icon-picker"
            @click="iconClicked(idx)"
            >
        </font-awesome-icon>
      </li>
    </ul>
    
</template>

<script lang="ts">
import { IconInterface } from '../../../../models/font-awesome/icon'
import Component from 'vue-class-component';
import { Vue,  Emit, Prop } from 'vue-property-decorator'

@Component({
})
export default class IconPicker extends Vue{
  name = "Icon Picker"

  icons: IconInterface [] = [{ icon: 'home', prefix: 'fas' },
      { icon: 'question', prefix: 'fas' },
      { icon: 'question-circle', prefix: 'fas' },
      { icon: 'blog', prefix: 'fas' },
      { icon: 'photo-video', prefix: 'fas' },
      { icon: 'camera', prefix: 'fas' },
      { icon: 'images', prefix: 'fas' },
      { icon: 'id-card', prefix: 'fas' },
      { icon: 'phone', prefix: 'fas' },
      { icon: 'envelope', prefix: 'fas' },
];

  @Emit('icon-clicked')
  iconClicked(idx: number) {
    this.$store.dispatch('toggleIconPicker', false)
    return this.icons[idx];
  }

  get isShowMe(): boolean {
    return this.$store.getters.showIconPicker
  }
}

</script>

<style lang="postcss"  >

.icon-list {
  @apply w-6/12 text-lg text-accent p-2;
}

.icon-picker {
  @apply transform cursor-pointer;
}
.icon-picker:hover {
  @apply shadow  shadow-xl -translate-x-1 -translate-y-1 text-accent1;
}
</style>