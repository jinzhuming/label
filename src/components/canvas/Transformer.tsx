import Konva from 'konva';
import { TransformerConfig } from 'konva/types/shapes/Transformer';

export const createTransformer = (arg?: TransformerConfig) => {
  return new Konva.Transformer({
    ...arg,
    fill: 'green',
    stroke: 'black',
    strokeWidth: 4,
    draggable: true,
  });
};
