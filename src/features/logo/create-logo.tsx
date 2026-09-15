import { h } from '#jsx';

import { createAppIcon } from '../app-icon/create-app-icon';

import './logo.css';

export function createLogo() {
  const container = <div class="logo">{createAppIcon()}</div>;

  return { container, destroy };

  function destroy(): void {
    container.remove();
  }
}
