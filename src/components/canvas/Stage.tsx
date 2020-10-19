import { Layer } from 'konva/types/Layer';
import { Stage } from 'konva/types/Stage';
import React, { useEffect, useRef, useState } from 'react';
import Konva from 'konva';

export const useStage = (): [
  Stage | undefined,
  Layer | undefined,
  React.ReactNode,
] => {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, updateStage] = useState<Stage>();
  const [layer, updateLayer] = useState<Layer>();

  // dom 渲染后插入 dom 内，宽高都按照 dom 属性设置
  useEffect(() => {
    const dom = ref.current;
    if (!dom) return;

    const stage = new Konva.Stage({
      container: dom,
      width: dom.offsetWidth,
      height: dom.offsetHeight,
    });
    const layer = new Konva.Layer();
    stage.add(layer);
    updateLayer(layer);
    updateStage(stage);
    console.log('x');
    // 离开的时候清理 stage
    return () => {
      stage.remove();
    };
  }, []);

  return [
    stage,
    layer,
    <div
      ref={ref}
      css={(t) => ({ color: t.color.red, width: '100%', height: '100%' })}
    />,
  ];
};
