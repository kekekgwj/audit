import React, { useEffect } from 'react';
// import './relationship.less';
import Graphin, {
	Behaviors,
	GraphinContext,
	IG6GraphEvent,
	Components
} from '@antv/graphin';

const { Tooltip } = Components;
interface Props {
	data: Object;
}

const GraphinCom = React.memo((props: Props) => {
	const { data } = props;
	return (
		<Graphin data={data}>
			<Tooltip bindType="node" placement={'top'}>
				{(value: TooltipValue) => {
					if (value.model) {
						const { model } = value;
						console.log(model.id, 421111111);
						return (
							<div>
								<li> {model.id}</li>
							</div>
						);
					}
					return null;
				}}
			</Tooltip>
			<Tooltip bindType="edge" placement={'top'}>
				{(value: TooltipValue) => {
					if (value.model) {
						const { model } = value;
						console.log(model, 42222222222);
						return (
							<div>
								<li> {model.id}</li>
							</div>
						);
					}
					return null;
				}}
			</Tooltip>
		</Graphin>
	);
});

export default GraphinCom;
