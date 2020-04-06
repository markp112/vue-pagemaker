import { PageData, PageContainer, PageElement, ComponentRef, ComponentDefinition } from '@/models/page/page';

export const componentClasses: ComponentDefinition[] = [{
    componentName: 'genericButton',
    class: 'inline-block h-10 w-auto p-2 bg-gray-600 cursor-pointer shadow shadow-xl text-red-500 hover:bg-gray-200 ',
    componentRef:'generic-button'
  },
]


export class ComponentBuilder {

  getComponentID (event: DragEvent): string {
    const dataTransfer = event.dataTransfer;
    return dataTransfer ? dataTransfer.getData('text') : '';
  }

  buildComponent(componentId: string | undefined, ref: ComponentRef, parent: ComponentRef): PageData {
    console.log('%c%s', 'color: #00a3cc', parent, "Parent ===>");
    switch(componentId) {
      case 'NavBar':
        return this.buildNavBar(ref, parent);
      case 'BaseButton':
        return this.buildBaseButton(ref, parent);
      case 'genericButton':
        return this.buildGenericButton(ref, parent, componentId);
      default:
        return this.buildNavBar(ref,parent);
    }

  }

  private buildNavBar(ref: string, parent: ComponentRef ): PageContainer {
    const navBar: PageContainer = new PageContainer();
    navBar.name = "navBar";
    navBar.ref = ref;
    navBar.isContainer = true;
    navBar.component = 'nav-bar-editor';
    navBar.parent = parent;
    return navBar;
  }

  private buildBaseButton(ref: string, parent: ComponentRef): PageElement {
    const baseButton = new PageElement();
    baseButton.name = 'baseButton';
    baseButton.ref = ref;
    baseButton.isContainer = false;
    baseButton.addStyle( {style:'background-color', value:'#004455' } ); 
    baseButton.addStyle( {style:'width', value: '150px' } ); 
    baseButton.addStyle( {style:'height', value:'40px' } );
    baseButton.component = 'base-button';
    baseButton.parent = parent,
    console.log('baseButton==>',baseButton)
    return baseButton
  }

  private buildGenericButton(ref: string, parent: ComponentRef, componentId: string): PageElement {
    console.log("buildGenericCalled")
    const genericButton = new PageElement();
    genericButton.ref = ref;
    genericButton.ref = ref;
    genericButton.isContainer = false;
    const componentDef:ComponentDefinition = componentClasses.filter(component => component.componentName = componentId)[0];
    console.log('%c⧭', 'color: #f2ceb6', componentDef);
    genericButton.classDefinition = componentDef.class;
    genericButton.component =  componentDef.componentRef;
    genericButton.parent = parent,
    console.log('genericButton==>',genericButton)
    return genericButton

  }

}