
export let mockStartContainer: Node = document.createElement('p');
export let mockEndContainer: Node = document.createElement('p');
export let mockCommonAncestorContainer: Node = document.createElement('p');

export function setStartMock(node: Node) {
  mockStartContainer = node;
}

export function setEndMock(node: Node) {
  mockEndContainer = node;
}

export function setCommonAncestorMock(node: Node) {
  mockCommonAncestorContainer = node;
}

