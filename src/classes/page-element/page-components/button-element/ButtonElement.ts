import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';
import { PageElement } from '../../PageElement';
import { SiteDefaults } from '@/classes/settings/site-defaults/site-defaults';
import { PageElementFirebaseData, PageElementInterface } from '../../models/pageElements/pageElement';

export class ButtonElement extends PageElement {
  constructor(builder: PageElementBuilder) {
    super(builder);
  }

  setDefaultStyle() {
    if (this.styles.length === 0) {
      const siteDefaults = SiteDefaults.getInstance();
      this.addStyle(this.constructStyle('fontFamily', siteDefaults.typography.fontName));
      this.addStyle(this.constructStyle('fontSize', siteDefaults.typography.fontSizeBody));
      const siteColours = siteDefaults.colours;
      this.addStyle(this.constructStyle('backgroundColor', siteColours.secondary));
      this.addStyle(this.constructStyle('color', siteColours.textOnSecondary));
    }
  }

  getElementContent(): PageElementFirebaseData {
    return this.getBaseElementContent();
  }
}
