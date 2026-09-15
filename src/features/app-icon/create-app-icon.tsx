import { h } from '#jsx';

import './app-icon.css';

/** Shared, text-free artwork for the header and success endcard. */
export function createAppIcon() {
  return (
    <div class="app-icon" role="img" aria-label="Colorful music pads">
      <span class="app-icon-tile app-icon-diamond">
        <span />
      </span>
      <span class="app-icon-tile app-icon-circle">
        <span />
      </span>
      <span class="app-icon-tile app-icon-square">
        <span />
      </span>
      <span class="app-icon-tile app-icon-cross">
        <span />
      </span>
    </div>
  );
}
