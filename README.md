# GOV.UK Maintenance Page Generator

Generates a single HTML maintenance page with inlined, minified CSS from the official [govuk-frontend](https://github.com/alphagov/govuk-frontend) package.

## Quick Start

```bash
npm install
npm run build
```

Output: `dist/maintenance.html`

## Configuration

Edit `config.json` to customize the page content:

| Field | Description |
|-------|-------------|
| `serviceName` | Service name shown in header and contact section |
| `serviceUrl` | URL linked from the service name |
| `pageTitle` | Browser tab title |
| `heading` | Main heading (e.g., "Sorry, there is a problem with the service") |
| `bodyText` | Array of paragraph strings |
| `contactIntro` | Contact introduction text (supports `{{serviceName}}` placeholder) |
| `phone` | Phone number |
| `openingTimes` | Opening times text |
| `email` | Contact email address |
| `responseTime` | Response time message |

## Updating Styles

When GOV.UK Frontend releases a new version:

```bash
npm update govuk-frontend
npm run build
```

## Project Structure

```
├── build.js        # Build script (compiles SCSS, minifies, renders template)
├── config.json     # Configurable content
├── package.json    # Dependencies
├── src/
│   ├── styles.scss    # Imports govuk-frontend styles
│   └── template.njk   # HTML template (Nunjucks)
└── dist/
    └── maintenance.html   # Generated output
```

## Dependencies

- `govuk-frontend` - Official GOV.UK styles (v5.13.0+, includes rebrand)
- `sass` - SCSS compiler
- `clean-css` - CSS minifier
- `nunjucks` - Template engine

## Notes

- The generated page uses the GOV.UK rebrand styles (`govuk-template--rebranded`)
- Fonts reference `/assets/fonts/` which won't load standalone; falls back to Arial
- The `noindex, nofollow` meta tag prevents search engine indexing
