export interface Site {
  userId?: string;
  siteId: string,
  name: string,
  created: Date,
  description?: string,
  url?: string,
  image?: string,
  published?: Date,
  hostRepo?: string
}

export const initSite: Site = {siteId:'', name: '', created: new Date()};

export class ASite implements Site {
  _userId?: string | undefined;
  _siteId: string;
  _name: string;
  _created: Date;
  _description?: string | undefined;
  _url?: string | undefined;
  _image?: string | undefined;
  _published?: Date | undefined;
  _hostRepo?: string | undefined;
  
  constructor( siteId: string, name: string, created: Date) {
    this._siteId = siteId;
    this._name = name;
    this._created = created;
  }

  get getSiteAsSite(): Site {
   const site : Site ={
      siteId: this._siteId,
      userId: this._userId,
      name: this._name,
      created: this._created,
    }


    if(this._description !== undefined) {
      site.description = this._description;
    }

    if(this._url !== undefined) {
      site.url = this._url;
    }

    return site;
  }

  get userId(): string {
    return this._userId === undefined ? '' : this._userId;
  }

  set userId(id: string ) {
    this._userId = id;
  }

  get siteId(): string {
    return  this._siteId
  }
  
  set siteId(id: string ) {
    this._siteId = id
  }

  get name(): string {
    return this._name
  }
  
  set name(name: string ) {
    this._name = name
  }
  
  get description(): string {
    return this._description === undefined ? '' : this._description
  }
  
  set description(description: string ) {
    this._description = description
  }

  get url(): string {
    return this._url === undefined ? '' : this._url
  }
  
  set url(url: string ) {
    this._url = url
  }
    
  get image(): string {
    return this._image === undefined ? '' : this._image;
  }
  
  set image(image: string ) {
    this._image = image;
  }

  get hostRepo(): string {
    return this._hostRepo === undefined ? '' : this._hostRepo;
  }
  
  set hostRepo(hostRepo: string ) {
    this._hostRepo = hostRepo;
  }

  get created(): Date {
  return this._created;
}

set created(created: Date ) {
  this._created = created;
}

get published(): Date | undefined {
  return this._published;
}

set published(published: Date | undefined) {
  this._published = published;
}

getSiteDocumentId(): string {
  return  this._userId + '::' + this._siteId;
}

}