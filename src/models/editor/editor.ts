import Guid from '@/utils//guid';

export interface ParagraphFlagsInterface {
  hasUnderline: boolean;
  id: string;
}

export class Paragraph implements ParagraphFlagsInterface {
    _hasUnderline: boolean;
    _id = '';

  constructor(hasUnderline: boolean, id = Guid.newSmallGuid()) {
    this._hasUnderline = hasUnderline;
    this._id = id;
  }

  get hasUnderline(): boolean {
    return this._hasUnderline;
  }

  set hasUnderline(hasUnderline: boolean) {
    this._hasUnderline = hasUnderline;
  }

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }
}
/**
 * @description maintains a list of the paragraphs in the text editor each paragraph is given a unique id 
 */
export class Paragraphs {
  private paragraphs: Paragraph[] = [];

  length() {
    return this.paragraphs.length;
  }

  add(paragraph: Paragraph) {
    if (!this.getParagraph(paragraph.id)) {
      this.paragraphs.push(paragraph);
    }
  }

  clear() {
    this.paragraphs = [];
  }

  remove(id: string){
    this.paragraphs = this.paragraphs.filter(para => para.id !== id);
  }

  getParagraph(id: string): Paragraph {
    return this.paragraphs.filter(para => para.id === id)[0];
  }

  countOfUnderline(ids: string[]) {
    let count = 0;
    ids.forEach(element => {
      const underline = this.getParagraph(element).hasUnderline;
      count += underline ? 1 : 0;
    });
    return count;
  }
}