// setup file

import { JsxEmit } from 'typescript';
import { mockStartContainer, mockEndContainer, mockCommonAncestorContainer } from './mocks/mocks'


// if ((global as NodeJS.Global).document) {
  document.createRange = () => ({

    startContainer: mockStartContainer,
    //@ts-ignore
    commonAncestorContainer: mockCommonAncestorContainer,
 
    endContainer: mockEndContainer,
    
    nodeName: 'SPAN',
    parentNode: jest.fn(),
    extractContents: jest.fn(),
    insertNode: jest.fn(),
    cloneContents: jest.fn(),
    collapse: jest.fn(),
    cloneRange: jest.fn(),
    compareBoundaryPoints: jest.fn(),
    comparePoint: jest.fn(),
    createContextualFragment: jest.fn(),
    deleteContents: jest.fn(),
    detach: jest.fn(),
    getBoundingClientRect: jest.fn(),
    getClientRects: jest.fn(),
    isPointInRange: jest.fn(),
    intersectsNode: jest.fn(),
    selectNode: jest.fn(),
    selectNodeContents: jest.fn(),
    setEnd: jest.fn(),
    setEndAfter: jest.fn(),
    setEndBefore: jest.fn(),
    setStart: jest.fn(),
    setStartAfter: jest.fn(),
    setStartBefore: jest.fn(),
    startOffset: 0,
    endOffset: 0,
    surroundContents: jest.fn(),
    END_TO_END: 0,
    START_TO_END: 0,
    START_TO_START: 0,
    END_TO_START: 0,
    collapsed: false,



  });
// }

