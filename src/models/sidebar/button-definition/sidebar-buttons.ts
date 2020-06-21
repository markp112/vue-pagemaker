export interface SidebarIconInterface {
  icon: string;
  className: string;
  toolTip: string
}

/** @description consitutes an icon on the toolbar
 * @param icon - the image file that is displayed on the toolbar
 * @param className - tailwind class to be added to the edited element
 * @param toolTip - optional tooltip to show on hover over the icon
 */
export class SidebarIcon implements SidebarIconInterface {
  icon: string;
  className: string;
  toolTip: string;
  
  constructor(icon: string, className: string, toolTip: string) {
    this.icon = icon;
    this.className = className;
    this.toolTip = toolTip;
  }
}

export interface SidebarToolbarInterface {
  toolbarIcons: SidebarIcon [];
}
/** @description contains the list of icons that make up a toolbar  */
export class SidebarToolbar implements SidebarToolbarInterface {
  toolbarIcons: SidebarIcon[] = [];
  
  addIcon(icon: string, className: string, tooltip = '') {
    const sidebarIcon = new SidebarIcon(icon, className, tooltip);
    this.toolbarIcons.push(sidebarIcon);
  }
}

export interface SidebarPanelInterface {
  sidebarPanels: SidebarToolbar[];
}

/** @description contains the list of toolbars to display for the given sidepanel */
export class SidebarPanel implements SidebarPanelInterface {
  sidebarPanels: SidebarToolbar[] = [];

  addToolbar(toolbar: SidebarToolbar) {
    this.sidebarPanels.push(toolbar);
  }
}