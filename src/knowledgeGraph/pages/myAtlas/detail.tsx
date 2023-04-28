import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const AltasDetailCom = () => {
	let location = useLocation();
	console.log(location.state, 5555);
	return <div>这是图谱详情页面</div>;
};

export default AltasDetailCom;
