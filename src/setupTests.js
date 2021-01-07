// setup file


if (global.document) {
  document.createRange = () => ({
    setStart: jest.fn(),
    setEnd: jest.fn(),
    nodeName: 'BODY',
    parentNode: jest.fn(),
    extractContents: jest.fn(),
    insertNode: jest.fn(),
    

    // @ts-ignore
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document,
      hasChildNodes: jest.fn(),
      parentNode: jest.fn(),
    },
 
    startContainer: {
      nodeName: 'BODY',
      ownerDocument: document,
      hasChildNodes: jest.fn(),
      parentNode: jest.fn(),
    },
 
    endContainer: {
      nodeName: 'BODY',
      ownerDocument: document,
      hasChildNodes: jest.fn(),
      parentNode: jest.fn(),
    },
 
    
  });
}