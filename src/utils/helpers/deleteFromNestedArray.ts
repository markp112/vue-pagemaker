import { PageElementClasses } from '@/classes/page-element/factory/page-element-factory'
import { PageContainer } from '@/classes/page-element/PageContainer/PageContainer'

export const deleteAPageElement = function (pageElements: PageElementClasses[], elementRef: string): PageElementClasses[] {
    const tempElements =  pageElements.filter(element => {
    
    if (element.isContainer) {
      const container = element as PageContainer;
      container.elements = deleteAPageElement(container.elements, elementRef);
    } 
    return element.ref !== elementRef;
  });
  return tempElements;
}