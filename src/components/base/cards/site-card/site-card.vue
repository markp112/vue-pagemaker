<template>
  <div class="flex flex-col justify-start w-64  border-2 shadow-lg">
    <img :src="site.image" alt="" class="w-full object-cover">
    <div class="flex flex-row justify-between p-5">
      <p>{{site.name}}</p>
       <img
          src="@/assets/icons/pencil-32.png"
          alt=""
          class="cursor-pointer"
          @click="editSiteClick()"
        >
    </div>
    <div class="flex flex-row justify-center align-middle  h-full">
      <img
        src="@/assets/images/Go-Circle-blue.png"
        alt=""
        class="object-contain cursor-pointer w-32 h-auto"
        @click="goClick()"
      >
    </div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { initSite} from '@/models/sites/site';
import { SitesModule } from '@/store/sites/sites';
import { SiteDefaults } from '@/classes/settings/site-defaults/site-defaults';
import { SnackbarMixin } from '@/mixins/components/snackbar/snackbar-mixin';
import { Notification } from '@/models/notifications/notifications';

@Component({
    props: {
      site: {
        default: initSite,
      }
    }
})
export default class SiteCard extends SnackbarMixin{
  name = 'Site Card';

  editSiteClick() {
    SitesModule.updateCurrentSiteId(this.$props.site.siteId);
    this.$router.push({name: 'newSite', params:{ title: 'Edit Site' }});
  }

  goClick() {
    const siteId = this.$props.site.siteId;
    SitesModule.updateCurrentSiteId(siteId);
    const siteDefaultSettings = SiteDefaults.getInstance();
    siteDefaultSettings.loadDefaults()
    .catch(err => {
      const notification: Notification = err as Notification;
      this.showSnackbar(notification, 'Site defaults load failed, defaults applied');
    })
    this.$router.push({ name: 'pageList' });
  }
}
</script>
