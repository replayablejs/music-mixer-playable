import './pad-glow.css';

export function createPadGlow(container: HTMLElement) {
  return { setOpacity, destroy };

  function setOpacity(opacity: number): void {
    container.style.setProperty('--glow-opacity', String(opacity));
  }

  function destroy(): void {
    container.style.removeProperty('--glow-opacity');
  }
}
