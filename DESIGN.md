# QMIND website design system

<!-- GENERATED:overview source=/document updated=2026-09-07 -->

The QMIND public website is a Next.js App Router site describing QMIND, its people, projects, events, partners, and Careers application flow. This document describes the shared shell and route surfaces inspected in `app/layout.tsx`, `app/globals.css`, `tailwind.config.js`, `app/font.ts`, `app/components/**`, `app/styles/**`, `app/page.tsx`, `app/leadership/page.tsx`, `app/projects/page.tsx`, `app/project/[id]/page.tsx`, `app/careers/CareersApplication.tsx`, and `app/careers/careers.module.scss`; generated 2026-09-07. No Design Plan v2 or selected art direction was found: `_Unknown — not found in implementation._`
<!-- /GENERATED:overview -->

<!-- GENERATED:typography source=/document updated=2026-09-07 -->

## Typography

### Font families

| Role/token | Resolved value and weights | Evidence |
| --- | --- | --- |
| Body / `--font-sofia` / `font-sofia` | Sofia Sans, Google font, `display: swap`; applied to the document body. | `app/font.ts:14-17`, `app/layout.tsx:12`, `app/layout.tsx:43-46`, `tailwind.config.js:39-44` |
| Display / `--font-trade-gothic` / `font-gothic` | Local Trade Gothic, 400 and 700 normal weights. Global `h1` uses this family; navigation and CTA primitives also opt into it. | `app/font.ts:24-38`, `app/globals.css:29-45`, `app/components/Navbar.tsx:74`, `app/components/Buttons/BtnLink.tsx:18`, `tailwind.config.js:39-44` |
| Editorial/display / `--font-kontrapunkt` / `font-kontrapunkt` | Local Kontrapunkt, 400 and 700 normal weights; used in Careers labels/headings and selected project/content surfaces. | `app/font.ts:40-54`, `app/careers/careers.module.scss:23,121-122,141,166,194,203`, `app/components/HeadlineCard.tsx:58-60`, `tailwind.config.js:39-44` |
| Registered `--font-roboto-slab` / `font-roboto_slab` | Roboto Slab Google font is registered and exposed through Tailwind. A live role assignment was not determinable from the inspected implementation. | `app/font.ts:19-22`, `tailwind.config.js:39-44` |
| Exported `inter` and `roboto_mono` | Inter and Roboto Mono are exported with `display: swap`; no live usage was found in the inspected app files. | `app/font.ts:4-12` |

### Type scale and roles

| Selector/surface | Implemented size, line height, tracking, and weight | Evidence |
| --- | --- | --- |
| Global `h1` | 32px / 45px on the base viewport; 43px / 60px from 768px; the final duplicate 1536px rule resolves to 70px / 76.46px. Bold Trade Gothic. | `app/globals.css:29-46` |
| Global `h2` | 25px base, 30px from 768px, final 45px at 1536px; bold. | `app/globals.css:48-61` |
| Global `h3` | 20px base, 25px from 768px, final 30px at 1536px; bold. | `app/globals.css:63-76` |
| Global `li`, `a`, `p` | 18px; no additional effective large-screen size is declared in the empty media blocks. | `app/globals.css:78-86` |
| Navigation | 16px, 700 weight, normal line height, `-0.8px` tracking, uppercase; 24px on screens up to 768px. | `app/styles/navbar.module.scss:1-18` |
| CTA links | 10px base, 11px from `md`, 14px from `lg` in `BtnLink`; 10px / 11px / 16px in `CTALink`; 700 Trade Gothic, `1.6px` tracking. | `app/components/Buttons/BtnLink.tsx:11-18`, `app/components/CTALink.tsx:5-14` |
| Careers hero | `clamp(4rem, 8vw, 7.5rem)`, `.84` line height, `-.045em` tracking; the <=640px rule uses `clamp(3.7rem, 18vw, 5rem)`. | `app/careers/careers.module.scss:23-27,251-252` |
| Careers supporting copy | Hero details `clamp(1.15rem, 1.8vw, 1.4rem)` / `1.45`; section intro `clamp(2.5rem, 5vw, 4.5rem)` / `.95` / `-.025em`; project headings `clamp(1.35rem, 2.5vw, 1.8rem)` / `1.2`. | `app/careers/careers.module.scss:42-44,113-115,139-143` |

