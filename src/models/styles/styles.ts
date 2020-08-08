import { DimensionInterface } from '../components/box-dimension';

export interface Style {
  style: string;
  value: string;
}

export type BorderDirections = 'top' | 'bottom' | 'left' | 'right' | 'border' | null
export type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | 'hidden' | 'none';

export interface BorderInterface {
  borderDirection: BorderDirections;
  colour: string;
  style: BorderStyle;
  width: DimensionInterface;
  borderRadius: DimensionInterface;
}
