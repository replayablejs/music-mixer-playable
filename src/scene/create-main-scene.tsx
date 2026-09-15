import { playable, type PlayableCompletion } from '@replayablejs/runtime';

import { h } from '#jsx';
import { fonts } from '#registries';
import type { MainScene } from '#types/main-scene';

import { createHint } from '../features/hint/create-hint';
import { createTutorial } from '../features/tutorial/create-tutorial';
import { createGameModel } from '../model/create-game-model';
import { createEndCard } from './endcard/create-end-card';
import { createCompactGameplay } from './gameplay/create-compact-gameplay';
import { createExpandedGameplay } from './gameplay/create-expanded-gameplay';
import { createInterface } from './interface/create-interface';

import './main-scene.css';
import './theme.css';

const successEndCardDelaySeconds = 5;

export function createMainScene(): MainScene {
  const model = createGameModel(handleSuccess);

  const container = <main class="music-mixer" data-theme={playable.config.params.soundPack} />;

  container.style.setProperty('--game-font', JSON.stringify(fonts.Inter));

  onResize();

  const ui = createInterface();
  const gameplay = playable.config.params.tutorial
    ? createCompactGameplay(model, ui.tooltip)
    : createExpandedGameplay(model);

  const endCard = createEndCard(container);

  const tutorial = playable.config.params.tutorial
    ? createTutorial(model, gameplay.mixer, ui.tooltip, handleTutorialComplete)
    : undefined;
  const hint = playable.config.params.hint ? createHint(model, gameplay.mixer) : undefined;

  playable.on('resize', onResize);
  const removeCompletionListener = playable.on('complete', handleCompletion);

  container.append(
    <div class="scene-content">
      {gameplay.container}
      {ui.container}
    </div>,
    endCard.container,
  );

  return { container, show };

  function show(): void {
    gameplay.show();
    ui.show();
    if (tutorial) {
      tutorial.start();
    } else {
      hint?.start();
    }
  }

  async function handleTutorialComplete(): Promise<void> {
    const completed = await gameplay.expand();
    if (completed) {
      hint?.start();
    }
  }

  async function handleSuccess(): Promise<void> {
    await playable.timers.delay(successEndCardDelaySeconds);
    if (!model.completed) {
      playable.complete('success');
    }
  }

  function handleCompletion({ reason }: PlayableCompletion): void {
    model.complete();
    tutorial?.destroy();
    hint?.destroy();
    void gameplay.hide();
    void ui.hide();
    endCard.show(reason === 'success' ? 'success' : 'timeout');
    removeCompletionListener();
  }

  function onResize(): void {
    const { orientation, scale, safeArea } = playable.screen;
    container.dataset.orientation = orientation;
    container.style.setProperty('--scene-scale', String(scale));
    container.style.setProperty('--safe-left', `${safeArea.x}px`);
    container.style.setProperty('--safe-top', `${safeArea.y}px`);
    container.style.setProperty('--safe-width', `${safeArea.width}px`);
    container.style.setProperty('--safe-height', `${safeArea.height}px`);
  }
}