The implementation does not expose a single global type-token scale; role sizes are split between global CSS, Tailwind utilities, and route/component styles.
<!-- /GENERATED:typography -->

<!-- GENERATED:color source=/document updated=2026-09-07 -->

## Color

### Tokenized palette

| Token | Value | Defined in | Observed use |
| --- | --- | --- | --- |
| `--background-primary` | `#262626` | `app/globals.css:5-11` | Tailwind `background` alias and the light stop of the site shell gradient. | `tailwind.config.js:75-82`, `app/styles/layout.module.scss:1-4` |
| `--background-secondary` | `#161616` | `app/globals.css:5-11` | Dark page/background value and mobile navigation open state. | `app/styles/navbar.module.scss:60-63`, `app/layout.tsx:27` |
| `--foreground-primary` | `#f7f7f7` | `app/globals.css:5-11` | Body text and navigation link color. | `app/globals.css:25-27`, `app/styles/navbar.module.scss:24-27` |
| `--foreground-secondary` | `#f0b542` | `app/globals.css:5-11` | Gold accent used directly by the navigation, hero, and Careers surface. | `app/styles/navbar.module.scss:29-50`, `app/page.tsx:462-465`, `app/careers/careers.module.scss:2-11` |
| `--forground-tertiary` | `#161616` | `app/globals.css:5-11` | Token exists with the current misspelled name; `.tertiary-colour` also applies the same literal. | `app/globals.css:21-23` |
| Tailwind `success` | `#88e788` | `tailwind.config.js:74-77` | Named utility token; a live consuming surface was not found in the inspected files. | `tailwind.config.js:74-77` |
| Tailwind `fail` | `#FF5B61` | `tailwind.config.js:74-77` | Destructive/error utility; form labels and upload errors consume `text-fail`. | `tailwind.config.js:74-77`, `app/components/PhotoGallery/PhotoGallery.tsx:249-253`, `app/components/ui/form.tsx:93-99` |
| Careers `--careers-bg` | `#161616` | `app/careers/careers.module.scss:2-11` | Careers page background. | `app/careers/careers.module.scss:12-14` |
| Careers `--careers-surface` | `#222220` | `app/careers/careers.module.scss:2-11` | Project cards, form fields, review blocks, and state surfaces. | `app/careers/careers.module.scss:134,178-180,202,229` |
| Careers `--careers-raised` | `#292927` | `app/careers/careers.module.scss:2-11` | Declared scoped surface token; a consuming selector was not found in the inspected file. | `app/careers/careers.module.scss:2-11` |
| Careers `--careers-text` | `#f7f7f4` | `app/careers/careers.module.scss:2-11` | Careers primary text. | `app/careers/careers.module.scss:12-14,147,179,224` |
| Careers `--careers-muted` | `#b7b7b0` | `app/careers/careers.module.scss:2-11` | Supporting text and inactive controls. | `app/careers/careers.module.scss:44,107,115,125,129,143,195,207,229,233` |
| Careers `--careers-line` | `#454542` | `app/careers/careers.module.scss:2-11` | Dividers, borders, and input/card outlines. | `app/careers/careers.module.scss:47-48,113,117-119,129,134,137,175,200,202,220,228-234` |
| Careers `--careers-gold` | `#f0b542` | `app/careers/careers.module.scss:2-11` | Kicker, active filters, primary actions, focus border, and accent text. | `app/careers/careers.module.scss:23,120-122,131,145,184,196,198,221-224` |
| Careers `--careers-blue` | `#3f69ff` | `app/careers/careers.module.scss:2-11` | Selected project, progress, prompt, and secondary action state. | `app/careers/careers.module.scss:136,147-160,190-194,209-214` |

