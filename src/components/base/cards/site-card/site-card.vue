<template>
  <div  class="flex flex-col justify-start w-64  border-2 shadow-lg">
    <img :src="site.image" alt="" class="w-full object-cover">
    <div class="flex flex-row justify-between p-5">
      <p>{{site.name}}</p>
      <font-awesome-icon icon="pencil-alt" prefix="fas" @click="editSiteClick()" class="cursor-pointer">
      </font-awesome-icon>
    </div>
    <div class="flex flex-col justify-center align-middle  h-full">
      <img src="@/assets/images/Go-Circle-blue.png" alt="" class="object-contain cursor-pointer" @click="goClick()">
    </div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Vue,  Emit, Prop } from 'vue-property-decorator';
import { Site, initSite} from '@/models/sites/site';
import { SitesModule } from '@/store/sites/sites';

@Component({
    props: {
      site: {
        default: initSite,
      }
    }
})
export default class SiteCard extends Vue{
  name = "Site Card";

  editSiteClick() {
    SitesModule.updateCurrentSiteId(this.$props.site.siteId);
    this.$router.push({name:"newSite", params:{title:'Edit Site'}});
  }

  goClick() {
    SitesModule.updateCurrentSiteId(this.$props.site.siteId);
    this.$router.push({name:"pageList"});
  }

}

</script>