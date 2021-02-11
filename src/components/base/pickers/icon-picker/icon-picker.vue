<template>
  <ul
    v-if="isShowMe"
    class="w-24 bg-gray-800 p-2 z-10 flex flex-row flex-wrap justify-start shadow-lg rounded-md absolute "
  >
    <li v-for="(icon, idx) in icons" :key="idx" class="icon-list ">
      <icon-image
        :icon="icon"
        classDef="icon-picker"
        @iconClick="iconClicked(icon)"
      ></icon-image>
    </li>
  </ul>
</template>

<script lang="ts">
import { IconInterface, IconBuilder } from "@/models/font-awesome/icon";
import Component from "vue-class-component";
import { Vue, Emit } from "vue-property-decorator";
import { ComponentPropsModule } from "@/store/component-props/component-props";
import IconImage from "@/components/base/icon-image/icon-image.vue";

@Component({
  components: {
    "icon-image": IconImage
  }
})
export default class IconPicker extends Vue {
  name = "IconPicker";
  icons: IconInterface[] = [];

  created() {
    this.buildIcons();
  }

  buildIcons() {
    const iconBuilder = new IconBuilder();
    this.icons.push(iconBuilder.buildImageIcon(`home-32.png`, `group`));
    this.icons.push(iconBuilder.buildImageIcon(`faq-32.png`, `group`));
    this.icons.push(iconBuilder.buildImageIcon(`help-32.png`, `group`));
    this.icons.push(iconBuilder.buildImageIcon(`blog-32.png`, `group`));
    this.icons.push(iconBuilder.buildImageIcon(`compass-32.png`, `group`));
    this.icons.push(iconBuilder.buildImageIcon(`video_library2-32.png`, `group`));
    this.icons.push(iconBuilder.buildImageIcon(`camera-32.png`, `group`));
    this.icons.push(iconBuilder.buildImageIcon(`camera_view-32.png`, `group`));
    this.icons.push(iconBuilder.buildImageIcon(`gallery-32.png`, `group`));
    this.icons.push(iconBuilder.buildImageIcon(`image-32.png`, `group`));
    this.icons.push(iconBuilder.buildImageIcon(`id-32.png`, `group`));
    this.icons.push(iconBuilder.buildImageIcon(`phone_vintage-32.png`, `group`));
    this.icons.push(iconBuilder.buildImageIcon(`phone-32.png`, `group`));
    this.icons.push(iconBuilder.buildImageIcon(`envelope-32.png`, `group`));
    this.icons.push(iconBuilder.buildImageIcon(`icons8-page-32.png`, "Page"));
    this.icons.push(
      iconBuilder.buildImageIcon(`icons8-group-objects-32.png`, "group")
    );
    this.icons.push(iconBuilder.buildImageIcon(`icons8-text-32.png`, "group"));
    this.icons.push(iconBuilder.buildImageIcon(`edit-text.png`, "group"));
    this.icons.push(iconBuilder.buildImageIcon(`elephant.png`, `group`));
    this.icons.push(
      iconBuilder.buildImageIcon(`icons8-button-36.png`, `group`)
    );
    this.icons.push(iconBuilder.buildImageIcon(`check_mark-32.png`, `group`));
    this.icons.push(
      iconBuilder.buildImageIcon(`send_container-32.png`, `group`)
    );
  }

  getPath(image: string): string {
    const path = require.context("@/assets/icons", false, /\.png$/);
    return path(`./${image}`);
  }

  @Emit("icon-clicked")
  iconClicked(icon: string) {
    ComponentPropsModule.toggleIconPicker(false);
    return icon;
  }

  get isShowMe(): boolean {
    return ComponentPropsModule.showIconPicker;
  }
}
</script>

<style lang="postcss">
.icon-list {
  @apply w-6/12 text-lg text-accent2 p-2;
}

.icon-picker {
  @apply transform cursor-pointer;
}
.icon-picker:hover {
  @apply shadow-xl -translate-x-1 -translate-y-1 text-accent1;
}
</style>