Tailwind semantic mappings such as `border`, `input`, `ring`, `primary`, `secondary`, `destructive`, `muted`, `accent`, `popover`, and `card` point to `hsl(var(--...))`, but their custom-property declarations were not found in the inspected source. `_Unknown — not found in implementation._`

### Ad hoc literals and effects

Literal colors are also embedded directly in component/style code rather than routed through the token set. Observed examples include `#2E2E2E` card surfaces and `#1E1E1E` project surfaces (`app/styles/cardSlider.module.scss:24-34`, `app/project/[id]/page.css:1-12`), `#4E4E4E` borders (`app/project/[id]/page.css:8-10`, `app/components/PhotoGallery/PhotoGallery.css:14-24`), blue `#3F69FF` project labels (`app/components/ProjectHeader/projectHeader.css:18-28`), white `#F7F7F7` CTA surfaces (`app/components/Buttons/BtnLink.tsx:11-18`), and home card gradients `#E49A09`, `#d11055`, and `#1c9fff` (`app/styles/home.module.scss:48-66`). Gold and blue are repeatedly re-declared as literals in TSX as well (`app/page.tsx:462-465`, `app/components/Navbar.tsx:176-205`). These are implementation drift from the CSS custom-property system, not additional named tokens.

No contrast relationships were computed in this run.
<!-- /GENERATED:color -->

<!-- GENERATED:spacing source=/document updated=2026-09-07 -->

## Spacing

The repository uses Tailwind's built-in utility scale plus repeated arbitrary values; it does not define a custom base unit or named spacing-token scale. `_Unknown — not found in implementation._` for an authoring base unit.

| Pattern | Implemented values | Evidence |
| --- | --- | --- |
| Shared container | `gap-7` (Tailwind utility), `20px` horizontal padding below `lg`, `5rem` at `lg`; max widths `490px` at `xs`, `1000px` default, `1600px` at `lg`, and `1900px` at `3xl`. | `app/components/Container.tsx:7-13` |
| Tailwind container defaults | Centered container with `2rem` default padding and custom screens through `3xl: 1800px`. | `tailwind.config.js:45-72` |
| Home rhythm | Main column gap `4rem` base / `5rem` from `md`, vertical padding `3rem` base / `5rem` from `2xl`; section containers use gaps from `16px` to `50px`. | `app/page.tsx:455-460,519,526-529,563,639-645` |
| Navigation/footer | Nav links gap `50px` mobile, `20px` at `lg`, `32px` at `xl`, `50px` at `2xl`; footer gap `30px`, `75px` at `md`, `50px` at `lg`. | `app/components/Navbar.tsx:120`, `app/components/Footer.tsx:10-14,33-37` |
| Cards and controls | Common observed values include `10px`, `15px`, `16px`, `20px`, `24px`, `30px`, `32px`, `37px`, and `50px` gaps/padding; radius values include 5px, 10px, 16px, 17px, 20px, 24px, and 32px. | `app/components/StatsCards.tsx:8-10,23-26`, `app/components/HeadlineCard.tsx:32-35`, `app/components/LeadershipCards/LeadershipCards.tsx:146-163`, `app/components/Buttons/BtnLink.tsx:11-18` |
| Project detail/gallery | Project information panel uses `32px` padding and `40px` vertical margins; gallery uses `12px` padding and `16px` gaps; tags use `8px 16px` padding and `8px` gaps. | `app/project/[id]/page.css:1-12`, `app/components/PhotoGallery/PhotoGallery.css:14-24`, `app/components/Tags/tags.css:1-28` |
| Careers flow | Hero and application layout use `clamp()` spacing; project cards use `1.5rem` padding; field grids use `1.25rem` gaps; navigation uses `2rem` top margin and `1.5rem` top padding. | `app/careers/careers.module.scss:15-21,28-39,102-110,117-118,133-138,168-181,220-229` |

