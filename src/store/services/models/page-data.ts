import { PageElementClasses } from '@/classes/page-element/factory/page-element-factory';
import { PageContainerFirebaseData } from '@/classes/page-element/models/page-container/PageContainer';
import { PageElementFirebaseData } from '@/classes/page-element/models/pageElements/pageElement';

export interface PageIdentity {
  siteId: string;
  userId: string;
  pageId: string;
}

export interface PageDataInterface {
 
  pageContent: PageElementClasses[];
}

export interface PageContainerFirebaseDataInterface {
  pageIdentity: PageIdentity,
  containerData: PageElementFirebaseData[],
}