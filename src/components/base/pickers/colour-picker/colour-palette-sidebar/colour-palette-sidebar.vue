<template>
  <section class="w-8/12 z-10" >
    <div class="flex flex-row flex-wrap">
      <span
        class="h-8 w-8 flex flex-col justify-end cursor-pointer"
        v-for="(colour, index) in primaryColours"
        :key="index + colour"
        :style="{ backgroundColor: colour }"
        @click="colourClicked(colour)"
      >
      </span>
    </div>
    <div class="flex flex-row flex-wrap">
      <span
        class="h-8 w-8 flex flex-col justify-end cursor-pointer"
        v-for="(colour, index) in secondaryColours"
        :key="index + colour"
        :style="{ backgroundColor: colour }"
        @click="colourClicked(colour)"
      >
      </span>
    </div>
    <div class="flex flex-row flex-wrap">
      <span
        class="h-8 w-8 flex flex-col justify-end cursor-pointer"
        v-for="(colour, index) in accentColours"
        :key="index + colour"
        :style="{ backgroundColor: colour}"
        @click="colourClicked(colour)"
      >
      </span>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { SiteDefaults } from '@/classes/settings/site-defaults/site-defaults';
import { ColourPalettes } from '@/classes/settings/colour-palette/colour-palette';
import { AuthModule } from '@/store/auth/auth';
import { SitesModule } from '@/store/sites/sites'; 
import { SiteIdAndUserId } from '@/models/site-and-user/site-and-user';
import { Emit } from 'vue-property-decorator';

@Component({
  props: {
    show: { default: false } 
  }
})
export default class ColourPaletteSidebar extends Vue {
  name = "ColourPaletteSidebar";
  siteDefaults = SiteDefaults.getInstance();
  colourPalettes = new ColourPalettes();

  created() {
    this.colourPalettes = new ColourPalettes();
    const siteAndUserId: SiteIdAndUserId = {
      userId: AuthModule.currentUser.id,
      siteId: SitesModule.getCurrentSiteId,
    }
    this.colourPalettes.loadPalette(siteAndUserId);
  }
  
  @Emit('colour')
  colourClicked(colour: string) {
    return colour;
  }

  get primaryColours() {
    return this.colourPalettes.primary;
  }

  get secondaryColours() {
    return this.colourPalettes.secondary;
  }

  get accentColours() {
    return this.colourPalettes.accent;
  }


}
</script>

<style>

</style>