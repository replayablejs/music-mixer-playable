import { padGroups } from './pads-config';

export const mixerPads = padGroups.flatMap((group, familyIndex) =>
  group.labels.map((label, index) => {
    const compactIndex = group.compact.indexOf(index + 1);
    return {
      id: `${group.id}_${index + 1}`,
      family: group.id,
      loop: group.loop,
      label,
      compact: compactIndex !== -1,
      placement: {
        familyIndex,
        index,
        compactIndex,
        column: group.column,
        row: group.row,
      },
    };
  }),
);
