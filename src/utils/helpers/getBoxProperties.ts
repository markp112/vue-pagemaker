import { BoxProperties } from '@/models/components/box-dimension';

export function getElementBoxProperties(element: HTMLDivElement): BoxProperties {
  const boundingRect: BoxProperties = {
    width: element.getBoundingClientRect().width,
    height: element.getBoundingClientRect().height,
    top: element.getBoundingClientRect().top,
    left: element.getBoundingClientRect().left,
  };
  return boundingRect;
}