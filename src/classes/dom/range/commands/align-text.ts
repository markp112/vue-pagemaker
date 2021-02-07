import { PageModule } from "@/store/page/page";

export class AlignText {
  /** Aligns text-editor text within the entire text editor block */
  public alignText(alignment: string, textEditorRef: HTMLDivElement) {
    textEditorRef.classList.forEach((classElement, index) => {
      if (classElement.startsWith("text-") && classElement !== "text-editor") {
        PageModule.deleteClassFromEditedComponent(classElement);
        textEditorRef.classList.remove(classElement);
      }
    });
    textEditorRef.classList.add(alignment);
    PageModule.updateComponentClassProperties(alignment);
  }
}
