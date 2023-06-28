/**
 *
 * @param text 需要处理的文本
 * @param fontSize 字体大小
 * @param maxWidth 最大宽度
 * @returns
 */
export function getCanvasText(text: string, fontSize = 14, maxWidth = 90) {
	if (typeof text !== 'string') return [text, 0];
	const lineMax = Math.floor(maxWidth / fontSize);
	let str = '';
	let currentIndex = 0;
	let line = 0;
	while (currentIndex < text.length - 1) {
		str += text.substring(currentIndex, currentIndex + lineMax) + '\n';
		currentIndex += lineMax;
		line++;
	}
	const height = line * fontSize;

	return [str, height];
}
export function transformToNormalDistribution(data) {
	// 计算数据的均值和标准差
	const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
	const variance =
		data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
		data.length;
	const standardDeviation = Math.sqrt(variance);

	// 标准化数据
	const standardizedData = data.map(
		(value) => (value - mean) / standardDeviation
	);

	// 使用逆正态分布函数转换为正态分布数据
	const transformedData = standardizedData.map((value) => {
		// 逆正态分布函数实现
		const a1 = 0.254829592;
		const a2 = -0.284496736;
		const a3 = 1.421413741;
		const a4 = -1.453152027;
		const a5 = 1.061405429;
		const p = 0.3275911;

		const sign = value < 0 ? -1 : 1;
		const x = Math.abs(value);

		const t = 1.0 / (1.0 + p * x);
		const y = ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t;

		return sign * (1 - y * Math.exp((-x * x) / 2));
	});

	return transformedData;
}
