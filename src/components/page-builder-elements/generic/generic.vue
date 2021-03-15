<template>
  <component
    :is="getComponent"
    :thisComponent="$props.thisComponent"
  ></component>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import ImageComponentBackground from './paritals/image-component-background.vue';
import TextComponent from './paritals/text-component/text-component.vue';
import ButtonComponent from './paritals/button-component/button-component.vue';
import { GenericComponentMixins } from '@/components/page-builder-elements/generic/mixins/generic-components-mixin';

@Component({
  components: {
    'image-component': ImageComponentBackground,
    'text-component': TextComponent,
    'button-component': ButtonComponent,
  }
})
export default class GenericComponent extends mixins(GenericComponentMixins) {
  name = 'generic-component';
  isImage = false;
  isText = false;
  isButton = false;
  editorComponent = '';
  style = '';
  HTML_TARGET_ELEMENT = '';

  created() {
    if (this.$props.thisComponent.styles.length === 0) {
      this.$props.thisComponent.setDefaultStyle();
    }
  }

  get getComponent(): string {
    switch(this.$props.thisComponent.type) {
      case 'image':
        return 'image-component';
      case 'text':
        return 'text-component';
      case 'button':
        return 'button-component';
      default:
        return '';
    }
  }
}
</script>

<style lang='postcss' scoped>
.handle {
  position: relative;
  box-sizing: border-box;
}

.image:active {
  @apply cursor-move;
}

.image {
  @apply cursor-default;
}
.active {
  visibility: visible;
}

.in-active {
  visibility: hidden;
}

.border1 {
  @apply border-indigo-800 border border-dashed;
}

.component {
  @apply shadow-xl;
}

.component:hover {
  @apply bg-gray-600;
}
</style>
