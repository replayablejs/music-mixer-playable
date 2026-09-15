import { h } from '#jsx';
import type { EndCard, EndCardView } from '#types/end-card';

import { createSuccessEndCard } from './create-success-end-card';
import { createTimeoutEndCard } from './create-timeout-end-card';

/** Creates only the endcard selected by the completion outcome. */
export function createEndCard(background: HTMLElement): EndCard {
  const container = <div class="end-card-layer" />;
  let view: EndCardView | undefined;

  return {
    container,
    show(outcome) {
      if (view) {
        return;
      }
      view =
        outcome === 'success' ? createSuccessEndCard(background) : createTimeoutEndCard(background);
      container.append(view.container);
      view.show();
    },
    destroy() {
      view?.destroy();
      container.remove();
    },
  };
}
