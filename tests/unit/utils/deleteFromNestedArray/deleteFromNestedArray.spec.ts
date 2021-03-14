import { PageElementClasses } from '@/classes/page-element/factory/page-element-factory';
import { ImageElement } from '@/classes/page-element/page-components/image-element/ImageElement';
import { TextElement } from '@/classes/page-element/page-components/text-element/TextElement';
import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';
import { PageContainer } from '@/classes/page-element/PageContainer/PageContainer';
import { deleteAPageElement } from '@/utils/helpers/deleteFromNestedArray';

describe('deleteAPageElement', () => {

  let pageElements: PageElementClasses[] = [];

  beforeEach(() => {
    pageElements = [];
    const container1: PageContainer = new PageElementBuilder()
      .setRef('ROOT')
      .setName('container:1')
      .setIsContainer(true)
      .buildAContainer();
    const image1: ImageElement = new PageElementBuilder()
      .setRef('Image:1')
      .setParentRef('ROOT')
      .setName('image:1')
      .buildAnImage();
    const text1: TextElement = new PageElementBuilder()
      .setRef('Text:1')
      .setParentRef('ROOT')
      .setName('Text:1')
      .buildAnImage();
    const text2: TextElement = new PageElementBuilder()
      .setRef('Text:2')
      .setParentRef('ROOT')
      .setName('Text:2')
      .buildAnImage();
      const image2: ImageElement = new PageElementBuilder()
        .setRef('Image:2')
        .setParentRef('ROOT')
        .setName('Image:2')
        .buildAnImage();
    pageElements.push(container1);
    pageElements.push(image1);
    pageElements.push(text1);
    container1.addNewElement(text2);
    container1.addNewElement(image2);
  })


  it('Should given the ref of a pageelement remove it from the array', () => {
    expect(pageElements.length).toEqual(3);
    pageElements = deleteAPageElement(pageElements, 'Image:1');
    expect(pageElements.length).toEqual(2);
    expect(pageElements.filter(element => element.ref === 'Image:1').length).toEqual(0);
    })
  
    it('Should given the ref of a pageelement remove it from a containers elements array', () => {
      const container: PageContainer = (pageElements.filter(element => element.ref === 'ROOT')[0] as PageContainer);
    expect(pageElements.length).toEqual(3);
    expect(container.elements.length).toEqual(2);
    console.log('%c⧭', 'color: #8c0038', container.elements.length);
    pageElements = deleteAPageElement(pageElements, 'Image:2');
    expect(container.elements.length).toEqual(1);
    expect(container.elements.filter(element => element.ref === 'Image:2').length).toEqual(0);
    })

    

}) 