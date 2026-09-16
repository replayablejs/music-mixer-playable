import { defineConfig } from '@replayablejs/config';

import assets from './config/assets.ts';
import completion from './config/completion.ts';
import controls from './config/controls.ts';
import devtools from './config/devtools.ts';
import localization from './config/localization.ts';
import networks from './config/networks.ts';
import params from './config/params.ts';
import screen from './config/screen.ts';
import store from './config/store.ts';
import versions from './config/versions.ts';

// Overrides resolve project → version → network; exclusions accumulate.
export default defineConfig({
  name: 'music-mixer-playable',
  networks,
  completion,
  params,
  controls,
  versions,
  devtools,
  assets,
  localization,
  screen,
  store,
});
