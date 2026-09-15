import { h } from '#jsx';

import './pad-progress-bar.css';

export function createPadProgressBar() {
  const fill = <span class="pad-progress-fill" />;
  const container = (
    <span class="pad-progress-bar" aria-hidden="true">
      {fill}
    </span>
  );

  return { container, setProgress, reset };

  function reset(): void {
    setProgress(1);
  }

  function setProgress(progress: number): void {
    fill.style.transform = `scaleX(${Math.max(0, Math.min(1, progress))})`;
  }
}
