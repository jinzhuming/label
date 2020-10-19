import { createTransformer } from '@/components/canvas/Transformer';
import { useValueRef } from '@/hooks/value';
import Konva from 'konva';
import { Layer } from 'konva/types/Layer';
import { KonvaEventObject } from 'konva/types/Node';
import { RectConfig } from 'konva/types/shapes/Rect';
import { Stage } from 'konva/types/Stage';
import { useEffect } from 'react';
import { from, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';

// 统一处理创建 rect，方便添加统一管理的属性
export const createRect = (arg?: RectConfig) => {
  return new Konva.Rect({
    ...arg,
    fill: 'green',
    stroke: 'black',
    strokeWidth: 4,
    draggable: true,
  });
};

export const useCreateRect = ({
  stage,
  stageBaseLayer,
  createShapeLayer,
  createShapeState,
}: {
  stage?: Stage;
  createShapeLayer?: Layer;
  stageBaseLayer?: Layer;
  createShapeState: {
    creating: boolean;
    updateCreateState: (createState: boolean) => void;
  };
}) => {
  const { creating, updateCreateState } = createShapeState;
  // 方便 useEffect 内访问最新属性
  const creatingRef = useValueRef(creating);

  useEffect(() => {
    // 必须需要的信息都准备好才开始监听
    if (!stage || !createShapeLayer || !stageBaseLayer) return;
    const mousedown$$ = new Subject<KonvaEventObject<MouseEvent>>();

    const mousemove$$ = new Subject<KonvaEventObject<MouseEvent>>();
    const mouseup$$ = new Subject<KonvaEventObject<MouseEvent>>();

    // 这个是用来管理右键取消操作的
    const cancel$$ = new Subject();

    // 绘图的流
    const draw$ = from(mousedown$$)
      .pipe(
        map((e) => {
          // 按下的时候绘制基本图形，一些统一添加的属性在 createRect 内处理
          const rect = createRect({
            x: e.evt.offsetX,
            y: e.evt.offsetY,
            width: 0,
            height: 0,
          });

          const tr = createTransformer();
          tr.nodes([rect]);
          createShapeLayer.add(rect);
          createShapeLayer.add(tr);
          stage.add(createShapeLayer);

          return { rect, layer: createShapeLayer, tr, e };
        }),
        switchMap((arg) => {
          const { rect, layer, tr, e: initEvent } = arg;

          // 移动的时候更新位置信息
          return mousemove$$.pipe(
            tap((e) => {
              const width = Math.abs(e.evt.offsetX - initEvent.evt.offsetX);
              const height = Math.abs(e.evt.offsetY - initEvent.evt.offsetY);
              rect.setSize({
                width,
                height,
              });
              rect.setPosition({
                // position 可能反向画图出现现在位置比初始位置小的情况，所以取最小值为图形原点
                x: Math.min(e.evt.offsetX, initEvent.evt.offsetX),
                y: Math.min(e.evt.offsetY, initEvent.evt.offsetY),
              });

              // 绘制涂层（不需要绘制整个舞台）
              layer.draw();
              return layer;
            }),

            // takeUntil(cancel$$),
            takeUntil(
              mouseup$$.pipe(
                tap((e) => {
                  // 如果只是点击，没有发生拖拽移动，这里增加一个 3 的阈值，防止点击的时候手抖，
                  // 只有偏移大于 3 再触发绘制到 stage
                  if (
                    Math.abs(e.evt.offsetX - initEvent.evt.offsetX) > 3 ||
                    Math.abs(e.evt.offsetY - initEvent.evt.offsetY) > 3
                  ) {
                    stageBaseLayer.add(tr);
                    stageBaseLayer.add(rect);
                  }

                  // 创建用的 layer 删除掉绘制的信息
                  layer.removeChildren();

                  // 重绘
                  stage.draw();
                }),
              ),
            ),
          );
        }),
      )
      .subscribe();

    // 触发取消事件之后，关闭创建状态，清空数据
    cancel$$.subscribe(() => {
      updateCreateState(false);

      createShapeLayer.removeChildren();
      createShapeLayer.draw();
    });

    // 舞台上绑定事件
    stage.on('mousedown', (e) => {
      if (!creatingRef.current) return;

      if (e.evt.button === 2) {
        cancel$$.next(e);
      } else if (e.evt.button === 0) {
        mousedown$$.next(e);
      }
    });
    stage.on('mousemove', (e) => {
      mousemove$$.next(e);
    });
    stage.on('mouseup', (e) => {
      mouseup$$.next(e);
    });

    return () => {
      draw$.unsubscribe();
      mousedown$$.unsubscribe();
      mousemove$$.unsubscribe();
      cancel$$.unsubscribe();
      mouseup$$.unsubscribe();
    };
  }, [stage, createShapeLayer]);
};
