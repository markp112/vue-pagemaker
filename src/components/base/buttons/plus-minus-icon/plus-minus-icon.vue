<template>
  <div class="flex flex-row justify-start">
    <img
      :src="getPath($props.thisIconButton.iconImage)"
      class="text-accent-600 cursor-pointer hover:bg-gray-600"
    />
    <div class="flex flex-col items-center" >
      <span class="icon-img minus h-4 inline-block w-4" @click="borderThicknessChange(-1)"></span>
      <span class="icon-img plus h-4 inline-block w-4" @click="borderThicknessChange(1)"></span>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component';
  import { Emit } from 'vue-property-decorator';
  import { ButtonIconDimension, ButtonIconDimensionBuilder } from '@/models/styles/button-icon/buttonIconDimension'
  import { Dimension } from '../../../../models/components/box-dimension';

  @Component({
  props: {
    thisIconButton: {
        default: (): ButtonIconDimension => {
          return new ButtonIconDimensionBuilder().build();
        },
      },
  },
  })
  export default class PlusMinusIcon extends Vue {
    name = 'PlusMinusIcon'

  @Emit("onChange")
  borderThicknessChange(amount: number) {
    this.$props.thisIconButton.eventClass.width = { value: amount, units: 'px' };
  }

  getPath(image: string): string {
      const path = require.context('@/assets/icons',false,/\.png$/);
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

  .plus:hover{
    background-image: url("../../../../assets/icons/plus-olive-24.png");
  }
  .minus {
    background-image: url("../../../../assets/icons/minus-24.png");
  }

  .minus:hover{
    background-image: url("../../../../assets/icons/minus-olive-24.png");
  }
  </style>