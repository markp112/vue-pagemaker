import { SidebarToolbar, SidebarPanel } from "@/models/sidebar/button-definition/sidebar-buttons";
import { SidebarPanelBuilderInterface } from './interface/interface';

export class SiteSettingsBuilder implements SidebarPanelBuilderInterface {
  private buildSiteSettings(): SidebarToolbar{
    const sideBarToolbar: SidebarToolbar = new SidebarToolbar()
    sideBarToolbar.addIcon('site-settings-48.png', 'site-settings', 'Set site defaults');
    sideBarToolbar.addIcon('art_palette-48.png', 'colour-palette', 'Edit colour palatte');
    return sideBarToolbar;
  }

  build(): SidebarPanel {
    const sidebarPanel: SidebarPanel = new SidebarPanel();
    sidebarPanel.addToolbar(this.buildSiteSettings());
    return sidebarPanel;
  }
}