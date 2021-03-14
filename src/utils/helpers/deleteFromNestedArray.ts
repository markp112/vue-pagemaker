import { PageElementClasses } from '@/classes/page-element/factory/page-element-factory'
import { PageContainer } from '@/classes/page-element/PageContainer/PageContainer'

export const deleteAPageElement = function (pageElements: PageElementClasses[], elementRef: string): PageElementClasses[] {
    const tempElements =  pageElements.filter(element => {
    console.log('%c⧭', 'color: #00e600', element.isContainer);
    
    if (element.isContainer) {
      const container = element as PageContainer;
      container.elements = deleteAPageElement(container.elements, elementRef);
      console.log('%c⧭', 'color: #ff0000', container.elements);
    } 
    return element.ref !== elementRef;
  });
  console.log('%c⧭', 'color: #00a3cc', tempElements);
  return tempElements;
}