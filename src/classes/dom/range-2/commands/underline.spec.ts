import { Underline } from './underline';
import { shallowMount } from "@vue/test-utils";



describe("Underline Class", () => {
  let underline: Underline;

  beforeEach(() => {
  
    const range = document.createRange();
    underline = new Underline(range);
  })

  test("When add is called it should return a span node with a css class text-decoration and underline present", () => {
    const spanNode = document.createElement('span');
    const underlinedNode: Node = underline.add(spanNode);
    const element: HTMLSpanElement = underlinedNode as HTMLSpanElement;
    expect(element.className.includes('text-decoration')).toBeTruthy();
    expect(element.className.includes('underline')).toBeTruthy();
  })

 


})




