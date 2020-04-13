<template>
  <div class="mt-1 ml-4 w-full">
    <ul class="flex flex-row justify-start font-smaller text-accent">
      <li v-for="(breadcrumb, idx) in getbreadCrumbList" :key="idx" @click="routeTo(idx)" class="ml-2 w-100" :class="{'linked': !!breadcrumb.link }">
        {{ breadcrumb.name }} <span v-if="!!breadcrumb.link">/</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'

  import Component from 'vue-class-component';
  import { Watch } from 'vue-property-decorator';
  import { BreadcrumbLink } from '../../../router/index';

  @Component
  export default class Breadcrumb extends Vue {
    private breadcrumbList: BreadcrumbLink[] = [{name:''}];

    created(){
      this.breadcrumbList = this.$route.meta.breadcrumb;
    }

    @Watch('$route', {immediate: true, deep: true})
    onUrlChange(value: string) {
      this.updateList();
    }

    routeTo(index: number) {

      const link = this.breadcrumbList[index].link === undefined ? '' : `/${this.breadcrumbList[index].link}`;
      if (link != undefined) {
        this.$router.push(link);
      }
    }

    updateList() {
      if (this.$route !== undefined ) {
        this.breadcrumbList = this.$route.meta.breadcrumb;
      }
    }

    get getbreadCrumbList(): BreadcrumbLink[] {
      return this.breadcrumbList;
    }
  }
  
</script>

<style lang="postcss">

  .linked {
    cursor: pointer;
    color: $accent;
  }
  
</style>