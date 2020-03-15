export interface Site {
  siteId: string,
  name: string,
  created: Date,
  description?: string,
  url?: string,
  image?: string,
  published?: Date,
  hostRepo?: string
}

export const  siteInit: Site = {
  siteId: '',
  name: '',
  created: new Date(),
}