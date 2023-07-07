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
				const node = graph.findById(selectID);
				node && apis.focusNodeById(selectID);
			} else {
				if (centerID) {
					const node = graph.findById(centerID);
					node && apis.focusNodeById(centerID);
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
