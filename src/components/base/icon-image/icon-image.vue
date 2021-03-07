<template>
<div class="relative">
  <font-awesome-icon
    v-if="!icon.isImage"
    :class="$props.classDef"
    :icon="$props.icon.icon"
    :prefix="$props.icon.prefix"
    name="icon"
    ref="icon"
    @click="iconClick"
  >
  </font-awesome-icon>
  <img
    :id="$props.id"
    v-else
    :class="$props.classDef"
    :src="getPath($props.icon.icon)"
    @click="iconClick"
    @mouseover="displayTooltip(true)"
    @mouseleave="displayTooltip(false)"
  />
  <tooltip :showToolTip="showTooltip" :tooltip="$props.tooltip"></tooltip>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ToolTip from '@/components/base/notifications/tooltip/tooltip.vue';
import { IconInterface, initIcon } from "@/models/font-awesome/icon";
import { Emit } from "vue-property-decorator";

@Component({
  props: {
    icon: {
      default: (): IconInterface => {
        return initIcon;
      },
    },
    classDef: { default: '' },
    id: { default: '' },
    tooltip: { default: ''},
  },
  components: {
    'tooltip': ToolTip,
  },
})
export default class IconImage extends Vue {
  name="IconImage";
  showTooltip = false;
  
  getPath(image: string): string {
    const path = require.context("@/assets/icons", false, /\.png$/);
    return path(`./${image}`);
  }

  @Emit("iconClick")
  iconClick() {
    return this.$props.icon;
  }

  displayTooltip(show: boolean) {
    this.showTooltip = show && this.$props.tooltip !== '';
  }

}
</script>
