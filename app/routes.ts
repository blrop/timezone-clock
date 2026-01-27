import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  route('/', 'routes/Home.tsx', [
    index('routes/main/MainScreen.tsx'), // replace by main screen
    route('/edit', 'routes/edit/EditScreen.tsx'),
  ]),
] satisfies RouteConfig;
