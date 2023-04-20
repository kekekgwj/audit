import { Checkbox, Input, Radio, DatePicker } from 'antd';

import styles from './index.module.less';

export default () => {
	const { RangePicker } = DatePicker;
	return (
		<div className={styles['fillter-attr-box']}>
			<div className="fillter-attr-box__title">供应商</div>
			<div className="fillter-attr-box__attrs">
				<div className={styles['attr-item']}>
					<Checkbox className={styles['attr-item__checkbox']}>籍贯</Checkbox>
					<div className={styles['attr-item__value']}>
						<Input placeholder="请输入" />
					</div>
				</div>
				<div className={styles['attr-item']}>
					<Checkbox className={styles['attr-item__checkbox']}>性别</Checkbox>
					<div className={styles['attr-item__value']}>
						<Radio.Group>
							<Radio value={1}>男</Radio>
							<Radio value={2}>女</Radio>
						</Radio.Group>
					</div>
				</div>
				<div className={styles['attr-item']}>
					<Checkbox className={styles['attr-item__checkbox']}>时间</Checkbox>
					<div className={styles['attr-item__value']}>
						<RangePicker placeholder={['开始时间', '结束时间']} />
					</div>
				</div>
			</div>
		</div>
	);
};
