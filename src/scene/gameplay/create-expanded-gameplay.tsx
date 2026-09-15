import type { GameModel } from '#types/game-model';

import { createGameplay } from './create-gameplay';

export function createExpandedGameplay(model: GameModel) {
  const gameplay = createGameplay(model);

  gameplay.mixer.expand(false);

  return { ...gameplay, expand };

  function expand(): Promise<boolean> {
    return Promise.resolve(!model.completed);
  }
}
