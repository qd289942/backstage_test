import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const myFrontendPluginPlugin = createPlugin({
  id: 'my-frontend-plugin',
  routes: {
    root: rootRouteRef,
  },
});

export const MyFrontendPluginPage = myFrontendPluginPlugin.provide(
  createRoutableExtension({
    name: 'MyFrontendPluginPage',
    component: () =>
      import('./components/EnhancedActionsComponent').then(m => m.EnhancedActionsComponent),
    mountPoint: rootRouteRef,
  }),
);
