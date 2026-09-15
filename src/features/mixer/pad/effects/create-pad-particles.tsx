import { h } from '#jsx';
import type { PadParticles } from '#types/pad-effects';

import './pad-particles.css';

const circlePointCount = 20;
const designPadSize = 140;
const designParticleSize = 64;
const maximumTravel = 25;
const particleHalfSizePercent = (designParticleSize / designPadSize) * 50;
const maximumTravelPercent = (maximumTravel / designParticleSize) * 100;

export function createPadParticles(): PadParticles {
  // Skip point zero to distribute 19 particles around the circle.
  const particles = Array.from({ length: circlePointCount - 1 }, (_, index) =>
    createParticle(index + 1),
  );
  const container = (
    <span class="pad-particles" aria-hidden="true" hidden>
      {particles.map((particle) => particle.element)}
    </span>
  );

  return { container, randomize, setProgress, destroy };

  function randomize(): void {
    for (const particle of particles) {
      particle.travelX = particle.directionX * Math.random() * maximumTravelPercent;
      particle.travelY = particle.directionY * Math.random() * maximumTravelPercent;
      particle.opacity = 0.5 + Math.random() * 0.5;
      particle.scale = 0.3 + Math.random();
    }
  }

  function setProgress(progress: number): void {
    for (const particle of particles) {
      const x = particle.travelX * progress;
      const y = particle.travelY * progress;
      const scale = particle.scale * (1 - progress);

      particle.element.style.transform = `translate(${x}%, ${y}%) scale(${scale})`;
      particle.element.style.opacity = String(particle.opacity * progress);
    }
  }

  function destroy(): void {
    container.remove();
  }
}

function createParticle(point: number) {
  const angle = (point / circlePointCount) * Math.PI * 2;
  const x = Math.cos(angle);
  const y = Math.sin(angle);
  const left = 50 + x * 50 - particleHalfSizePercent;
  const top = 50 + y * 50 - particleHalfSizePercent;
  const element = <span class="pad-particle" style={`left:${left}%;top:${top}%;`} />;

  return {
    element,
    directionX: Math.sign(x),
    directionY: Math.sign(y),
    travelX: 0,
    travelY: 0,
    opacity: 0,
    scale: 0,
  };
}
