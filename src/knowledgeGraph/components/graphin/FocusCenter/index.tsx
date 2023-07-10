import { useFocuseState } from '@/redux/store';
import { GraphinContext } from '@antv/graphin';
// import { Button } from 'antd';
import React, { useContext, useEffect } from 'react';

const FocusCenter = () => {
	const { centerID, selectID } = useFocuseState();

	const { graph, apis } = useContext(GraphinContext);
	useEffect(() => {
		graph.on('afterlayout', () => {
			if (selectID) {
				graph.focusItem(selectID, true, {
					duration: 200,
					easing: 'easeCubic'
				});
				// const node = graph.findById(selectID);

				// node && apis.focusNodeById(selectID);
			} else {
				if (centerID) {
					graph.focusItem(centerID, true, {
						duration: 200,
						easing: 'easeCubic'
					});
					// const node = graph.findById(centerID);
					// node && apis.focusNodeById(centerID);
				}
			}
		});
		return () => {
			graph.off('afterlayout');
		};
	}, [selectID, centerID]);

	return <></>;
};

export default FocusCenter;
