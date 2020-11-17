import { useCreateShapeLayer } from '@/components/canvas/Layer';
import { useCreateRect } from '@/components/canvas/Rect';
import { useStage } from '@/components/canvas/Stage';
import { useIntl } from 'umi';
import React, { useState } from 'react';

export default () => {
  // 国际化
  const intl = useIntl();
  const [stage, stageBaseLayer, Canvas] = useStage();
  const [creating, updateCreateState] = useState(false);
  const [layer] = useCreateShapeLayer({ stage });
  useCreateRect({
    stage,
    stageBaseLayer,
    createShapeLayer: layer,
    createShapeState: { creating, updateCreateState },
  });

  return (
    <div>
      <div>
        <button
          type="button"
          onClick={() => {
            updateCreateState(!creating);
          }}
        >
          {intl.formatMessage(
            {
              id: creating ? 'CREATING' : 'CREATE',
            },
            { name: '' },
          )}
        </button>
      </div>
      <div css={{ width: '100%', height: 500 }}>{Canvas}</div>
    </div>
  );
};
