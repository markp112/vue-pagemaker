<template>
  <div  class="flex flex-col justify-start w-64 h-64 border-2 shadow-lg p-5">
    <img src="site.image" alt="" class="w-full">
    <div class="flex flex-row justify-between">
      <p>{{site.name}}</p>
      <font-awesome-icon icon="pencil-alt" prefix="fas" @click="editSiteClick()" class="cursor-pointer">
      </font-awesome-icon>
    </div>
    <div class="flex flex-col justify-center align-middle  h-full">
      <img src="@/assets/images/Go-Circle-blue.png" alt="" class="object-contain cursor-pointer">
    </div>

    
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Vue,  Emit, Prop } from 'vue-property-decorator'
import { Site, initSite} from '@/models/sites/site'


@Component({
    props: {
      site: {
        default: initSite,
      }
    }
})
export default class SiteCard extends Vue{
  name = "Site Card";

  editSiteClick(){
    console.log("edit site clicked")
    this.$store.dispatch("updateCurrentSiteId", this.$props.site.siteId)
    this.$router.push("/newSite")
  }

}

</script>