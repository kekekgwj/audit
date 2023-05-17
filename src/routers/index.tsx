import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { CustomRoute, routes } from './routes';
import React from 'react';
import BeforeEnter from './beforeEnter';

const Loading = () => {
	return <div>loading...</div>;
};

const rotuerViews = (routerItems: CustomRoute[]) => {
	if (routerItems && routerItems.length) {
		return routerItems.map(
			({ path, component: Component, children, redirect }) => {
				return children && children.length ? (
					<Route
						path={path}
						key={path}
						element={
							<Suspense fallback={<Loading />}>
								<Component />
							</Suspense>
						}
					>
						{rotuerViews(children)}
						{redirect ? (
							<Route path={path} element={<Navigate to={redirect} />}></Route>
						) : (
							<Route
								path={path}
								element={<Navigate to={children[0].path} />}
							></Route>
						)}
					</Route>
				) : (
					<Route
						key={path}
						path={path}
						element={
							<Suspense fallback={<Loading />}>
								<Component />
							</Suspense>
						}
					></Route>
				);
			}
		);
	}
};

export default () => (
	<BeforeEnter>
		<Routes>{rotuerViews(routes)}</Routes>
	</BeforeEnter>
);
