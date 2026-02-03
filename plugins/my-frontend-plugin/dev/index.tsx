import { createDevApp } from '@backstage/dev-utils';
import { myFrontendPluginPlugin, MyFrontendPluginPage } from '../src/plugin';

createDevApp()
  .registerPlugin(myFrontendPluginPlugin)
  .addPage({
    element: <MyFrontendPluginPage />,
    title: 'Root Page',
    path: '/my-frontend-plugin',
  })
  .render();
