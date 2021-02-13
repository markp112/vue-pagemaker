import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';
import { ActionEvent } from '@/models/components/base-component';
import { BoxDimensionsInterface, Dimension } from '@/models/components/box-dimension';
import { Style } from '@/models/styles/styles';
import { PageElement } from '../../../../src/classes/page-element/PageElement';

describe('PageElement', () => {
  let pageElement: PageElement;

  const boxDimensions: BoxDimensionsInterface = {
    top: new Dimension(10, 'px'),
    left: new Dimension(20, 'px'),
    width: new Dimension(200, 'px'),
    height: new Dimension(220, 'px')
  }
  const styles: Style[] = [
    { style: 'fontSize', value: '16px' },
    { style: 'color', value: '#ffee4e' }
    
  ]


  beforeEach(() => {
    pageElement = new PageElementBuilder().build();
  })
  
  describe('buildBoxDimensions', () => {

    it('should build a box dimensions class on PageElement', () => {
      
      pageElement.buildBoxDimensions(boxDimensions);
      expect(pageElement.boxDimensions.height).toEqual(boxDimensions.height);
      expect(pageElement.boxDimensions.width).toEqual(boxDimensions.width);
      expect(pageElement.boxDimensions.top).toEqual(boxDimensions.top);
      expect(pageElement.boxDimensions.left).toEqual(boxDimensions.left);
    });

  it('should build a box dimensions class on PageElement', () => {
      const top: Dimension = new Dimension(10, 'px');
      const left: Dimension = new Dimension(20, 'px');
      const width: Dimension = new Dimension(200, 'px');
      const height: Dimension = new Dimension(220, 'px');
      pageElement.buildBoxDimensions({ left, height, width, top });
      expect(pageElement.boxDimensions.height).toEqual(height);
      expect(pageElement.boxDimensions.width).toEqual(width);
      expect(pageElement.boxDimensions.top).toEqual(top);
      expect(pageElement.boxDimensions.left).toEqual(left);
    });
  })

  describe('getBaseElementContent', () => {

    it('should return a set of values for firebase', () => {

      pageElement = new PageElementBuilder()
        .setName('test component')
        .setRef('component ref')
        .setComponentHtmlTag('span')
        .setIsContainer(false)
        .setStyles(styles)
        .setParentRef('parent')
        .setClassDefintion('flex flex row')
        .setType('button')
        .setActionEvent(new ActionEvent('Navigation', 'home'))
        .setBoxDimensions(boxDimensions)
        .setContent('Button Label')
        .build();
      const baseElementContent = pageElement.getBaseElementContent();
      expect(baseElementContent.type).toEqual(pageElement.type);
      expect(baseElementContent.ref).toEqual(pageElement.ref);
      expect(baseElementContent.componentHTMLTag).toEqual(pageElement.componentHTMLTag);
      expect(baseElementContent.isContainer).toEqual(pageElement.isContainer);
      expect(baseElementContent.styles).toEqual(pageElement.styles);
      expect(baseElementContent.parentRef).toEqual(pageElement.parentRef);
      expect(baseElementContent.classDefinition).toEqual(pageElement.classDefinition);
      expect(baseElementContent.actionEvent).toEqual(pageElement.actionEvent.toObject);
      expect(baseElementContent.boxDimensions).toEqual(pageElement.boxDimensions.toObject);
      expect(baseElementContent.content).toEqual(pageElement.content);
      
    })
  })

  describe('reSize', () => {

    it('should only update the height and width properties of boxDimensions', () => {
      pageElement.buildBoxDimensions(boxDimensions);
      boxDimensions.height.value = 500;
      boxDimensions.width.value = 600;
      boxDimensions.top.value = 50;
      boxDimensions.left.value = 90;
      pageElement.reSize(boxDimensions);
      expect(pageElement.boxDimensions.height.value).toEqual(boxDimensions.height.value);
      expect(pageElement.boxDimensions.width.value).toEqual(boxDimensions.width.value);
      expect(pageElement.boxDimensions.top.value).toEqual(10);
      expect(pageElement.boxDimensions.left.value).toEqual(20);
  
    });
  })

  describe('addStyle', () => {
    
  it('should replace a style if it does not already exist', () => {
      const style: Style = pageElement.constructStyle('color', 'red');
      pageElement.addStyle (style);
      expect(pageElement.styles.length).toBe(1);
      style.value = 'green';
      pageElement.addStyle (style);
      expect(pageElement.styles.length).toBe(1);
      expect(pageElement.styles[0].value).toBe('green');
    });
  });
  
  describe('removeStyle', () => {
    
    it('should remove a style from the list of styles', () => {
      const style: Style = pageElement.constructStyle('color', 'red');
      pageElement.addStyle (style);
      const style2: Style = pageElement.constructStyle('font-family', 'calibri');
      pageElement.addStyle(style2);
      expect(pageElement.styles.length).toBe(2);
      pageElement.removeStyle('font-family')
      expect(pageElement.styles.length).toBe(1);
      expect(pageElement.styles[0].style).toBe('color');
    });
  });

  describe('getStylesToString', () => {
    
    it('should return the Styles[] formatted as a style string', () => {
      const style: Style = pageElement.constructStyle('color', 'red');
      pageElement.addStyle (style);
      const styleAsString: string = pageElement.getStylesToString();
      expect(styleAsString).toEqual('color:red;height:0px;width:0px;')
      
    });
  });

  describe('addClass', () => {

    it('should add a class to the classDefintion', () => {
      pageElement.addClass('flex flex-row');
      expect(pageElement.classDefinition).toEqual('flex flex-row');
      pageElement.addClass('absolute');
      expect(pageElement.classDefinition).toEqual('flex flex-row absolute');

    });
    
  });
})