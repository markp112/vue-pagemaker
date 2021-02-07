import { RangeStyles } from "../../../../../../src/classes/dom/range/rangeStyling/rangeStyles";
import { DomTestCaseData } from "./test-builder-classes";
import { Style } from "@/models/styles/styles";

describe("RangeStyles", () => {

  let domTestCaseData: DomTestCaseData = new DomTestCaseData();

  beforeEach(() => {
    domTestCaseData = new DomTestCaseData();
  })

  describe("isStyleTag", () => {
    const rangeStyle = new RangeStyles();

    it("should return true if passed 'style'", () => {
      const result = rangeStyle.isStyleTag("style");
      expect(result).toBeTruthy();
    });

    it("should return false if passed 'class'", () => {
      const result = rangeStyle.isStyleTag("class");
      expect(result).toBeFalsy();
    });
  })

  describe("setStyleOrClass is called with a style", () => {
    const rangeStyle = new RangeStyles();

    it("It should call setStyle", () => {
      const setStyleSpy = jest.spyOn(rangeStyle, "setStyle");
      const style: Style = { style: "font-size", value: "24px" };
      const node: Node = domTestCaseData.paragraphWithPlainSpans.childNodes[1];
      const node2 = rangeStyle.setStyleOrClass(node, style, "style");
      expect(setStyleSpy).toHaveBeenCalled();
    });

    it("It should have a style tag set", () => {
      const style: Style = { style: "font-size", value: "24px" };
      const node: Node = domTestCaseData.paragraphWithPlainSpans.childNodes[1];
      const node2 = rangeStyle.setStyleOrClass(node, style, "style");
      expect((node2 as HTMLSpanElement).outerHTML.includes('style="')).toBe(true);
      expect(
        (node2 as HTMLSpanElement).outerHTML.includes("font-size: 24px;")
      ).toBe(true);
    });

    it("It should add a new style to an existing style", () => {
      const style: Style = { style: "font-size", value: "24px" };
      const node: Node = domTestCaseData.paragraphWithStyledSpan.childNodes[1];
      const node2 = rangeStyle.setStyleOrClass(node, style, "style");
      expect((node2 as HTMLSpanElement).outerHTML.includes('style="')).toBe(true);
      expect(
        (node2 as HTMLSpanElement).outerHTML.includes("font-size: 24px;")
      ).toBe(true);
      expect((node2 as HTMLSpanElement).outerHTML.includes("color: red;")).toBe(
        true
      );
    });
  })

  describe("setStyleOrClass is called with a class", () => {
    const rangeStyle = new RangeStyles();

    it("It should call setClass", () => {
      const setStyleSpy = jest.spyOn(rangeStyle, "setClass");
      const style: Style = { style: "text-decoration", value: "underline" };
      const node: Node = domTestCaseData.paragraphWithPlainSpans.childNodes[1];
      const node2 = rangeStyle.setStyleOrClass(node, style, "class");
      expect(setStyleSpy).toHaveBeenCalled();
    });

    it("It should have a class property", () => {
      const style: Style = { style: "text-decoration", value: "underline" };
      const node: Node = domTestCaseData.paragraphWithPlainSpans.childNodes[1];
      const node2 = rangeStyle.setStyleOrClass(node, style, "class");
      expect((node2 as HTMLSpanElement).outerHTML.includes('class="')).toBe(true);
      expect(
        (node2 as HTMLSpanElement).outerHTML.includes("text-decoration underline")
      ).toBe(true);
    });

    it("It should add a new class to an existing class", () => {
      const style: Style = { style: "text-decoration", value: "italic" };
      const node: Node =
        domTestCaseData.paragraphWithUnderlineSpanAndNestedPlainSpan.childNodes[0];
      const node2 = rangeStyle.setStyleOrClass(node, style, "class");
      expect((node2 as HTMLSpanElement).outerHTML.includes('class="')).toBe(true);
      expect((node2 as HTMLSpanElement).outerHTML.includes("underline")).toBe(
        true
      );
      expect((node2 as HTMLSpanElement).outerHTML.includes("italic")).toBe(true);
    });
  })

  describe("clearExistingClasses", () => {
    const rangeStyle = new RangeStyles();

  it("It should clear all class content from the node of that class type", () => {
      const style: Style
        = { style: "underline", value: "" };
      const node: Node =
        domTestCaseData.paragraphWithUnderlineSpanAndNestedPlainSpan.childNodes[0];
      let outerHtml = (node as HTMLSpanElement).outerHTML;
      const includesUnderline = outerHtml.includes('class="underline"');
      expect(includesUnderline).toBe(true);
      const node2 = rangeStyle.clearExistingClasses(node, style);
      outerHtml = (node2 as HTMLSpanElement).outerHTML;
      expect(outerHtml.includes('class=""')).toBe(true);
    });

    it("It should clear all class content from the node and child nodes of that class type", () => {
        const style: Style = { style: "underline", value: "" };
        const node: Node =
          domTestCaseData.paragraphWithUnderlineSpanAndNestedUnderlineSpan.childNodes[0];
        let childNode: Node = node.childNodes[1];
        let outerHtml = (childNode as HTMLSpanElement).outerHTML;
        expect(outerHtml.includes('class="underline"')).toBe(true);
        const node2 = rangeStyle.clearExistingClasses(node, style);
        outerHtml = (node2 as HTMLSpanElement).outerHTML;
        expect(outerHtml.includes('class=""')).toBe(true);
        childNode = node2.childNodes[1];
        outerHtml = (childNode as HTMLSpanElement).outerHTML;
        expect(outerHtml.includes('class=""')).toBe(true);
      });
  })

  describe("clearExistingStyles", () => {
    const rangeStyle = new RangeStyles();

    it("It should remove the style from the node", () => {
      const style: Style = { style: "color", value: "" };
      const node: Node = domTestCaseData.paragraphWithStyledSpan;
      let outerHtml = (node as HTMLSpanElement).outerHTML;
      expect(outerHtml.includes('style="color: red;"')).toBe(true);
      const node2 = rangeStyle.clearExistingStyles(node, style);
      outerHtml = (node2 as HTMLSpanElement).outerHTML;
      expect(outerHtml.includes('style="color: red;"')).toBe(false);
    });
  })

  describe("removeNodesWithEmptyStyles", () => {
    const rangeStyle = new RangeStyles();

    it("It should remove the span node if it has an empty class and style", () => {
      const style: Style = { style: "color", value: "" };
      const node: Node = domTestCaseData.paragraphWithStyledSpan;
      let outerHtml = (node as HTMLSpanElement).outerHTML;
      expect(outerHtml.includes('style="color: red;"')).toBe(true);
      const node2 = rangeStyle.clearExistingStyles(node, style);
      outerHtml = (node2 as HTMLSpanElement).outerHTML;
      expect(outerHtml.includes('style=""')).toBe(true);
      const node3 = rangeStyle.removeNodesWithEmptyStyles(node2);
      outerHtml = (node3 as HTMLElement).outerHTML;
      expect(outerHtml.includes("span")).toBe(false);
    });

    it("It should not remove the span node if it does not have an empty style", () => {
      const node: Node = domTestCaseData.paragraphWithStyledSpan;
      let outerHtml = (node as HTMLSpanElement).outerHTML;
      expect(outerHtml.includes("span")).toBe(true);
      const node2 = rangeStyle.removeNodesWithEmptyStyles(node);
      outerHtml = (node2 as HTMLElement).outerHTML;
      expect(outerHtml.includes("span")).toBe(true);

    });

    it("It should not remove the span node if it does not have an empty class", () => {
      const node: Node = domTestCaseData.paragraphWithUnderlineSpanAndNestedPlainSpan;
      let outerHtml = (node as HTMLSpanElement).outerHTML;
      expect(outerHtml.includes('class="underline"')).toBe(true);
      const node2 = rangeStyle.removeNodesWithEmptyStyles(node);
      outerHtml = (node2 as HTMLElement).outerHTML;
      expect(outerHtml.includes('<span class="underline"')).toBe(true);
    });

    it("It should remove empty child spans without styling or classes", () => {
      const node: Node = domTestCaseData.paragraphWithUnderlineSpanAndNestedPlainSpan;
      expect(node.childNodes.length).toEqual(3);
      const node2 = rangeStyle.removeNodesWithEmptyStyles(node);
      const outerHtml = (node2 as HTMLElement).outerHTML;
      expect(countSpans(outerHtml)).toEqual(2);
    });


  })

  describe("getStylesFromNode", () => {
    const rangeStyle = new RangeStyles();

    it("it should return an array containing all of the styles attached to the span", () => {
      const node: Node = domTestCaseData.paragraphWithStyledSpan;
      const styles: Style[] = rangeStyle.getStylesFromNode(node.childNodes[1]);
      expect(styles.length).toEqual(1);
      expect(styles[0].style).toEqual('color');
    });

    it("it should return an array containing all of the styles attached to the span", () => {
      let node: Node = domTestCaseData.paragraphWithStyledSpan;
      const node2 = rangeStyle.setStyleOrClass(node.childNodes[1], { style: 'font-size', value: '16px' }, 'style');
      const styles: Style[] = rangeStyle.getStylesFromNode(node.childNodes[1]);

      expect(styles.length).toEqual(2);
      expect(styles[0].style).toEqual('color');
      expect(styles[1].style).toEqual('font-size');
    });
  })

  describe("getStylesFromNodeHierarchy", () => {
    const rangeStyle = new RangeStyles();

    it("it should return an array containing all of the styles from the child node up to the parentNode", () => {
      const node: Node = domTestCaseData.paragraphWithStyledSpan;
      const styles: Style[] = rangeStyle.getStylesFromNode(node.childNodes[1]);
      expect(styles.length).toEqual(1);
      expect(styles[0].style).toEqual('color');
    });

    it("it should return an array containing all of the styles attached to the span", () => {
      let node: Node = domTestCaseData.paragraphWithNestedStyledSpans;
      const styles: Style[] = rangeStyle.getStylesFromNodeHeirarchy(node.childNodes[1].childNodes[1], node);
      expect(styles.length).toEqual(2);
      expect(styles[0].style).toEqual('font-size');
      expect(styles[1].style).toEqual('color');
    });
  })

  describe("getClassesFromNode", () => {
    const rangeStyle = new RangeStyles();

    it("it should return a string containing all of the claases attached to the span", () => {
      const node: Node = domTestCaseData.paragraphWithUnderlineSpanAndNestedPlainSpan;
      const classes: string = rangeStyle.getClassesFromNode(node.childNodes[0]);
      expect(classes).toContain("underline");
    });

    it("it should return an empty string if no classes are present", () => {
      const node: Node = domTestCaseData.paragraphWithUnderlineSpanAndNestedPlainSpan;
      const classes: string = rangeStyle.getClassesFromNode(node.childNodes[1]);
      expect(classes).toEqual("");
    });

  })

  describe("getClassesFromNodeHierarchy", () => {
    const rangeStyle = new RangeStyles();

    it("it should return a string containing all of the claases attached to the span and its parents", () => {
      const node: Node = domTestCaseData.textEditorSetup;
      const paragraph = node.childNodes[0];
      const childUnderlineSpan = paragraph.childNodes[0];
      const classes: string = rangeStyle.getClassesFromNodeHiearchy(childUnderlineSpan.childNodes[1], paragraph);
      expect(classes).toContain("italic underline");
    });

    it("it should return an empty string if no classes are present", () => {
      const node: Node = domTestCaseData.paragraphWithUnderlineSpanAndNestedPlainSpan;
      const classes: string = rangeStyle.getClassesFromNodeHiearchy(node.childNodes[1], node);
      expect(classes).toEqual("");
    });

  })

});

function countSpans(outerHtml: string): number {
  // the first node will be the paragraph node
  return outerHtml.split('<span').length - 1;
}