/**
 * Existing nodes are appended directly; strings and numbers become text nodes.
 * Null, undefined, and booleans render nothing, allowing `condition && <span />`.
 * Arrays can be nested, allowing lists built with `.map()`.
 */
export type Child = Node | string | number | boolean | null | undefined | readonly Child[];

/**
 * Derives editor suggestions and type checking from TypeScript's DOM declarations.
 * T is the element associated with the tag, e.g. HTMLInputElement for <input>.
 *
 * This is a practical subset based on DOM properties, not a complete HTML schema:
 * property names such as `tabIndex` and `readOnly` retain their DOM spelling.
 * It also includes primitive read-only properties from the DOM declarations;
 * those are not useful inputs and assigning them may fail at runtime.
 */
export type Attributes<T extends HTMLElement> = {
  // Keep primitive properties (e.g. hidden, src, width); omit methods and objects.
  [K in keyof T as T[K] extends string | number | boolean ? K : never]?: T[K];
} & {
  // `class` is the markup spelling; `className` is also available via DOM types.
  class?: string;
  // DOM declares role as nullable, so it is not included in the primitive map.
  role?: string;
  // CSS text only, e.g. style="color: white". Use element.style for later updates.
  style?: string;
  // Optional alternative to writing children between the opening/closing tags.
  children?: Child;
  // Attribute values are stringified, including false -> "false" for ARIA/data.
  [attribute: `data-${string}`]: string | number | boolean | undefined;
  [attribute: `aria-${string}`]: string | number | boolean | undefined;
} & {
  // Native event names: onclick, onpointerdown, etc., with the matching event type.
  // Camel-case React names such as onClick are not part of this factory's API.
  [K in keyof HTMLElementEventMap as `on${K}`]?: (event: HTMLElementEventMap[K]) => void;
};

declare global {
  namespace JSX {
    type Element = HTMLElement;
    type IntrinsicElements = {
      [K in keyof HTMLElementTagNameMap]: Attributes<HTMLElementTagNameMap[K]>;
    };
    interface ElementChildrenAttribute {
      children: unknown;
    }
  }
}
