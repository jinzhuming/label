import Konva from 'konva';
import { LayerConfig } from 'konva/types/Layer';
import { Stage } from 'konva/types/Stage';
import { useEffect, useMemo } from 'react';

export const useLayer = ({
  stage,
  options,
}: {
  stage?: Stage;
  options?: LayerConfig;
}) => {
  // 构建一个 layer，并且插入 stage
  const layer = useMemo(() => {
    if (!stage) return undefined;
    const l = new Konva.Layer(options);
    stage.add(l);
    return l;
  }, [stage]);

  // 记得销毁
  useEffect(() => {
    return () => {
      layer?.remove();
    };
  }, [layer]);

  return [layer];
};

//创建图形用的 layer
export const useCreateShapeLayer = ({
  stage,
  options,
}: {
  stage?: Stage;
  options?: LayerConfig;
}) => {
  // 本质只是做个代理转发，就是一个普通 layer
  return useLayer({ stage, options });
};
