import { SiteIdAndUserId } from '@/models/site-and-user/site-and-user';

export class SiteAndUserId implements SiteIdAndUserId {

  constructor(siteAndUserId: SiteIdAndUserId) {
    this._siteId = siteAndUserId.siteId;
    this._userId = siteAndUserId.userId;
  }
  _siteId: string;
  _userId: string;

  get siteId(): string {
    return this._siteId;
  }

  get userId(): string {
    return this._userId;
  }
  

  validate(): boolean {
    if (!this.siteId) {
      throw new Error('Failed validation: invalid siteId');
    }
    if(!this.userId) {
      throw new Error('Failed validation: invalid siteId');
    }
    return true;
  }
}