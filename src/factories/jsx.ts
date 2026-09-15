import type { Child, Attributes } from '#types/jsx';

/**
 * TSX syntax for creating ordinary HTML elements, without a UI framework.
 *
 * In a .tsx file, import { h } from this module. The project's tsconfig uses
 * `jsx: "react"` (the classic JSX transform) and `jsxFactory: "h"`, so Vite
 * transforms <div class="tooltip">Hello</div> into
 * h("div", { class: "tooltip" }, "Hello"). React is not involved.
 *
 * Each call creates a new element once. There is no virtual DOM, reactive state,
 * rerendering, or automatic lifecycle. Features keep their normal DOM references
 * and show/dismiss/destroy methods; Replayable owns animation and host lifecycle.
 *
 * Supported: built-in HTML tags, primitive DOM properties, string class/style,
 * data-* and aria-* attributes, lowercase DOM event handlers, and nested children.
 * Not supported: SVG, fragments, function/class components, refs, style objects,
 * event listener options, or automatic disposal of listeners.
 */

/**
 * Factory invoked by the TSX transform. May also be called directly as h(...).
 *
 * @param tag Built-in HTML tag name; this factory always uses document.createElement.
 * @param attributes Initial properties/attributes, or null when none were supplied.
 * @param children Nested TSX children, passed as positional arguments by the compiler.
 * @returns A new, detached element. Mounting it is the caller's responsibility.
 *
 * Direct calls infer a specific element type, e.g. h("img", null) returns
 * HTMLImageElement. TSX expressions use the general JSX.Element type in src/types/jsx.ts.
 */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: Attributes<HTMLElementTagNameMap[K]> | null,
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  for (const [name, value] of Object.entries(attributes ?? {})) {
    // Children are handled separately. Missing values leave browser defaults intact.
    if (name === 'children' || value == null) {
      continue;
    }
    if (name.startsWith('on') && typeof value === 'function') {
      // Strip "on" and register a native listener. No event wrapper or delegation.
      // The assertion bridges the heterogeneous entries back to the DOM API;
      // Attributes<T> checks each handler's event type at the TSX call site.
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- Attributes<T> validates each event handler before Object.entries erases its type.
      element.addEventListener(name.slice(2), value as EventListener);
    } else if (name === 'class' || name === 'style' || !(name in element)) {
      // class/style require attribute assignment; data-* and aria-* also land here.
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        element.setAttribute(name, String(value));
      }
    } else {
      // Assign real DOM properties so booleans behave correctly: hidden={false}
      // must set .hidden = false, not create a hidden="false" HTML attribute.
      Reflect.set(element, name, value);
    }
  }

  // Explicit nested children take precedence over a children attribute.
  appendChildren(element, children.length ? children : [attributes?.children]);
  return element;
}

/** Appends children in order, recursively flattening arrays without parsing HTML. */
function appendChildren(parent: HTMLElement, children: readonly Child[]): void {
  for (const child of children) {
    if (child == null || typeof child === 'boolean') {
      continue;
    }
    if (Array.isArray(child)) {
      appendChildren(parent, child);
    } else {
      // append(string) creates text, so a child string containing <b> stays text.
      // Existing nodes are moved into this parent, not cloned: normal DOM behavior.
      if (child instanceof Node) {
        parent.append(child);
      } else if (typeof child === 'string' || typeof child === 'number') {
        parent.append(String(child));
      }
    }
  }
}
