import { SidebarToolbar, SidebarPanel } from "@/models/sidebar/button-definition/sidebar-buttons";
import { SidebarPanelBuilderInterface } from './interface/interface';

export class ContainerEditorBuilder implements SidebarPanelBuilderInterface {

  private buildJustification(): SidebarToolbar {
    const sideBarToolbar: SidebarToolbar = new SidebarToolbar();
    sideBarToolbar.toolbarTitle = 'Horizontal Alignment';
    sideBarToolbar.addIcon('align_vertical_left-32.png', 'justify-start', 'Align content to start');
    sideBarToolbar.addIcon('align_horizontal_center-32.png', 'justify-center', 'Center content');
    sideBarToolbar.addIcon('space_evenly_horizontal-32.png', 'justify-around', 'Align with space around');
    sideBarToolbar.addIcon('icons8-add-white-space-32.png', 'justify-between', 'Align with space between');
    sideBarToolbar.addIcon('align_vertical_right-32.png', 'justify-end', 'Align to end');
    return sideBarToolbar;
  }

  private buildVerticalAlignment(): SidebarToolbar {
    const sideBarToolbar: SidebarToolbar = new SidebarToolbar();
    sideBarToolbar.toolbarTitle = 'Vertical Alignment';
    sideBarToolbar.addIcon('align_horizontal_top-32.png', 'items-start', 'Align to top');
    sideBarToolbar.addIcon('distribute_vertical_center.png', 'items-center', 'Center vertically');
    sideBarToolbar.addIcon('align_horizontal_bottom-32.png', 'items-end', 'Align to end');
    return sideBarToolbar;
  }

  private buildRowColumn(): SidebarToolbar {
    const sideBarToolbar: SidebarToolbar = new SidebarToolbar();
    sideBarToolbar.toolbarTitle = "Row or Column"
    sideBarToolbar.addIcon('row-32.png', 'flex-row', 'Container as row');
    sideBarToolbar.addIcon('column-32.png', 'flex-col', 'Container as column');
    return sideBarToolbar;
  } 

  build(): SidebarPanel {
    const sidebarPanel: SidebarPanel = new SidebarPanel();
    sidebarPanel.addToolbar(this.buildRowColumn());
    sidebarPanel.addToolbar(this.buildJustification());
    sidebarPanel.addToolbar(this.buildVerticalAlignment());
    return sidebarPanel;
  }
}
