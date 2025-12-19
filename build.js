const fs = require('fs');
const path = require('path');
const sass = require('sass');
const { PurgeCSS } = require('purgecss');
const CleanCSS = require('clean-css');
const nunjucks = require('nunjucks');

// Paths
const CONFIG_PATH = path.join(__dirname, 'config.json');
const TEMPLATE_PATH = path.join(__dirname, 'src', 'template.njk');
const SCSS_PATH = path.join(__dirname, 'src', 'styles.scss');
const OUTPUT_DIR = path.join(__dirname, 'dist');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'maintenance.html');

async function build() {
  // Load config
  console.log('Loading config...');
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

  // Compile SCSS
  console.log('Compiling SCSS...');
  const sassResult = sass.compile(SCSS_PATH, {
    loadPaths: [path.join(__dirname, 'node_modules')],
    style: 'expanded'
  });
  console.log(`Compiled CSS size: ${(sassResult.css.length / 1024).toFixed(2)} KB`);

  // Purge unused CSS
  console.log('Purging unused CSS...');
  const purgeResult = await new PurgeCSS().purge({
    content: [TEMPLATE_PATH],
    css: [{ raw: sassResult.css }],
    safelist: {
      standard: [/^govuk-width-container/],
      greedy: [/data-/, /js-/]
    }
  });
  const purgedCss = purgeResult[0].css;
  console.log(`Purged CSS size: ${(purgedCss.length / 1024).toFixed(2)} KB`);

  // Minify CSS
  console.log('Minifying CSS...');
  const minifiedCss = new CleanCSS({
    level: 2
  }).minify(purgedCss);

  if (minifiedCss.errors.length > 0) {
    console.error('CSS minification errors:', minifiedCss.errors);
    process.exit(1);
  }

  // Configure Nunjucks
  nunjucks.configure(path.join(__dirname, 'src'), {
    autoescape: true,
    trimBlocks: true,
    lstripBlocks: true
  });

  // Render template
  console.log('Rendering template...');
  const templateData = {
    ...config,
    css: minifiedCss.styles
  };

  const html = nunjucks.render('template.njk', templateData);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write output
  fs.writeFileSync(OUTPUT_PATH, html, 'utf8');

  console.log(`Build complete: ${OUTPUT_PATH}`);
  console.log(`Final CSS size: ${(minifiedCss.styles.length / 1024).toFixed(2)} KB`);
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
