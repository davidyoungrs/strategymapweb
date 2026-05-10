---
name: Kettle Strat Industrial
colors:
  surface: '#111417'
  surface-dim: '#111417'
  surface-bright: '#37393d'
  surface-container-lowest: '#0b0f11'
  surface-container-low: '#191c1f'
  surface-container: '#1d2023'
  surface-container-high: '#272a2d'
  surface-container-highest: '#323538'
  on-surface: '#e1e2e6'
  on-surface-variant: '#bdcab6'
  inverse-surface: '#e1e2e6'
  inverse-on-surface: '#2e3134'
  outline: '#889482'
  outline-variant: '#3e4a3b'
  surface-tint: '#6adf61'
  primary: '#e3ffd8'
  on-primary: '#003a04'
  primary-container: '#7ef473'
  on-primary-container: '#006f10'
  inverse-primary: '#006e10'
  secondary: '#a0d3a2'
  on-secondary: '#073916'
  secondary-container: '#24522d'
  on-secondary-container: '#92c595'
  tertiary: '#faf6f2'
  on-tertiary: '#31302e'
  tertiary-container: '#dddad6'
  on-tertiary-container: '#605f5c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#86fc7a'
  primary-fixed-dim: '#6adf61'
  on-primary-fixed: '#002202'
  on-primary-fixed-variant: '#005309'
  secondary-fixed: '#bbf0bd'
  secondary-fixed-dim: '#a0d3a2'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#22502b'
  tertiary-fixed: '#e5e2de'
  tertiary-fixed-dim: '#c8c6c2'
  on-tertiary-fixed: '#1c1c19'
  on-tertiary-fixed-variant: '#474744'
  background: '#111417'
  on-background: '#e1e2e6'
  surface-variant: '#323538'
typography:
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-technical:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-desktop: 64px
  margin-tablet: 32px
  margin-mobile: 16px
  container-max: 1280px
---

## Brand & Style

This design system is engineered for high-stakes industrial sectors, including Nuclear, Power, and Oil & Gas. The brand personality is authoritative, expert, and uncompromisingly precise. It evokes the feeling of a high-tech control room or a sophisticated engineering blueprint.

The visual style is **Minimalist / Corporate Modern**, characterized by:
*   **Precision and Order:** A rigid adherence to grid systems and alignment to convey structural integrity.
*   **Technical Sophistication:** Subtle use of industrial motifs such as coordinate markers, monospaced data callouts, and thin hairline strokes.
*   **High Trust:** Generous whitespace and a restricted color palette that avoids decorative clutter, focusing exclusively on clarity and information density.
*   **Operational Energy:** Utilizing high-visibility accents against deep backgrounds to highlight critical data and call-to-action points.

## Colors

The palette is rooted in a "Dark Mode" default to reduce eye strain in technical environments and provide a high-contrast foundation for data visualization.

*   **Primary (#7EF473):** A high-energy, "Safety Lime" used for primary actions, success states, and critical data points. It serves as the industrial-energy accent.
*   **Secondary (#0E3E1B):** A deep, authoritative forest green used for subtle branding and secondary interactive surfaces.
*   **Neutral & Background (#212427, #121416):** Deep charcoal and obsidian shades form the bedrock of the UI, creating a professional, slate-like aesthetic.
*   **Tertiary (#F1EEEA):** An off-white "Stone" color used exclusively for high-legibility body text and UI borders to maintain a clean, technical feel without the harshness of pure white.

## Typography

The typographic system prioritizes functional clarity and a systematic engineering feel. 

*   **Headlines:** Utilizing **IBM Plex Sans**, a typeface designed specifically to reflect the relationship between man and machine. Bold weights are used for clear hierarchy and authority.
*   **Body Text:** Optimized for long-form technical reports with generous line heights to ensure legibility in high-stress environments.
*   **Technical Labels:** **JetBrains Mono** is introduced for data readouts, coordinates, and status codes. This monospaced font provides the "technical" aesthetic necessary for industrial credibility.
*   **Scaling:** Headlines scale down aggressively for mobile devices to maintain a compact, "instrument panel" density.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop to maintain a controlled, professional structure, transitioning to a fluid model for tablet and mobile.

*   **Grid:** A 12-column grid system is used for desktop (1280px max-width). Components should align to these columns to create a sense of architectural stability.
*   **Rhythm:** An 8px base unit governs all padding and margins. Larger gaps (64px+) are used between major sections to prevent information overload.
*   **Technical Motifs:** Use "Blueprint Lines" (1px borders in #212427) to separate content sections, mimicking technical drawings.

## Elevation & Depth

This design system rejects heavy shadows in favor of **Tonal Layering** and **Low-Contrast Outlines**.

*   **Tonal Layers:** Depth is created by placing lighter charcoal surfaces (#212427) on top of the darker background (#121416).
*   **Ghost Borders:** High-level containers use a subtle 1px border (#212427 or #F1EEEA at 10% opacity) rather than a shadow to define their boundaries.
*   **Interactive Elevation:** Hover states are indicated by a change in border color (shifting to #7EF473) or a slight increase in surface luminosity, rather than physical lifting. This maintains the flat, "technical display" aesthetic.

## Shapes

The shape language is primarily **Sharp**, reflecting industrial precision. 

*   **Standard Radius:** A minimal "Soft" radius (0.25rem) is used for buttons and input fields to provide a modern finish while retaining a rigid, professional silhouette.
*   **Data Containers:** Large cards and dashboard modules should use 0px (Sharp) corners to maximize screen real estate and mimic modular hardware.
*   **Icons:** Use stroke-based icons with square terminals and consistent 2px line weights.

## Components

*   **Buttons:** High-contrast blocks. Primary buttons use #7EF473 with black text for maximum visibility. Secondary buttons are outlined in #F1EEEA.
*   **Technical Chips:** Use monospaced font (JetBrains Mono) and sharp corners. Use color coding sparingly for status (Green for Active, Gray for Standby).
*   **Input Fields:** Dark backgrounds (#121416) with subtle Stone (#F1EEEA) borders. Focus states use a sharp #7EF473 glow.
*   **Cards:** Minimalist with no background fill (outlined) or a subtle charcoal fill. Headlines within cards should always be uppercase to signify "Readout" titles.
*   **Data Grids:** High-density tables with hairline dividers. Use alternating row stripes (zebra striping) only if data exceeds 10 rows.
*   **Industrial Callouts:** Small technical labels (e.g., "LOC: 42.0 // SYS: PWR") should be placed in the top corners of cards to reinforce the expert tone.