import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';
import { PageElement } from '../../PageElement';
import { SiteDefaults } from '@/classes/settings/site-defaults/site-defaults';

export class ButtonElement extends PageElement {
  _content: string;
  constructor(builder: PageElementBuilder) {
    super(builder);
    this._content = builder.content;
  }

  get content(): string {
    return this._content;
  }

  set content(content: string) {
    this._content = content;
  }

  setDefaultStyle() {
    const siteDefaults = SiteDefaults.getInstance();
    this.addStyle(this.constructStyle('fontFamily', siteDefaults.typography.fontName));
    this.addStyle(this.constructStyle('fontSize', siteDefaults.typography.fontSizeBody));
    const siteColours = siteDefaults.colours;
    this.addStyle(this.constructStyle('backgroundColor', siteColours.secondary));
    this.addStyle(this.constructStyle('color', siteColours.textOnSecondary));
  }
}
