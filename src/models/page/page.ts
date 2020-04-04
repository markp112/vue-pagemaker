export interface style {
  name: string;
  value: string;
}


export interface PageElement {
  name: string;
  ref: string;
  component: string;
  isContainer: boolean;
  styles:style [];

}



export interface PageContainer extends PageElement {
  elements: PageElement []
}


export type PageData = PageElement | PageContainer;