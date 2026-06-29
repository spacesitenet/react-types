# Material UI Colors Reference

Use these in `sx`, `styled`, or theme-aware component props. The order below starts with the colors you will usually use most often.

## Most Useful Palette Values

| Use | Color Token | Example |
| --- | --- | --- |
| Main brand color | `primary.main` | `sx={{ color: "primary.main" }}` |
| Darker brand color | `primary.dark` | `sx={{ bgcolor: "primary.dark" }}` |
| Lighter brand color | `primary.light` | `sx={{ borderColor: "primary.light" }}` |
| Text on primary background | `primary.contrastText` | `sx={{ color: "primary.contrastText", bgcolor: "primary.main" }}` |
| Page background | `background.default` | `sx={{ bgcolor: "background.default" }}` |
| Card or paper background | `background.paper` | `sx={{ bgcolor: "background.paper" }}` |
| Main text | `text.primary` | `sx={{ color: "text.primary" }}` |
| Muted text | `text.secondary` | `sx={{ color: "text.secondary" }}` |
| Disabled text | `text.disabled` | `sx={{ color: "text.disabled" }}` |
| Divider or border | `divider` | `sx={{ borderColor: "divider" }}` |

## Common Status Colors

| Use | Color Token | Example |
| --- | --- | --- |
| Success state | `success.main` | `sx={{ color: "success.main" }}` |
| Success background | `success.light` | `sx={{ bgcolor: "success.light" }}` |
| Dark success accent | `success.dark` | `sx={{ borderColor: "success.dark" }}` |
| Text on success background | `success.contrastText` | `sx={{ color: "success.contrastText", bgcolor: "success.main" }}` |
| Error state | `error.main` | `sx={{ color: "error.main" }}` |
| Error background | `error.light` | `sx={{ bgcolor: "error.light" }}` |
| Dark error accent | `error.dark` | `sx={{ borderColor: "error.dark" }}` |
| Text on error background | `error.contrastText` | `sx={{ color: "error.contrastText", bgcolor: "error.main" }}` |
| Warning state | `warning.main` | `sx={{ color: "warning.main" }}` |
| Warning background | `warning.light` | `sx={{ bgcolor: "warning.light" }}` |
| Dark warning accent | `warning.dark` | `sx={{ borderColor: "warning.dark" }}` |
| Text on warning background | `warning.contrastText` | `sx={{ color: "warning.contrastText", bgcolor: "warning.main" }}` |
| Info state | `info.main` | `sx={{ color: "info.main" }}` |
| Info background | `info.light` | `sx={{ bgcolor: "info.light" }}` |
| Dark info accent | `info.dark` | `sx={{ borderColor: "info.dark" }}` |
| Text on info background | `info.contrastText` | `sx={{ color: "info.contrastText", bgcolor: "info.main" }}` |

## Secondary And Action Colors

| Use | Color Token | Example |
| --- | --- | --- |
| Secondary brand color | `secondary.main` | `sx={{ color: "secondary.main" }}` |
| Darker secondary color | `secondary.dark` | `sx={{ bgcolor: "secondary.dark" }}` |
| Lighter secondary color | `secondary.light` | `sx={{ borderColor: "secondary.light" }}` |
| Text on secondary background | `secondary.contrastText` | `sx={{ color: "secondary.contrastText", bgcolor: "secondary.main" }}` |
| Active icon or control | `action.active` | `sx={{ color: "action.active" }}` |
| Hover background | `action.hover` | `sx={{ bgcolor: "action.hover" }}` |
| Selected background | `action.selected` | `sx={{ bgcolor: "action.selected" }}` |
| Disabled control | `action.disabled` | `sx={{ color: "action.disabled" }}` |
| Disabled background | `action.disabledBackground` | `sx={{ bgcolor: "action.disabledBackground" }}` |
| Focus overlay | `action.focus` | `sx={{ bgcolor: "action.focus" }}` |

## Less Common Greys

| Use | Color Token | Example |
| --- | --- | --- |
| Near white | `grey.50` | `sx={{ bgcolor: "grey.50" }}` |
| Very light grey | `grey.100` | `sx={{ bgcolor: "grey.100" }}` |
| Light grey | `grey.200` | `sx={{ borderColor: "grey.200" }}` |
| Medium light grey | `grey.300` | `sx={{ borderColor: "grey.300" }}` |
| Medium grey | `grey.400` | `sx={{ color: "grey.400" }}` |
| Balanced grey | `grey.500` | `sx={{ color: "grey.500" }}` |
| Medium dark grey | `grey.600` | `sx={{ color: "grey.600" }}` |
| Dark grey | `grey.700` | `sx={{ bgcolor: "grey.700" }}` |
| Very dark grey | `grey.800` | `sx={{ bgcolor: "grey.800" }}` |
| Near black | `grey.900` | `sx={{ bgcolor: "grey.900" }}` |

## Quick Patterns

| Goal | Example |
| --- | --- |
| Text color | `sx={{ color: "text.primary" }}` |
| Background color | `sx={{ bgcolor: "background.paper" }}` |
| Border color | `sx={{ border: 1, borderColor: "divider" }}` |
| Primary button-like block | `sx={{ color: "primary.contrastText", bgcolor: "primary.main" }}` |
| Hover color | `sx={{ "&:hover": { bgcolor: "action.hover" } }}` |
| Error message | `sx={{ color: "error.main" }}` |

## Rule Of Thumb

Use `primary.*` for the main app color, `background.*` for layouts and cards, `text.*` for readable text, `divider` for borders, and `success/error/warning/info.*` for user feedback states.
