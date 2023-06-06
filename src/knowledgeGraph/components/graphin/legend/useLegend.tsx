import React from 'react';
import { GraphinContext, GraphinContextType } from '@antv/graphin';

import type { LegendProps } from './typing';

export const getEnumValue = (obj: any, keyString: string) => {
	const keyArray = keyString.split('.');
	const enumValue = keyArray.reduce((acc, curr, currIndex, array) => {
		const currValue = acc[curr];
		if (!currValue && currIndex !== array.length - 1) {
			return {};
		}
		return currValue;
	}, obj) as string;

	return enumValue;
};

/**
 * 根据字段分类，得到分类后的枚举值Map
 * @param data nodes or edges
 * @param sortKey 分类的字段，例如 nodeType 或者 data.type
 * @returns
 */
export const getEnumDataMap = (data: any[], sortKey: string) => {
	const enumDataMap: Map<string | number, any[]> = new Map();
	data.forEach((item) => {
		/** 得到枚举值 */
		const enumValue = getEnumValue(item, sortKey);
		/** 按照枚举值重新将节点存放 */
		const current = enumDataMap.get(enumValue);
		if (current) {
			enumDataMap.set(enumValue, [...current, item]);
		} else {
			enumDataMap.set(enumValue, [item]);
		}
	});

	return enumDataMap;
};

const useLegend = ({
	bindType = 'node',
	sortKey
}: {
	bindType: LegendProps['bindType'];
	sortKey: LegendProps['sortKey'];
}) => {
	const graphin = React.useContext<GraphinContextType>(GraphinContext);
	const { graph } = graphin;
	const data = graph.save();

	/** 暂时不支持treeGraph的legend */
	if (data.children) {
		console.error('not support tree graph');
		return {
			dataMap: new Map(),
			options: {}
		};
	}
	// @ts-ignore
	const dataMap = getEnumDataMap(data[`${bindType}s`], sortKey);
	/** 计算legend.content 的 options */
	const keys = [...dataMap.keys()];
	const options = keys.map((key) => {
		const item = (dataMap.get(key) || [{}])[0];

		const graphinStyleColor = getEnumValue(item, 'style.keyshape.fill');
		const g6StyleCcolor = getEnumValue(item, 'style.color');

		const color = graphinStyleColor || g6StyleCcolor;
		return {
			/** 颜色 */
			color,
			/** 值 */
			value: key,
			/** 标签 */
			label: key,
			/** 是否选中 */
			checked: true
		};
	});
	return {
		dataMap,
		options
	};
};
export default useLegend;
