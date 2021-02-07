import { SidebarPanel } from "@/models/sidebar/button-definition/sidebar-buttons";
import { ContainerEditorBuilder } from "./builders/container-editor";
import { SiteSettingsBuilder } from "./builders/site-settings";

export type SidebarComponents =
  | "image-editor"
  | "sidebar-components"
  | "container-editor"
  | "sites-menu"
  | "button-editor"
  | "site-settings";

export class SidebarPanelBuilder {
  sidebarPanel: SidebarPanel;

  constructor(sidebarToCreate: SidebarComponents) {
    this.sidebarPanel = new SidebarPanel();
    switch (sidebarToCreate) {
      case "container-editor":
        this.sidebarPanel = this.buildContainerSidePanel();
        break;
      case "site-settings":
        this.sidebarPanel = this.buildSiteSettings();
        break;
    }
  }

  private buildContainerSidePanel(): SidebarPanel {
    const builder = new ContainerEditorBuilder();
    return builder.build();
  }

  private buildSiteSettings(): SidebarPanel {
    const builder = new SiteSettingsBuilder();
    return builder.build();
  }
}
