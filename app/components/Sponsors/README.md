# Sponsors Section

## Overview
This component displays the QMIND sponsors/partners organized by tiers (Diamond, Silver, Bronze).

## Adding Sponsor Logos

### Step 1: Add Logo Images
Place your sponsor logo images in the `app/assets/companies/` directory:
- `Smith_Engineering.png` - Smith Engineering Queen's University logo
- `UofT_CS.png` - University of Toronto Computer Science logo
- `COMPSA.png` - COMPSA logo
- `AMS.png` - AMS Queen's University logo

### Step 2: Import the Logos
In `app/page.tsx`, add the imports at the top with the other company imports:

```typescript
import SMITH_ENGINEERING from "@/assets/companies/Smith_Engineering.png";
import UOFT_CS from "@/assets/companies/UofT_CS.png";
import COMPSA from "@/assets/companies/COMPSA.png";
import AMS from "@/assets/companies/AMS.png";
```

### Step 3: Update SPONSOR_TIERS Data
Replace the placeholder images in the `SPONSOR_TIERS` array in `app/page.tsx`:

```typescript
const SPONSOR_TIERS = [
  {
    tier: "DIAMOND TIER",
    sponsors: [
      {
        image: DELOITTE_WHITE,
        alt: "Deloitte",
      },
      {
        image: SMITH_ENGINEERING, // Update this
        alt: "Smith Engineering Queen's University",
      },
    ],
    gradient: "linear-gradient(135deg, #00D4FF 0%, #7B61FF 100%)",
  },
  {
    tier: "SILVER TIER",
    sponsors: [
      {
        image: UOFT_CS, // Update this
        alt: "University of Toronto - Master of Science in Applied Computing",
      },
      {
        image: COMPSA, // Update this
        alt: "COMPSA",
      },
    ],
    gradient: "linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%)",
  },
  {
    tier: "BRONZE TIER",
    sponsors: [
      {
        image: AMS, // Update this
        alt: "AMS Queen's University",
      },
    ],
    gradient: "linear-gradient(135deg, #CD7F32 0%, #E59B5C 100%)",
  },
];
```

## Customization

### Gradients
Each tier has a gradient color. You can customize these:
- **Diamond**: `linear-gradient(135deg, #00D4FF 0%, #7B61FF 100%)`
- **Silver**: `linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%)`
- **Bronze**: `linear-gradient(135deg, #CD7F32 0%, #E59B5C 100%)`

### Adding More Sponsors
To add more sponsors to a tier, simply add another object to the `sponsors` array:

```typescript
{
  tier: "DIAMOND TIER",
  sponsors: [
    { image: SPONSOR1, alt: "Sponsor 1" },
    { image: SPONSOR2, alt: "Sponsor 2" },
    { image: SPONSOR3, alt: "Sponsor 3" }, // New sponsor
  ],
  gradient: "...",
}
```

### Adding New Tiers
To add a new tier (e.g., "PLATINUM TIER"), add a new object to the `SPONSOR_TIERS` array:

```typescript
{
  tier: "PLATINUM TIER",
  sponsors: [
    { image: PLATINUM_SPONSOR, alt: "Platinum Sponsor" },
  ],
  gradient: "linear-gradient(135deg, #E5E4E2 0%, #FFFFFF 100%)",
}
```

## Design Notes
- Sponsor logos are displayed in gradient-bordered cards
- The component is responsive (1 column on mobile, up to 3 columns on desktop)
- Cards have a hover scale effect for interactivity
- The design matches the QMIND brand aesthetic with dark backgrounds and gradient accents
