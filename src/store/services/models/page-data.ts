import { PageElementClasses } from "@/classes/page-element/factory/page-element-factory";
import { PageElementFirebaseData } from "@/classes/page-element/models/pageElements/PageElementModel";

export interface PageIdentity {
  siteId: string;
  userId: string;
  pageId: string;
}

export interface PageDataInterface {
  pageContent: PageElementClasses[];
}

export interface PageContainerFirebaseDataInterface {
  pageIdentity: PageIdentity;
  containerData: PageElementFirebaseData[];
}
