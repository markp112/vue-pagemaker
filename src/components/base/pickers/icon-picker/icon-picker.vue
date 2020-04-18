<template>
    <ul v-if="isShowMe" class="w-20 bg-gray-800 p-2 z-10 flex flex-row flex-wrap justify-start shadow-lg rounded-md absolute ">
      <li v-for="(icon,idx) in icons" :key="idx" class="icon-list ">
        <icon-image :icon="icon" classDef="icon-picker" @iconClick="iconClicked"></icon-image>
      </li>
    </ul>
</template>

<script lang="ts">
import { IconInterface, initIcon, IconBuilder, Icon } from '@/models/font-awesome/icon';
import Component from 'vue-class-component';
import { Vue,  Emit, Prop } from 'vue-property-decorator';
import { ComponentPropsModule } from '@/store/component-props/component-props';
import IconImage from '@/components/base/icon-image/icon-image.vue';

@Component({
  components: {
    'icon-image': IconImage,
  }
})
export default class IconPicker extends Vue {
  name = "IconPicker"
  icons: IconInterface[] = [];

  created() {
    this.buildIcons()
  }

  buildIcons(){
    const iconBuilder = new IconBuilder();
    this.icons.push(iconBuilder.buildFontAwesomeIcon('home', 'fas'));
    this.icons.push(iconBuilder.buildFontAwesomeIcon('question', 'fas'));
    this.icons.push(iconBuilder.buildFontAwesomeIcon('question-circle', 'fas'));
    this.icons.push(iconBuilder.buildFontAwesomeIcon('blog', 'fas'));
    this.icons.push(iconBuilder.buildFontAwesomeIcon('photo-video', 'fas'));
    this.icons.push(iconBuilder.buildFontAwesomeIcon('camera', 'fas'));
    this.icons.push(iconBuilder.buildFontAwesomeIcon('images', 'fas'));
    this.icons.push(iconBuilder.buildFontAwesomeIcon('id-card', 'fas'));
    this.icons.push(iconBuilder.buildFontAwesomeIcon('phone', 'fas'));
    this.icons.push(iconBuilder.buildFontAwesomeIcon('envelope', 'fas'));
    this.icons.push(iconBuilder.buildFontAwesomeIcon('align-justify', 'fas'));
    this.icons.push(iconBuilder.buildFontAwesomeIcon('columns', 'fas'));
    this.icons.push(iconBuilder.buildFontAwesomeIcon('clone', 'fas'));
    this.icons.push(iconBuilder.buildFontAwesomeIcon('bahai', 'fas'));
    this.icons.push(iconBuilder.buildImageIcon(`icons8-page-32.png`, 'Page'))
    this.icons.push(iconBuilder.buildImageIcon(`icons8-group-objects-32.png`, 'group'))
    this.icons.push(iconBuilder.buildImageIcon(`icons8-text-32.png`, 'group'))
  }

  getPath(image: string): string {
    const path = require.context('@/assets/icons',false,/\.png$/);
    return path(`./${image}`);
  }

  @Emit('icon-clicked')
  iconClicked(icon: IconInterface) {
    ComponentPropsModule.toggleIconPicker(false);
    return icon;
  }

  get isShowMe(): boolean {
    return ComponentPropsModule.showIconPicker;
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