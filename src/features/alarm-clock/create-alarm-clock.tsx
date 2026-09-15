import { h } from '#jsx';

import './alarm-clock.css';

const hourCount = 12;
const degreesPerHour = 360 / hourCount;

/** Scalable alarm-clock artwork rendered with CSS. */
export function createAlarmClock() {
  const hourMarkers = Array.from({ length: hourCount }, (_, hour) => (
    <span
      class="alarm-clock-tick"
      data-major={hour % 3 === 0}
      style={`transform:rotate(${hour * degreesPerHour}deg)`}
    />
  ));

  return (
    <div class="alarm-clock" role="img" aria-label="Alarm clock">
      <span class="alarm-clock-leg alarm-clock-leg-left" />
      <span class="alarm-clock-leg alarm-clock-leg-right" />
      <span class="alarm-clock-stem" />
      <span class="alarm-clock-bell alarm-clock-bell-left" />
      <span class="alarm-clock-bell alarm-clock-bell-right" />
      <span class="alarm-clock-button" />
      <span class="alarm-clock-ringing alarm-clock-ringing-left" />
      <span class="alarm-clock-ringing alarm-clock-ringing-right" />
      <span class="alarm-clock-face">
        {hourMarkers}
        <span class="alarm-clock-hand alarm-clock-minute" />
        <span class="alarm-clock-hand alarm-clock-hour" />
      </span>
    </div>
  );
}
