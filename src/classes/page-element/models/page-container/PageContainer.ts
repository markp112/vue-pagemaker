import { PageElementClasses } from '../../factory/page-element-factory';
import { FirebasePageDataTypes } from '../../firebase-data/FirebaseDataBuilder';
import { PageElementFirebaseData, PageElementInterface } from '../pageElements/pageElement';

export type StyleTypes = 'border';
export interface PageContainerInterface extends PageElementInterface {
  elements: PageElementClasses[];
}

export interface PageContainerFirebaseData extends PageElementFirebaseData {
  elements: FirebasePageDataTypes[];
}