Spacing is intentionally mixed between shared utilities and route-level arbitrary values; no consistent multiplier pattern beyond the underlying Tailwind utilities is declared in source.
<!-- /GENERATED:spacing -->

<!-- GENERATED:components source=/document updated=2026-09-07 -->

## Components

### Shared shell and content primitives

- `Container` — centered, flex-column page wrapper with responsive padding/max-widths and default `gap-7`; `app/components/Container.tsx:5-18`.
- `Navbar` — fixed 90px desktop navigation with logo, route links, social links, mobile menu, and login/logout dialog; `app/components/Navbar.tsx:66-215`, `app/styles/navbar.module.scss:1-64`.
- `Footer` — two-column link groups plus a desktop-only colorful pillar image; `app/components/Footer.tsx:8-53`.
- `Title`, `Text`, and `Head3` — centered heading/subtitle grouping and mergeable paragraph/heading wrappers; `app/components/Title.tsx:4-22`, `app/components/Text.tsx:5-7`, `app/components/Head3.tsx:5-7`.
- `Button`, `BtnLink`, and `CTALink` — gold/white-accented button/link primitives with fixed minimum widths, rounded 5px surfaces, uppercase/tracked CTA text, and external-link behavior; `app/components/Buttons/Button.tsx:3-11`, `app/components/Buttons/BtnLink.tsx:6-19`, `app/components/CTALink.tsx:5-14`.

### UI primitives

- `Button` from `app/components/ui/button.tsx:7-32` — CVA variants `default`, `destructive`, `outline`, `secondary`, `ghost`, and `link`; sizes `default`, `sm`, `lg`, and `icon`; includes focus ring, transition, and disabled opacity classes.
- `Card` and its `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter` parts — rounded border/shadow surface with 6-unit header/content/footer padding; `app/components/ui/card.tsx:5-79`.
- `Input`, `Textarea`, `Label`, and `Form*` — accessible form controls and field wiring with focus rings, disabled states, validation ids, and `text-fail` error labels; `app/components/ui/input.tsx:8-25`, `app/components/ui/textarea.tsx:8-24`, `app/components/ui/label.tsx:9-25`, `app/components/ui/form.tsx:73-165`.
- `Dialog` and `AlertDialog` — Radix-based modal/confirmation surfaces with black overlay/content, focusable close control, responsive header/footer alignment, and Tailwind enter/exit animation states; `app/components/ui/dialog.tsx:17-124`, `app/components/ui/alert-dialog.tsx:15-121`.
- `Tabs`, `Switch`, and `DropdownMenu` — Radix-based stateful controls with rounded utility surfaces, active/checked states, and focus/disabled styling; `app/components/ui/tabs.tsx:8-50`, `app/components/ui/switch.tsx:8-25`, `app/components/ui/dropdown-menu.tsx:59-182`.

### Domain components

- Project surfaces: `ProjectCard`, `ProjectFilters`, `ProjectHeader`, `ProjectDescription`, `PhotoGallery`, `TeamPhotos`, `Tags`, `SocialLinks`, and `ProjectPDF`; `app/components/ui/projectCard.tsx`, `app/components/ui/projectFilters.tsx`, `app/components/ProjectHeader/projectHeader.tsx`, `app/components/ProjectDescription/ProjectDescription.tsx`, `app/components/PhotoGallery/PhotoGallery.tsx`, `app/components/TeamPhotos/TeamPhotos.tsx`, `app/components/Tags/tags.tsx`, `app/components/SocialLinks/SocialLinks.tsx`, `app/components/ProjectPDF/ProjectPDF.tsx`.
- Home content: `HeadlineCard`, `StatsCards`, `PartnersAndClients`, `PicSlider`, `CardSlider`, `CompanySlider`, `TestimonialCard`, and `Sponsors`; `app/components/HeadlineCard.tsx:15-100`, `app/components/StatsCards.tsx:6-164`, `app/components/PartnersAndClients.tsx:9-53`, `app/components/PicSlider.tsx`, `app/components/CardSlider.tsx`, `app/components/CompanySlider.tsx`, `app/components/TestimonialCard.tsx`, `app/components/Sponsors/Sponsors.tsx`.
- Careers: `CareersApplication` is the multi-step project selection, form, prompt, demographics, review, and submission surface; its appearance is in `app/careers/careers.module.scss:15-267` and its project image wrapper records natural image dimensions in `app/careers/CareersApplication.tsx:338-374`.

