import { PageElementBuilder } from "@/classes/page-element/page-element-builder/PageElementBuilder";
import { PageElement } from "../../PageElement";
import { SiteDefaults } from "@/classes/settings/site-defaults/site-defaults";
import { PageElementFirebaseData } from "@/classes/page-element/models/pageElements/PageElementModel";

export class TextElement extends PageElement {
  constructor(builder: PageElementBuilder) {
    super(builder);
  }

  setDefaultStyle() {
    const siteDefaults = SiteDefaults.getInstance();
    this.addStyle(
      this.constructStyle("font-family", siteDefaults.typography.fontName)
    );
    this.addStyle(
      this.constructStyle("font-size", siteDefaults.typography.fontSizeBody)
    );
    const siteColours = siteDefaults.colours;
    this.addStyle(this.constructStyle("background-color", siteColours.surface));
    this.addStyle(this.constructStyle("color", siteColours.textOnSurface));
  }

  getElementContent(): PageElementFirebaseData {
    return this.getBaseElementContent();
  }
}
