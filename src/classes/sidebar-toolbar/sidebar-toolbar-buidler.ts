import {
  SidebarIcon,
  SidebarToolbarInterface,
  SidebarPanelInterface,
  SidebarToolbar,
  SidebarPanel,
} from '@/models/sidebar/button-definition/sidebar-buttons';

export type SidebarComponents =
  'image-editor'
  | 'sidebar-components'
  | 'container-editor'
  | 'sites-menu'
  | 'button-editor';

export class SidebarPanelBuilder {

  sidebarPanel: SidebarPanel;

  constructor (sidebarToCreate: SidebarComponents) {
    this.sidebarPanel = new SidebarPanel();
    switch (sidebarToCreate) {
      case 'container-editor':
        this.sidebarPanel = this.buildContainerSidePanel();
    }
  }

  private buildJustification(): SidebarToolbar {
    const sideBarToolbar: SidebarToolbar = new SidebarToolbar();
    sideBarToolbar.addIcon('align_vertical_left-32.png', 'justify-start');
    sideBarToolbar.addIcon('align_horizontal_center-32.png', 'justify-center');
    sideBarToolbar.addIcon('space_evenly_horizontal-32.png', 'justify-around');
    sideBarToolbar.addIcon('icons8-add-white-space-32.png', 'justify-between');
    sideBarToolbar.addIcon('align_vertical_right-32.png', 'justify-end');
    return sideBarToolbar;
  }

  private buildVerticalAlignment(): SidebarToolbar {
    const sideBarToolbar: SidebarToolbar = new SidebarToolbar();
    sideBarToolbar.addIcon('align_horizontal_top-32.png', 'items-start');
    sideBarToolbar.addIcon('distribute_vertical_center.png', 'items-center');
    sideBarToolbar.addIcon('align_horizontal_bottom-32.png', 'items-end');
    return sideBarToolbar;
  }

  private buildRowColumn(): SidebarToolbar {
    const sideBarToolbar: SidebarToolbar = new SidebarToolbar();
    sideBarToolbar.addIcon('row-32.png', 'flex-row');
    sideBarToolbar.addIcon('column-32.png', 'flex-col');
    return sideBarToolbar;
  } 

  private buildContainerSidePanel(): SidebarPanel {
    const sidebarPanel: SidebarPanel = new SidebarPanel();
    sidebarPanel.addToolbar(this.buildRowColumn());
    sidebarPanel.addToolbar(this.buildJustification());
    sidebarPanel.addToolbar(this.buildVerticalAlignment());
    return sidebarPanel;
  }

}