The repository has a local UI primitive set and many domain components; no separate shared package was found.
<!-- /GENERATED:components -->

<!-- GENERATED:layout source=/document updated=2026-09-07 -->

## Layout

- **Global shell:** `RootLayout` renders a full-height flex column, fixed `Navbar`, an 80px top offset for page content, a `Suspense` boundary, and `Footer`; the body uses Sofia Sans and the site background gradient. `app/layout.tsx:43-60`, `app/styles/layout.module.scss:1-4`.
- **Container convention:** Most pages use the centered `Container` flex column, with responsive horizontal padding and max widths. `app/components/Container.tsx:5-18`.
- **Home composition:** The home page is a vertical sequence of differently composed sections: two-column hero with hidden-on-mobile logo video, sliders, centered title/content sections, a responsive stats grid, testimonial spotlight plus horizontal card strip, partner/company sliders, and image-led conference/incubator sections. `app/page.tsx:455-705`.
- **Projects:** The catalogue uses a vertical `Container`; its intro switches from stacked to two-column flex at `lg`, followed by filters/actions and a vertical project-card list. `app/projects/page.tsx:39-107`.
- **Leadership:** Intro content switches from stacked centered to two-column at `lg`; member cards wrap in a centered flex row with responsive card widths. `app/leadership/page.tsx:12-38`, `app/components/LeadershipCards/LeadershipCards.tsx:142-188`.
- **Project detail:** Project content is organized into a `32px` padded, bordered, rounded column panel, with related subcomponents for header, descriptions, photos, tags, social links, and team photos. `app/project/[id]/page.tsx:65-130`, `app/project/[id]/page.css:1-12`.
- **Careers:** The hero uses a `5fr 3fr 4fr` three-column grid; the application uses a sticky progress column beside the form; ranking cards are a three-column grid and form fields are two columns until the mobile breakpoint. `app/careers/careers.module.scss:15-21,88-110,117-124,168-181,218`, `app/careers/CareersApplication.tsx:238-485`.
- **Hiring images:** The project-image region retains a `22rem` maximum but, after load, uses `min(natural width, 22rem, 100%)` and the image’s natural aspect ratio so short/small logo assets do not occupy a fixed 4:3 box. `app/careers/CareersApplication.tsx:338-374`, `app/careers/careers.module.scss:137-138`.

The dominant structural primitives are flex and grid; no global CSS grid column system or universal page template beyond `Container` was found.
<!-- /GENERATED:layout -->

<!-- GENERATED:motion source=/document updated=2026-09-07 -->

## Motion

