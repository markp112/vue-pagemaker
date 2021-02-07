<template>
  <section>
    <numeric-input-dropdown
      :thisIconButton="marginLeftButton"
      @onChange="onItemChange($event, 'margin')"
    >
    </numeric-input-dropdown>
    <numeric-input-dropdown
      :thisIconButton="marginRightButton"
      @onChange="onItemChange($event, 'margin')"
    >
    </numeric-input-dropdown>
    <numeric-input-dropdown
      :thisIconButton="marginTopButton"
      @onChange="onItemChange($event, 'margin')"
    >
    </numeric-input-dropdown>
    <numeric-input-dropdown
      :thisIconButton="marginBottomButton"
      @onChange="onItemChange($event, 'margin')"
    >
    </numeric-input-dropdown>
  </section>
</template>

<script lang="ts">
import { ImpactedAttributeTypes } from "@/classes/sidebarButtonEventManager/sidebarButtonEventManager";
import { StyleElement } from "@/classes/text-attributes/text-attributes";
import { ButtonFactory } from "@/models/styles/button-factory/button-factory";
import { ButtonIconNumeric } from "@/models/styles/button-icon/button-numeric-list/button-numeric-list";
import Vue from "vue";
import Component from "vue-class-component";
import NumericInputDropdown from "@/components/base/buttons/numeric-input-drop-down/numeric-input-dropdown.vue";
import { PageModule } from "@/store/page/page";
import { Style, StyleTags } from "@/models/styles/styles";

@Component({
  components: {
    "numeric-input-dropdown": NumericInputDropdown
  }
})
export default class Margins extends Vue {
  name = "margins";
  marginLeftButton: ButtonIconNumeric = new ButtonFactory().createButton(
    "numeric",
    "margin-left"
  ) as ButtonIconNumeric;
  marginRightButton: ButtonIconNumeric = new ButtonFactory().createButton(
    "numeric",
    "margin-right"
  ) as ButtonIconNumeric;
  marginTopButton: ButtonIconNumeric = new ButtonFactory().createButton(
    "numeric",
    "margin-top"
  ) as ButtonIconNumeric;
  marginBottomButton: ButtonIconNumeric = new ButtonFactory().createButton(
    "numeric",
    "margin-bottom"
  ) as ButtonIconNumeric;

  onItemChange(style: StyleElement, itemType: ImpactedAttributeTypes) {
    const styleName = style.styleName as StyleTags;
    const margin: Style = {
      style: styleName,
      value: style.value + style.units
    };
    PageModule.updateEditedComponentStyles(margin);
  }
}
</script>
