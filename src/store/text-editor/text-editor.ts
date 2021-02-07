// Controls the sidebar
import store from "@/store";
import {
  Module,
  Mutation,
  Action,
  VuexModule,
  getModule
} from "vuex-module-decorators";
import { Paragraph } from "@/models/editor/paragraph/paragraph";
import { Paragraphs } from "@/models/editor/paragraph/paragraphs";

export interface TextEditorInterface {
  textEditorParagaphs: Paragraphs;
}

@Module({ dynamic: true, name: "textEditor", store })
class TextEditorStore extends VuexModule implements TextEditorInterface {
  textEditorParagaphs: Paragraphs = new Paragraphs();

  @Mutation
  private addParagraph(paragraph: Paragraph) {
    this.textEditorParagaphs.add(paragraph);
  }

  @Mutation
  private deleteParagraph(id: string) {
    this.textEditorParagaphs.remove(id);
  }

  @Mutation
  private clearParagraphs() {
    this.textEditorParagaphs.clear();
  }

  @Action({ rawError: true })
  public addNewParagraph(paragraph: Paragraph) {
    this.context.commit("addParagraph", paragraph);
  }

  @Action({ rawError: true })
  public createParagraph(): Promise<string> {
    return new Promise(resolve => {
      const paragaph = new Paragraph(false);
      this.context.commit("addParagraph", paragaph);
      resolve(paragaph.id);
    });
  }

  @Action({ rawError: true })
  public removeParagraph(id: string) {
    this.context.commit("removeParagraph", id);
  }

  @Action({ rawError: true })
  public deleteAllParagraphs() {
    this.context.commit("clearParagraphs");
  }

  @Action({ rawError: true })
  buildParagraphs(content: string) {
    this.context.commit("clearParagraphs");
    const paras = content.split("<p");
    paras.forEach(para => {
      const hasUnderline = para.includes("underline");
      if (para !== "") {
        const id = this.context.getters.getId(para);
        const paragraph = new Paragraph(hasUnderline, id);
        this.context.commit("addParagraph", paragraph);
      }
    });
  }

  get getId(): (content: string) => string {
    return (content: string) => {
      const startOfId = content.indexOf("id") + 4;
      const endOfId = content.indexOf('"', startOfId);
      return content.substring(startOfId, endOfId);
    };
  }

  get paragraph(): (id: string) => Paragraph | null {
    return (id: string) => this.textEditorParagaphs.getParagraph(id);
  }

  get underLineCount(): (ids: string[]) => number {
    return (ids: string[]) => this.textEditorParagaphs.countOfUnderline(ids);
  }
}

export const TextModule = getModule(TextEditorStore);
