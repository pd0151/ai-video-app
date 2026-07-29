ADFORGE SEO LOCK INSTALLATION

1. Copy app/page.tsx over your existing app/page.tsx file.
2. Create a folder named lib in the project root if it does not exist.
3. Copy lib/seo-locks.ts into that folder.
4. Run: npm run build
5. Deploy when the build passes.

LOCKED HOMEPAGE VALUES

Title tag:
24 Hour Mobile Tyre Fitting & Vehicle Recovery | Liverpool | AdForge

H1:
24 Hour Mobile Tyre Fitting & Vehicle Recovery

Canonical:
https://adforge.uk/

The homepage now imports these values from lib/seo-locks.ts. Redesigning app/page.tsx no longer requires rewriting the title, H1, description or canonical.

IMPORTANT

Do not run bulk database updates that rewrite title_tag, headline or meta_description on existing landing_pages. Improvements should add body content, FAQs, links, schema, images and design without replacing established SEO fields.
