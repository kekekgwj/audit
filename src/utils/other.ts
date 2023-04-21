/**
 * // **base64转图片文件方法**
 * @param base64Str base64
 * @param fileName 输出的文件名
 * @returns {File}
 */
export function toImgStyle(base64Str: string, fileName: string) {
	const arr: string[] = base64Str.split(','),
		mime = arr[0]?.match(/:(.*?);/)[1], //base64解析出来的图片类型
		bstr = atob(arr[1]); //对base64串进行操作，去掉url头，并转换为byte   atob为window内置方法

	let len: number = bstr.length;
	const u8arr = new Uint8Array(len); //
	while (len--) {
		u8arr[len] = bstr.charCodeAt(len);
	}
	// 创建新的 File 对象实例[utf-8内容，文件名称或者路径，[可选参数，type：文件中的内容mime类型]]
	return new File([u8arr], fileName, {
		type: mime
	});
}
