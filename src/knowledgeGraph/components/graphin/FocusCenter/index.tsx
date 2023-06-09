import { useFocuseState } from '@/redux/store';
import { GraphinContext } from '@antv/graphin';
import React, { useContext, useEffect } from 'react';

const FocusCenter = () => {
	const { centerID, selectID } = useFocuseState();
	// console.log('centerID, selectID', centerID, selectID);
	const { graph, apis } = useContext(GraphinContext);
	useEffect(() => {
		// graph.on('aftergraphrefresh', () => {
		// 	console.log('aftergraphrefresh');
		// 	const node = graph.findById(selectID);

		// 	node && apis.focusNodeById(selectID);
		// });
		// graph.on('afterupdateitem', () => {
		// 	console.log('afterupdateitem');
		// });

		graph.on('afterrender', () => {
			console.log('afterrender');
			if (centerID) {
				const node = graph.findById(centerID);
				node && apis.focusNodeById(centerID);
			}
		});
		// graph.on('afterchangedata', () => {
		// 	if (selectID) {
		// 		const node = graph.findById(selectID);
		// 		console.log('selectID', node);
		// 		node && apis.focusNodeById(selectID);
		// 	}
		// });
		return () => {
			graph.off('afterrender');
		};
	}, []);

	// useEffect(() => {
	// 	if (selectID) {
	// 		const node = graph.findById(selectID);
	// 		console.log('selectID', node);
	// 		node && apis.focusNodeById(selectID);
	// 	}
	// }, [selectID]);

	return <></>;
};

export default FocusCenter;
