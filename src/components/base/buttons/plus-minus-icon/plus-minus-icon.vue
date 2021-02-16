<template>
  <div
    class="sidebar-button-container relative"
    
  >
    <img
      :src="getPath($props.thisIconButton.iconImage)"
      @mouseover="showToolTip=!showToolTip"
      @mouseleave="showToolTip=!showToolTip"
      class="text-accent-600 cursor-pointer hover:bg-gray-600"
    />
    <div class="flex flex-col items-center">
      <span
        class="icon-img minus h-4 inline-block w-4"
        @click="borderThicknessChange(-1)"
      ></span>
      <span
        class="icon-img plus h-4 inline-block w-4"
        @click="borderThicknessChange(1)"
      ></span>
    </div>
    <tooltip
      :tooltip="tooltip"
      :showToolTip="showToolTip"
    >
    </tooltip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import ToolTip from '@/components/base/notifications/tooltip/tooltip.vue';
import { Emit } from 'vue-property-decorator';
import { ButtonIconDimension } from '@/models/styles/builders/buttonIconDimension';
import { ButtonFactory } from '@/models/styles/button-factory/button-factory';
import { StyleElement } from '../../../../classes/text-attributes/text-attributes';

@Component({
  props: {
    thisIconButton: {
      default: (): ButtonIconDimension => {
        return new ButtonFactory().createButton(
          'dimension',
          'border-thickness'
        ) as ButtonIconDimension;
      }
    }
  },
  components: {
    tooltip: ToolTip
  }
})
export default class PlusMinusIcon extends Vue {
  name = 'PlusMinusIcon';
  tooltip = this.$props.thisIconButton.tooltip;
  showToolTip = false;
  
  @Emit('onChange')
  borderThicknessChange(amount: number) {
    const style: StyleElement = {
      styleName: this.$props.thisIconButton.style.style,
      value: amount.toString(),
      units: 'px'
    };
    return style;
  }

  getPath(image: string): string {
    const path = require.context('@/assets/icons', false, /\.png$/);
    return path(`./${image}`);
  }
}
</script>

<style lang="postcss" scoped>
.icon-img {
  background-size: 16px 16px;
  background-position: center;
}

.plus {
  background-image: url("../../../../assets/icons/plus-24.png");
}

.plus:hover {
  background-image: url("../../../../assets/icons/plus-olive-24.png");
}
.minus {
  background-image: url("../../../../assets/icons/minus-24.png");
}

.minus:hover {
  background-image: url("../../../../assets/icons/minus-olive-24.png");
}
</style>
