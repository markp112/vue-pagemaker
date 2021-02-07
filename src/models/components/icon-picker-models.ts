export interface IconPickerInterface {
  icon: string;
  class: string;
  tooltip: string;
  domEquivalent: string;
}

export const shadowIconList: IconPickerInterface[] = [
  {
    icon: "check_box-32.png",
    class: "shadow-xs",
    tooltip: "extra small shadow",
    domEquivalent: "0 0 0 1px rgba(0, 0, 0, 0.05)"
  },
  {
    icon: "check_box-32.png",
    class: "shadow-sm",
    tooltip: "small shadow",
    domEquivalent: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
  },
  {
    icon: "check_box-32.png",
    class: "shadow-md",
    tooltip: "medium shadow",
    domEquivalent:
      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
  },
  {
    icon: "check_box-32.png",
    class: "shadow-lg",
    tooltip: "large shadow",
    domEquivalent:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  },
  {
    icon: "check_box-32.png",
    class: "shadow-xl",
    tooltip: "extra large shadow",
    domEquivalent:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
  },
  {
    icon: "check_box-32.png",
    class: "shadow-2xl",
    tooltip: "2XL shadow",
    domEquivalent:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
  },
  {
    icon: "check_box-32.png",
    class: "shadow-inner",
    tooltip: "inner shadow",
    domEquivalent: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)"
  },
  {
    icon: "check_box-32.png",
    class: "shadow-outline",
    tooltip: "outline shadow",
    domEquivalent: "box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5)"
  },
  {
    icon: "uncheck_box-32.png",
    class: "shadow-none",
    tooltip: "remove shadow",
    domEquivalent: "none"
  }
];

export const lineStyleIconList: IconPickerInterface[] = [
  {
    icon: "solid-line-32.png",
    class: "solid",
    tooltip: "solid line",
    domEquivalent: "solid"
  },
  {
    icon: "dotted-line-32.png",
    class: "dotted",
    tooltip: "dotted line",
    domEquivalent: "dotted"
  },
  {
    icon: "dashed-line-32.png",
    class: "dashed",
    tooltip: "dashed line",
    domEquivalent: "dashed"
  },
  {
    icon: "double-line-32.png",
    class: "double",
    tooltip: "double line",
    domEquivalent: "double"
  },
  {
    icon: "inset-32.png",
    class: "inset",
    tooltip: "inset",
    domEquivalent: "inset"
  },
  {
    icon: "outset-32.png",
    class: "outset",
    tooltip: "outset",
    domEquivalent: "outset"
  },
  {
    icon: "ridge-32.png",
    class: "ridge",
    tooltip: "ridge",
    domEquivalent: "ridge"
  },
  {
    icon: "groove-32.png",
    class: "groove",
    tooltip: "groove",
    domEquivalent: "groove"
  }
];

export const borderEdgeIconList: IconPickerInterface[] = [
  {
    icon: "border_outside-32.png",
    class: "border",
    tooltip: "border all round",
    domEquivalent: ""
  },
  {
    icon: "border_top-32.png",
    class: "top",
    tooltip: "border top",
    domEquivalent: ""
  },
  {
    icon: "border_bottom-32.png",
    class: "bottom",
    tooltip: "border bottom",
    domEquivalent: ""
  },
  {
    icon: "border_left-32.png",
    class: "left",
    tooltip: "border left",
    domEquivalent: ""
  },
  {
    icon: "border_right-32.png",
    class: "right",
    tooltip: "border right",
    domEquivalent: ""
  },
  {
    icon: "border_none-32.png",
    class: "none",
    tooltip: "border none",
    domEquivalent: ""
  },
  {
    icon: "hidden-32.png",
    class: "hidden",
    tooltip: "hidden border",
    domEquivalent: ""
  }
];

export const fontWeightIconList: IconPickerInterface[] = [
  {
    icon: "100-32.png",
    class: "font-hairline",
    tooltip: "font weight hairline",
    domEquivalent: "100"
  },
  {
    icon: "200-32.png",
    class: "font-thin",
    tooltip: "font weight thin",
    domEquivalent: "200"
  },
  {
    icon: "300-32.png",
    class: "font-light",
    tooltip: "font weight light",
    domEquivalent: "300"
  },
  {
    icon: "400-32.png",
    class: "font-normal",
    tooltip: "font weight normal",
    domEquivalent: "400"
  },
  {
    icon: "500-32.png",
    class: "font-medium",
    tooltip: "font weight medium",
    domEquivalent: "500"
  },
  {
    icon: "600-32.png",
    class: "font-semibold",
    tooltip: "font weight semibold",
    domEquivalent: "600"
  },
  {
    icon: "700-32.png",
    class: "font-bold",
    tooltip: "font weight bold",
    domEquivalent: "700"
  },
  {
    icon: "800-32.png",
    class: "font-extrabold",
    tooltip: "font weight extrabold",
    domEquivalent: "800"
  },
  {
    icon: "900-32.png",
    class: "font-black",
    tooltip: "font weight black",
    domEquivalent: "900"
  }
];
