export interface Pad {
  id: string;
  family: string;
  loop: boolean;
}

export interface SelectionChange {
  previous?: string;
  selected?: string;
}

export interface GameModel {
  readonly completed: boolean;
  activate(id: string): void;
  deselect(id: string): void;
  complete(): void;
  isSelected(id: string): boolean;
  hasSelection(): boolean;
  hasActiveLoops(): boolean;
  hasAllGroupsSelected(): boolean;
  getSelectedIds(): string[];
  onSelectionChange(listener: (change: SelectionChange) => void): () => void;
}
