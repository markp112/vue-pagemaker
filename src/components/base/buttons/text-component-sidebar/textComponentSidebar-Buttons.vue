<template>
  <section>
    <div class="sidebar-button-panel text-accent-600">
      <plus-minus-icon
        :thisIconButton="buttonIconDimension"
        @onChange="onItemChange($event, 'text')"
      >
      </plus-minus-icon>
      
    </div>
  </section>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import PlusMinusIcon from "@/components/base/buttons/plus-minus-icon/plus-minus-icon.vue";
import {
  shadowIconList,
  lineStyleIconList,
  borderEdgeIconList
} from '@/models/components/icon-picker-models';
import { ButtonFactory } from '@/models/styles/button-factory/button-factory';
import { StyleElement } from '../../../../classes/text-attributes/text-attributes';
import {
  SidebarButtonEventManager,
  ImpactedAttributeTypes
} from '@/classes/sidebarButtonEventManager/sidebarButtonEventManager';
import { ButtonIconDimension } from '@/models/styles/builders/buttonIconDimension';

@Component({
  components: {
    'plus-minus-icon': PlusMinusIcon,
  }
})
export default class TextComponentSideButtons extends Vue {
  name = 'border-buttons';
  shadowIconList = shadowIconList;
  lineStyleIconList = lineStyleIconList;
  borderEdgeIconList = borderEdgeIconList;
  borderRadius = 0;
  paddingValue = 0;
  borderUnits = ['em', 'px', '%'];
  buttonIconDimension: ButtonIconDimension = new ButtonFactory().createButton(
    "padding",
    "padding"
  ) as ButtonIconDimension;

  onItemChange(style: StyleElement, itemType: ImpactedAttributeTypes) {
    this.paddingValue += parseInt(style.value);
    style.value = this.paddingValue.toString();
    const eventManager = SidebarButtonEventManager.getInstance();
    eventManager.applyValue(itemType, style);
    eventManager.updateEditedComponent();
  }
}
</script>

<style lang='postcss' scoped>
.bg-secondary-hidden {
  background-image: url("../../../../assets/icons/hidden-32.png");
}
</style>
