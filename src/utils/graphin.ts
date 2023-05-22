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
