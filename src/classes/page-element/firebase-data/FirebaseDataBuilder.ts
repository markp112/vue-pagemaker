import { SiteDefaults } from '@/classes/settings/site-defaults/site-defaults';
import { ActionEvent } from '@/models/components/base-component';
import { BoxDimensions } from '@/models/components/box-dimension';
import { Notification } from '@/models/notifications/notifications';
import { PageModule } from '@/store/page/page';
import { PageContainerFirebaseDataInterface, PageIdentity } from '@/store/services/models/page-data';
import { ServicesModule } from '@/store/services/services';
import { PageElementClasses, PageElementFactory } from '../factory/page-element-factory';
import { PageContainerFirebaseData } from '../models/page-container/PageContainer';
import { PageElementFirebaseData } from '../models/pageElements/pageElement';
import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';
import { PageContainer } from '../PageContainer/PageContainer';
import { PageElement } from '../PageElement';
import { ButtonElement } from '../page-components/button-element/ButtonElement';
import { ImageElement } from '../page-components/image-element/ImageElement';
import { TextElement } from '../page-components/text-element/TextElement';

export type FirebasePageDataTypes = PageContainerFirebaseData | PageElementFirebaseData;

export class FirebaseDataBuilder {
  
  siteDefaults = SiteDefaults.getInstance();
  componentFactory = new PageElementFactory();

  private getContainerProperties(container: PageContainer ): PageElementFirebaseData {
    // return the properties of the container without the elements as these are classes which
    // firebase does not handle.
    return {
      actionEvent: container.actionEvent.toObject,
      boxDimensions: container.boxDimensions.toObject,
      classDefinition: container.classDefinition,
      componentHTMLTag: container.componentHTMLTag,
      content: container.content,
      isContainer: container.isContainer,
      name: container.name,
      parentRef: container.parentRef,
      ref: container.ref,
      styles: container.styles,
      type: container.type,
    }
  }

  private getElements(elements: PageElementClasses[]): FirebasePageDataTypes[] {
    const data: FirebasePageDataTypes[] = [];
    elements.forEach(element => {
      if (element) {
        if (element.isContainer) {
          const container: PageElementClasses[] = (element as PageContainer).elements;
          const containerElement = (this.getContainerProperties((element as PageContainer))) as PageContainerFirebaseData;
          containerElement.elements = this.getElements(container);
          data.push(containerElement);
        }
        const elem = element.getElementContent();
        data.push(elem);
      }
    })
    return data;
  }

  savePageData(pageElement: PageElementClasses[], pageName: string): Promise<Notification> {
    const siteId = this.siteDefaults.siteId;
    const userId = this.siteDefaults.userId;
    const pageData: FirebasePageDataTypes[] = [];
    pageElement.forEach(container => {
      if (container) { 
        const pageContainer = container as PageContainer;
        const containerData = (this.getContainerProperties(pageContainer)) as PageContainerFirebaseData;
        containerData.elements = (this.getElements(pageContainer.elements));
        pageData.push(containerData);
        }
    });
    const firebaseData: PageContainerFirebaseDataInterface = {
      pageIdentity: {
        siteId: siteId,
        userId: userId,
        pageId: pageName,
      },
      containerData: pageData
    };
    return new Promise((resolve, reject) => {
      ServicesModule.firestoreSavePage(firebaseData)
      .then (notification => {
        resolve(notification);
      })
      .catch(err => {
        reject(err);
      });
    });
  }

  public retrievePageDataFromFirestore(pageName: string) {
    let pageData: FirebasePageDataTypes[] = [];
    const data: PageIdentity = {
      siteId: this.siteDefaults.siteId,
      userId: this.siteDefaults.userId,
      pageId: pageName,
    }
    ServicesModule.firestoreLoadPageData(data)
    .then(response => {
      console.log('%c⧭', 'color: #e5de73', response);
      pageData = response as FirebasePageDataTypes[];
      const rootComponent = this.componentFactory.createElement('rootContainer','ROOT') as PageContainer;
       const component = pageData as PageContainerFirebaseData[];
      // const container = this.createComponent(rootComponent, component) as PageContainer;
      console.log('%c⧭', 'color: #cc0036', component);
      // const rootContainer: PageContainer = this.componentFactory.createElement(container.type, container.componentRef, container, null) as PageContainer;
      this.buildPageElements(pageData, rootComponent);
      console.log('%c⧭', 'color: #ff6600', rootComponent);
      PageModule.updatePageElements(rootComponent.elements)
    })
    .catch(err => {
      console.log(err)
    })

  }

