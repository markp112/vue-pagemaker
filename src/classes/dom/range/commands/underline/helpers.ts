export function  hasClassUnderline(node: Node): boolean {
  const spanElement = node as HTMLSpanElement;
  const className = spanElement.className;
  if (className) {
    return className.includes('underline');
  }
  return false;
}
