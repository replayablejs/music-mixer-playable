import type { ReplayableCompletionInput } from '@replayablejs/config';

export default {
  duration: 50,
  // Starts after the first interaction; subsequent activity resets it.
  inactivity: 35,
} satisfies ReplayableCompletionInput;
