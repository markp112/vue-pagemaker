<template>
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
  />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { IconInterface, initIcon } from "@/models/font-awesome/icon";
import { Emit } from "vue-property-decorator";

@Component({
  props: {
    icon: {
      default: (): IconInterface => {
        return initIcon;
      }
    },
    classDef: { default: "" },
    id: { default: "" }
  }
})
export default class IconImage extends Vue {
  getPath(image: string): string {
    const path = require.context("@/assets/icons", false, /\.png$/);
    return path(`./${image}`);
  }

  @Emit("iconClick")
  iconClick() {
    return this.$props.icon;
  }
}
</script>
