import type { Pad, SelectionChange, GameModel } from '#types/game-model';

import { mixerPads } from '../features/mixer/config/mixer-pads';

/** Game rules only: no DOM, animation, audio, or runtime dependencies. */
export function createGameModel(onSuccess: () => void): GameModel {
  const pads: readonly Pad[] = mixerPads;
  const familyCount = new Set(pads.map((pad) => pad.family)).size;

  const selectedByFamily = new Map<string, Pad>();
  const selectionListeners = new Set<(change: SelectionChange) => void>();
  let completed = false;
  let successReached = false;

  return {
    get completed() {
      return completed;
    },
    activate,
    deselect,
    complete,
    isSelected: (id: string) => [...selectedByFamily.values()].some((pad) => pad.id === id),
    hasSelection: () => selectedByFamily.size > 0,
    hasActiveLoops: () => [...selectedByFamily.values()].some((pad) => pad.loop),
    hasAllGroupsSelected: () => selectedByFamily.size === familyCount,
    getSelectedIds: () => [...selectedByFamily.values()].map((pad) => pad.id),
    onSelectionChange,
  };

  function activate(id: string): void {
    if (completed) {
      return;
    }

    const pad = pads.find((candidate) => candidate.id === id);
    if (!pad) {
      return;
    }

    const previous = selectedByFamily.get(pad.family);
    selectedByFamily.delete(pad.family);

    // Loops toggle off; one-shot effects restart when tapped again.
    const selected = pad.loop && previous === pad ? undefined : pad;
    if (selected) {
      selectedByFamily.set(pad.family, selected);
    }

    notifySelection({ previous: previous?.id, selected: selected?.id });
    checkSuccess();
  }

  function deselect(id: string): void {
    if (completed) {
      return;
    }

    const pad = [...selectedByFamily.values()].find((candidate) => candidate.id === id);
    if (pad) {
      selectedByFamily.delete(pad.family);
      notifySelection({ previous: id });
    }
  }

  function complete(): void {
    completed = true;
  }

  function onSelectionChange(listener: (change: SelectionChange) => void): () => void {
    selectionListeners.add(listener);
    return () => {
      selectionListeners.delete(listener);
    };
  }

  function checkSuccess(): void {
    // Success is latched; expiring effects or later selections cannot retrigger it.
    if (!completed && !successReached && selectedByFamily.size === familyCount) {
      successReached = true;
      onSuccess();
    }
  }

  function notifySelection(change: SelectionChange): void {
    for (const listener of selectionListeners) {
      listener(change);
    }
  }
}