  buildPageElements(pageData: FirebasePageDataTypes[], parentContainer: PageContainer) {
    pageData.forEach(item => {
      if (item.isContainer) {
        const container = this.createComponent(parentContainer, item) as PageContainer;
        parentContainer.elements.push(container);
        this.buildPageElements((item as PageContainerFirebaseData).elements, container)
      } else {
        const component = this.createComponent(parentContainer, item) as PageElementClasses;
        parentContainer.elements.push(component);
      }
    });   
    return parentContainer;   
  }

  private createComponent(parentComponent: PageContainer, item: FirebasePageDataTypes): PageElementClasses {
    if (item.isContainer) {
      return this.buildAContainer(parentComponent, item);
    } else {
      switch(item.type) {
        case 'button':
          return this.buildAButton(parentComponent, item);
        case 'image':
          return this.buildAnImage(parentComponent, item);
        case 'text':
          return this.buildText(parentComponent, item);
      }
    }
  }

  private buildAContainer(parentComponent: PageContainer, item: FirebasePageDataTypes): PageContainer {
    const pageContainer: PageContainer = new PageElementBuilder()
        .setActionEvent(new ActionEvent(item.actionEvent.actionType, item.actionEvent.eventAction))
        .setBoxDimensions(new BoxDimensions(
          item.boxDimensions.width,
          item.boxDimensions.height,
          item.boxDimensions.top,
          item.boxDimensions.left,
        ))
        .setRef(item.ref)
        .setIsContainer(item.isContainer)
        .setName(item.name)
        .setParent(parentComponent)
        .setStyles(item.styles)
        .setType(item.type)
        .setClassDefintion(item.classDefinition)
        .setComponentHtmlTag(item.componentHTMLTag)
        .setContent(item.content)
        .buildAContainer();
        return pageContainer;
  }
  
  private buildAButton(parentComponent: PageContainer, item: FirebasePageDataTypes): ButtonElement {
    console.log('%c⧭', 'color: #86bf60', item);
    const pageElement: ButtonElement = new PageElementBuilder() .setActionEvent(new ActionEvent(item.actionEvent.actionType, item.actionEvent.eventAction))
    .setBoxDimensions(new BoxDimensions(
      item.boxDimensions.width,
      item.boxDimensions.height,
      item.boxDimensions.top,
      item.boxDimensions.left,
    ))
    .setRef(item.ref)
    .setIsContainer(item.isContainer)
    .setName(item.name)
    .setParent(parentComponent)
    .setStyles(item.styles)
    .setType(item.type)
    .setClassDefintion(item.classDefinition)
    .setComponentHtmlTag(item.componentHTMLTag)
    .setContent(item.content)
    .buildAButton();
    console.log('%c⧭', 'color: #ace2e6', pageElement);
    return pageElement;
  }

  private buildAnImage(parentComponent: PageContainer, item: FirebasePageDataTypes): ImageElement {
    const pageElement: ImageElement = new PageElementBuilder() .setActionEvent(new ActionEvent(item.actionEvent.actionType, item.actionEvent.eventAction))
    .setBoxDimensions(new BoxDimensions(
      item.boxDimensions.width,
      item.boxDimensions.height,
      item.boxDimensions.top,
      item.boxDimensions.left,
    ))
    .setRef(item.ref)
    .setIsContainer(item.isContainer)
    .setName(item.name)
    .setParent(parentComponent)
    .setStyles(item.styles)
    .setType(item.type)
    .setClassDefintion(item.classDefinition)
    .setComponentHtmlTag(item.componentHTMLTag)
    .setContent(item.content)
    .buildAnImage();
    console.log('%c⧭', 'color: #40fff2', pageElement);
    return pageElement;
  }

  private buildText(parentComponent: PageContainer, item: FirebasePageDataTypes): TextElement {
    const pageElement: TextElement = new PageElementBuilder() .setActionEvent(new ActionEvent(item.actionEvent.actionType, item.actionEvent.eventAction))
    .setBoxDimensions(new BoxDimensions(
      item.boxDimensions.width,
      item.boxDimensions.height,
      item.boxDimensions.top,
      item.boxDimensions.left,
    ))
    .setRef(item.ref)
    .setIsContainer(item.isContainer)
    .setName(item.name)
    .setParent(parentComponent)
    .setStyles(item.styles)
    .setType(item.type)
    .setClassDefintion(item.classDefinition)
    .setComponentHtmlTag(item.componentHTMLTag)
    .setContent(item.content)
    .buildATextElement();
    return pageElement;
  }
}