| Surface | Trigger | Motion | Technique/evidence |
| --- | --- | --- | --- |
| Home headline card image | Project selection change | Opacity `0 -> 1`, `1.1s`, `easeInOut`. | Framer Motion `useAnimation`, variants, and `transition`; `app/components/HeadlineCard.tsx:19-30,37-42`. |
| Home stats cards | Entering viewport and hover | Enter: opacity `0 -> 1`, y `75 -> 0`, `0.5s` with `.25s` delay. Hover: scale `1.05` over `.5s`. | Framer Motion `whileInView`, `whileHover`; `app/components/StatsCards.tsx:11-23` and repeated for the card rows through line 158. |
| Pic/Card/Company sliders | Mount/continuous carousel | Infinite linear motion, `55s`, with hover pause in `CardSlider`. | Framer Motion; `app/components/PicSlider.tsx:3-38`, `app/components/CardSlider.tsx:8-57`, `app/components/CompanySlider.tsx:3-47`. |
| Dialogs | Open/close state | Fade, zoom, and slide state animations; overlay fade; `duration-200`. | Tailwind animation-state classes in `app/components/ui/dialog.tsx:21-49`; keyframes/animation tokens in `tailwind.config.js:117-145`. |
| Careers state/navigation | Selection completion and step changes | Smooth scroll into completion or to top; `transition` rules use `.2s ease` for controls and `.1s ease` for active press transforms. | `app/careers/CareersApplication.tsx:150-154,190-194`, `app/careers/careers.module.scss:128-129,147-149,181,220-228`. |
| Gallery/upload feedback | Horizontal wheel scrolling and uploads | Horizontal `scrollTo` uses `behavior: "smooth"`; upload buttons use Tailwind `animate-spin`. | `app/components/PhotoGallery/PhotoGallery.tsx:154-169,256-284`, `app/components/Edit/editProject.tsx:61`, `app/components/TeamPhotos/TeamPhotos.tsx:238`. |

Additional hover scale/opacity transitions exist on navigation, sponsors, testimonial cards, and buttons; these are documented at their source rather than elevated to a shared motion token. `app/components/Navbar.tsx:176-205`, `app/components/Sponsors/Sponsors.tsx:53`, `app/components/TestimonialCards/TestimonialCard.tsx:72-113`.
<!-- /GENERATED:motion -->

<!-- GENERATED:responsive source=/document updated=2026-09-07 -->

## Responsive behavior

### Defined breakpoints

The Tailwind theme defines `xxs: 340px`, `xs: 500px`, `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`; the container also defines `3xl: 1800px`. `tailwind.config.js:12-33,45-72`.

### Surface changes

- **Global type:** `h1`, `h2`, and `h3` grow at `768px` and again at `1536px`; `app/globals.css:29-76`.
- **Navigation:** The menu is a compact fixed bar at desktop height `90px`; navigation links become a full-screen/viewport mobile layout through the max-768 rule, while the open background applies through max-1023px. Desktop link gaps change at `lg`, `xl`, and `2xl`; `app/components/Navbar.tsx:67-120`, `app/styles/navbar.module.scss:1-18,56-64`.
- **Shared containers:** Horizontal padding is `20px` below `lg` and `5rem` at `lg`; maximum width changes at `xs`, `lg`, and `3xl`; `app/components/Container.tsx:7-13`.
- **Home:** Hero copy is full width until `lg`, with the logo video hidden below `lg`; hero columns and content widths change at `lg`/`2xl`; sliders/cards and image sections use `xxs`, `sm`, `md`, `lg`, `xl`, and `2xl` utility variants. `app/page.tsx:455-501,568-705`.
- **Projects:** Intro switches to row layout at `lg`; project filters/actions remain stacked/flowing below it. `app/projects/page.tsx:42-78`.
- **Leadership:** Intro switches to row at `lg`; member cards use `150px`, `225px`, and `275px` widths across base, `md`, and `lg`; `app/leadership/page.tsx:12-33`, `app/components/LeadershipCards/LeadershipCards.tsx:146-163`.
- **Project detail/gallery:** Titles and labels shrink at max-390px; gallery and tags remain horizontally scrollable/wrapping surfaces; `app/components/ProjectHeader/projectHeader.css:1-29`, `app/components/PhotoGallery/PhotoGallery.css:1-24`, `app/components/Tags/tags.css:1-31`.
- **Careers:** At max-900px the hero becomes a two-column `1fr 10rem` composition and the application collapses to one column; at max-640px the hero becomes block, ranking/fields become one column, project actions and navigation buttons become full-width, and the image wrapper remains capped at `22rem` while shrinking to the loaded image ratio. `app/careers/careers.module.scss:238-263`, `app/careers/CareersApplication.tsx:338-374`.

