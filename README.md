# Music Mixer Playable

**One codebase. Multiple music packs, tutorial flows, themes, languages, and ad networks.**

A playable music mixer built with [Replayable](https://github.com/replayablejs/replayable)
and HTML/CSS/TSX. The gameplay is shared across every variation: change configuration
and assets to produce a different creative without copying the project.

[Browse previews & download exports](https://replayablejs.github.io/music-mixer-playable/)

| Music pack  | Guided introduction                                                                                    | Full mixer immediately                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Liquid DnB  | [Play guided](https://replayablejs.github.io/music-mixer-playable/exports/preview_liquiddnb_en.html)   | [Play free play](https://replayablejs.github.io/music-mixer-playable/exports/preview_liquiddnb_no_tutorial_en.html)   |
| First Light | [Play guided](https://replayablejs.github.io/music-mixer-playable/exports/preview_first_light_en.html) | [Play free play](https://replayablejs.github.io/music-mixer-playable/exports/preview_first_light_no_tutorial_en.html) |

These links open live English previews. The [catalog](https://replayablejs.github.io/music-mixer-playable/)
also includes French and Italian previews, plus downloadable HTML and ZIP exports
for every configured network. No local setup is needed to try them.

| Liquid DnB                                                    | First Light                                                                            |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| ![Liquid DnB mixer with a purple theme](readme/liquiddnb.png) | ![First Light mixer with a navy and amber theme](readme/first-light.png)               |
| Drum-and-bass loops with purple and pink visuals.             | Original synthesized loops at 128 BPM in A minor, with navy, amber, and coral visuals. |

## One source, only the assets each variation needs

Both music packs live in this repository, but **neither pack’s audio is included in
the other pack’s build**. Players download only the music used by their variation.

This is handled automatically by Replayable’s asset pipeline, using the exclusion
rules in [config/versions.ts](config/versions.ts). For example, the Liquid DnB pair:

```ts
export default {
  liquiddnb: {
    params: { soundPack: 'liquiddnb', tutorial: true },
    assets: { exclude: ['sounds/firstlight_*'] },
  },
  'liquiddnb-no-tutorial': {
    params: { soundPack: 'liquiddnb', tutorial: false },
    assets: {
      exclude: ['sounds/firstlight_*', 'sprites/thumbs-up-spritesheet.png'],
    },
  },
  // First Light has the same guided/free-play pair,
  // excluding sounds/liquiddnb_* instead.
};
```

The [`soundPack` parameter](config/params.ts) selects the music mapping, timing, and CSS theme. Replayable
applies the corresponding asset rules during the build; there is no manual file
copying or separate project to maintain. Keep the parameter and exclusions paired
when adding another pack.

The same approach extends to more creative variations. Add their configuration,
assets, and any behavior they need while keeping the shared gameplay in one place.
Replayable builds the configured combinations of **version × language × network**.

This project currently produces:

- **[4 versions](config/versions.ts):** Liquid DnB and First Light, each with tutorial on or off.
- **[3 languages](config/localization.ts):** English, French, and Italian, including localized hand artwork.
- **[8 network profiles](config/networks.ts):** Preview, AppLovin, Meta, Google, Liftoff, Mintegral, Moloco, and Unity.
- **96 exports**, including twelve standalone browser previews.

The catalog automatically lists the generated files, their formats, and sizes.
Download an HTML or ZIP export for testing or production delivery to its network.

## Localized artwork, resized automatically

Localization applies to images as well as text. These three source files represent
one logical asset, `hand`:

| English / fallback                                                                      | French                                                                                    | Italian                                                                                    |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| <img src="assets/sprites/hand.png" width="128" height="128" alt="English hand artwork"> | <img src="assets/sprites/hand.fr.png" width="128" height="128" alt="French hand artwork"> | <img src="assets/sprites/hand.it.png" width="128" height="128" alt="Italian hand artwork"> |
| `hand.png`                                                                              | `hand.fr.png`                                                                             | `hand.it.png`                                                                              |

Using the language and fallback settings in [config/localization.ts](config/localization.ts),
Replayable selects the matching artwork **at build time**: French builds use
`hand.fr.png`, Italian builds use `hand.it.png`, and English uses the unsuffixed
fallback, `hand.png`. Each build includes its selected hand, rather than all three.
Gameplay always accesses `sprites.hand`; it needs no language-specific image logic.

Every source image is **1254 × 1254 pixels**. This excerpt from
[config/assets.ts](config/assets.ts) shows the rule that resizes the selected artwork
to **128 × 128 pixels** in the generated assets:

```ts
export default {
  assets: {
    sprites: [
      {},
      {
        match: 'hand{,.*}.png',
        options: { scale: 128 / 1254 },
      },
    ],
  },
};
```

Keep the high-resolution originals in the repository; Replayable handles language
selection, resizing, and output encoding during the build. The delivered image is
128 × 128; its on-screen size still follows the responsive layout.

## Two bundles, shared by every version

[config/assets.ts](config/assets.ts) defines one loading split for all four versions:

| Bundle    | Contents                                                              | Loading                                                 |
| --------- | --------------------------------------------------------------------- | ------------------------------------------------------- |
| Primary   | Eight compact-pad sounds, localized hand artwork, font, and text      | Loaded by `playable.ready()` before the scene appears.  |
| Secondary | Sixteen remaining sounds, plus the thumbs-up sheet in guided versions | Loading starts unconditionally after the scene appears. |

**Guided versions** start with eight pads, teach the mixer, play the thumbs-up
celebration, then expand to all 24 pads. **Free-play versions** show all 24 pads
immediately, skip the tutorial and celebration, and exclude the thumbs-up asset
from the export. Idle hints remain available in both, controlled by [config/params.ts](config/params.ts).

The loading split is shared: free play still loads eight sounds in primary and
sixteen in secondary. There are no extra waits before interaction or expansion.
Secondary defers runtime loading and decoding; its bytes are still included in a
standalone export. Asset exclusion, by contrast, removes the unused asset entirely.

## What else this demonstrates

- Shared mixer logic, grouped pad selection, synchronized loops, and one-shot FX.
- Responsive portrait and landscape layouts using Replayable’s [screen configuration](config/screen.ts) and safe-area data.
- Tutorial, idle hints, speaker pulses, particles, and success/timeout endcards.
- Runtime-managed audio unlock, mute, visibility, timers, and animation lifecycle.
- Localized text and image assets, plus themes supplied through CSS variables.

The selected mix continues through the endcard. Each pack has 20 loops and four
one-shot effects. First Light’s choir sounds are synthesized vowel textures.

## Run locally

Requires Node.js 24+ and pnpm 10.32.1. Replayable packages are pinned to the published
`0.1.0-alpha.4` release; no toolkit checkout is required. The local catalog and
export preview commands also require Python 3.

```sh
pnpm install --frozen-lockfile
pnpm dev:liquiddnb:tutorial
# Or:
pnpm dev:first-light:tutorial
# Start directly with the full mixer:
pnpm dev:liquiddnb:free-play
pnpm dev:first-light:free-play
```

`pnpm dev` starts the default version. The root
[replayable.config.ts](replayable.config.ts) composes these typed configuration sections:

| Configuration                             | Controls                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------------ |
| [assets.ts](config/assets.ts)             | Source assets, processing, resizing, and primary/secondary bundles.      |
| [versions.ts](config/versions.ts)         | Music-pack and tutorial combinations, with per-version asset exclusions. |
| [params.ts](config/params.ts)             | Music-pack selection, tutorial, and idle-hint defaults.                  |
| [localization.ts](config/localization.ts) | Languages and fallback language for text and artwork.                    |
| [networks.ts](config/networks.ts)         | Delivery networks included in builds and exports.                        |
| [screen.ts](config/screen.ts)             | Portrait/landscape dimensions, aspect ratios, and resolution.            |
| [completion.ts](config/completion.ts)     | Duration and inactivity completion timers.                               |
| [controls.ts](config/controls.ts)         | Persistent CTA visibility.                                               |
| [devtools.ts](config/devtools.ts)         | Runtime statistics and development controls.                             |
| [store.ts](config/store.ts)               | Android and iOS destinations for store buttons.                          |

## Build the catalog and exports

Stop the development server first; development and production share generated asset paths.

```sh
pnpm build
pnpm catalog
pnpm catalog:preview
```

Open [the local catalog](http://127.0.0.1:4176/). Its twelve preview links and 96 download
links are generated from Replayable’s public export results, not a handwritten file list.

- `dist/`: built playable variants.
- `exports/`: network-specific HTML and ZIP delivery files.
- `.site/`: the complete deployable catalog, stylesheet, and downloadable exports.

`pnpm catalog` exports existing builds and generates `.site/`. Missing builds or
export validation errors stop generation. To export without the catalog, run
`pnpm export`; `pnpm preview` serves those files at `http://127.0.0.1:4174/`.

Catalog descriptions live in [scripts/catalog/packs.mts](scripts/catalog/packs.mts); HTML is rendered with
`hastscript` and `hast-util-to-html`, the same libraries used by Replayable.

Store buttons currently open Unity’s Creative Testing app, matching Replayable’s
basic examples. Set your own app’s URLs in [config/store.ts](config/store.ts) before
running a campaign. Browser previews do not reproduce an ad host’s environment;
verify delivery in the target network.

## CI and deployment

[The GitHub Actions workflow](.github/workflows/ci.yml) runs on pull requests,
pushes to `main`, and manual runs. It installs locked dependencies, builds all
configured variants, checks formatting/lint/types, and exports the catalog on
Linux, Windows, and macOS. Each operating system runs independently so a failure
on one does not cancel the others.
Building comes before type checking because the asset registries are generated.

Once all three operating systems pass, successful pushes to `main` deploy the
Linux-generated `.site/` to GitHub Pages. A manual run from
`main` also deploys; pull requests and manual runs from other branches only validate.
The deployed site includes the catalog, every browser preview, and every downloadable
network export. Adding versions, languages, or networks requires no workflow changes.

The [live catalog](https://replayablejs.github.io/music-mixer-playable/) updates
automatically after successful deployments. Follow builds and deployments in
[GitHub Actions](https://github.com/replayablejs/music-mixer-playable/actions).

To deploy your own fork, select **Settings → Pages → Build and deployment →
Source → GitHub Actions**, then run the workflow from `main`. Update this README's
public links to your fork's Pages URL. No deployment secret is needed; the workflow
uses GitHub's built-in token with Pages permissions limited to the deployment job.

## Development checks

```sh
pnpm check       # Formatting, lint, and type checking
pnpm format     # Apply formatting
pnpm lint:fix   # Apply available lint fixes
```

Installing dependencies sets up Husky. Before each commit, lint-staged formats staged
files and checks JavaScript/TypeScript with Oxlint. VS Code recommendations and
workspace settings provide formatting and lint fixes on save.

## Project structure

- [config/](config/): typed Replayable configuration sections.
- `src/main.ts`: asset readiness and scene mounting.
- `src/model/`: selection and success rules.
- `src/scene/`: gameplay, interface, themes, and endcards.
- `src/features/`: mixer, audio, guidance, and artwork components.
- `src/types/`: shared TypeScript contracts.
- `assets/`: source assets; `src/assets/` is generated by Replayable.
- `scripts/catalog/`: catalog rendering, descriptions, and styling.
- `readme/`: screenshots used above.

## Work on Replayable locally

Use this playable to develop and test Replayable against a complete application:
audio, localized assets, multiple creative versions, and network exports. Connect
a local toolkit checkout to try changes before publishing a Replayable release.

The [local development helper](scripts/replayable-local.mts) builds the required
Replayable packages and installs their packed tarballs, including their Replayable
dependencies. This exercises the packages as a consuming project would install them.
The connection is a snapshot: toolkit edits take effect after refreshing it.

This helper currently supports macOS and Linux. On Windows, use WSL for this workflow.

### 1. Prepare the toolkit checkout

Clone Replayable wherever you keep your projects and install its dependencies.
Replace `/path/to/replayable` in the commands below with the actual path to your
cloned Replayable repository. If you already have a checkout, skip the clone command.

```sh
git clone https://github.com/replayablejs/replayable.git /path/to/replayable
pnpm --dir /path/to/replayable install --frozen-lockfile
```

### 2. Connect and run the playable

Stop the playable's development server first. Run these commands from this project:

```sh
pnpm replayable:local connect /path/to/replayable
pnpm dev:liquiddnb:tutorial
```

You can also use `pnpm dev:first-light:tutorial` or either free-play version. The playable
now uses the packages from that Replayable checkout.

### 3. Test toolkit changes

Edit Replayable in its checkout. Stop the playable's development server, refresh the
packages, and restart it:

```sh
pnpm replayable:local refresh
pnpm dev:liquiddnb:tutorial
```

`refresh` remembers the checkout, rebuilds the required packages, and installs fresh
tarballs. If you have already built those packages yourself, use
`pnpm replayable:local refresh --skip-build` to pack the existing output.

To verify the full build and export workflow, stop the development server and run:

```sh
pnpm build
pnpm check
pnpm catalog
pnpm catalog:preview
```

The catalog lets you try every preview and download the network exports produced
with your local toolkit changes.

### 4. Restore published dependencies

Stop the development server before disconnecting:

```sh
pnpm replayable:local restore
```

This restores the saved `package.json` and `pnpm-lock.yaml`, reinstalls their
dependencies, and removes the temporary packages. Your source changes in both
repositories remain intact.

The helper temporarily changes dependency files and keeps its backup and tarballs
in the ignored `.replayable-local/` directory. Restore before committing this
project's dependency files. Avoid editing those files while connected: the helper
refuses to overwrite changes made after connection.

Use `pnpm replayable:local status` to check the connection, or
`pnpm replayable:local --help` for command options.

## Asset rights

See [asset rights](assets/NOTICE.md) before redistributing bundled media.