No separate responsive rules were found for every individual component; surfaces without explicit rules inherit Tailwind/default flow behavior.
<!-- /GENERATED:responsive -->

<!-- GENERATED:motion-reduced source=/document updated=2026-09-07 -->

## Reduced motion

The only explicit `prefers-reduced-motion` handling found is scoped to Careers: all descendants of `.page` switch to automatic scroll behavior and `.01ms` transition duration. `app/careers/careers.module.scss:265-267`.

No global reduced-motion override was found for Framer Motion carousels, viewport reveals, hover scales, dialog animations, or smooth scrolling elsewhere in the inspected implementation. `_Unknown — not found in implementation._`
<!-- /GENERATED:motion-reduced -->

<!-- GENERATED:implementation-guidance source=/document updated=2026-09-07 -->

## Implementation guidance

- Reuse `Container` for page-level width, padding, and vertical flow; reuse `Title`, `Text`, `Head3`, `Button`, `BtnLink`, `CTALink`, and the local `app/components/ui` primitives before adding another surface primitive. Evidence: `app/components/Container.tsx:5-18`, `app/components/Title.tsx:4-22`, `app/components/ui/button.tsx:7-56`.
- Use `Sofia Sans` for body copy, `Trade Gothic` for the established display/navigation/CTA role, and `Kontrapunkt` for the editorial/display role already used by Careers and selected content surfaces. Evidence: `app/layout.tsx:12,43-46`, `app/font.ts:14-54`, `tailwind.config.js:39-44`.
- Prefer the existing CSS custom properties for site background/foreground/gold and the Careers scoped variables for hiring UI; avoid introducing a parallel palette when the existing values cover the surface. Evidence: `app/globals.css:5-11`, `app/careers/careers.module.scss:2-11`.
- Keep hiring project images within the `22rem` maximum while preserving their loaded natural aspect ratio; do not restore a fixed 4:3 wrapper for short logo assets. Evidence: `app/careers/CareersApplication.tsx:338-374`, `app/careers/careers.module.scss:137-138`.
- Follow the repository’s public-facing constraints: keep interactions accessible and understandable, check keyboard/focus behavior, responsive layouts, validation, and reduced-motion behavior, and keep sensitive applicant information out of client code/logs/tests. Evidence: `AGENTS.md`.
- Apply the connected website design rules when extending the system: make the first viewport communicate hierarchy and a deliberate entry point; vary section composition while preserving one visual system; use typography as composition with a clear display/body contrast; prefer dividers and whitespace to wrapping every group in a card; use transform/opacity for motion and respect reduced motion. Source: `get_design_rules(category=website)` returned `categoryPrinciples`, `compositionPrinciples`, `typographyPrinciples`, `spacingPrinciples`, and `motionPrinciples`.
- The same MCP guidance requires semantic React components, CSS custom properties for tokens, static functionality unless requested, no new component library, and desktop/mobile screenshots before review. Source: `get_design_rules(category=website)` `implementationConstraints`.

No selected Art Director direction was available in this conversation or repository, so no direction-specific implementation guidance is documented.
<!-- /GENERATED:implementation-guidance -->

<!-- GENERATED:open-questions source=/document updated=2026-09-07 -->

## Open questions

- No Design Plan v2 or selected art direction summary was found in the conversation or repository: `_Unknown — not found in implementation._`
- A single base spacing unit or authored spacing multiplier scale was not defined: `_Unknown — not found in implementation._`
- The CSS custom-property declarations behind Tailwind semantic `hsl(var(--...))` colors were not found in the inspected source: `_Unknown — not found in implementation._`
- Global reduced-motion behavior outside the Careers page was not found: `_Unknown — not found in implementation._`
- The live role of the registered Roboto Slab, Inter, and Roboto Mono fonts was not determinable from the inspected app files: `_Unknown — not found in implementation._`
- Contrast relationships were not computed in this run.
<!-- /GENERATED:open-questions -->
