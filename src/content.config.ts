import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const base = z.object({
  title: z.string(),
  date: z.coerce.date(),
  image: z.string().optional(),
  // Optional credit for the header image, shown small at the foot of the page;
  // imageCreditUrl (e.g. the photographer's profile) turns the credit into a link.
  imageCredit: z.string().optional(),
  imageCreditUrl: z.string().optional(),
  excerpt: z.string().optional(),
  // Team slug (see src/data/team.ts). Adds a byline on the article and lists
  // the piece on the author's /author/<slug>/ page automatically.
  author: z.string().optional(),
  // Team members involved. Each entry is either a slug from src/data/team.ts
  // (links to that person's /author/<slug>/ page and lists the piece there), or
  // an inline { name, url? } for an external collaborator who has no CCAIS page.
  members: z.array(z.union([z.string(), z.object({ name: z.string(), url: z.string().optional() })])).optional()
});

const mk = (dir: string, schema = base) =>
  defineCollection({ loader: glob({ pattern: '**/*.md', base: `./src/content/${dir}` }), schema });

export const collections = {
  projects: mk('projects'),
  news: mk('news'),
  blog: mk('blog'),
  // Events carry extra structured-data fields for Google Event rich results:
  // - location:      physical venue name (emitted as a schema.org Place)
  // - locationUrl:   joining link for an online event (a VirtualLocation instead)
  //                  Omit both and the event falls back to University of Southampton.
  // - eventEndDate:  end date/time for multi-day events (emitted as endDate)
  // - eventStatus:   scheduled (default) | cancelled | postponed | rescheduled | moved-online
  // - performers:    named speakers/performers
  events: mk(
    'events',
    base.extend({
      eventDate: z.coerce.date(),
      eventEndDate: z.coerce.date().optional(),
      location: z.string().optional(),
      locationUrl: z.string().optional(),
      eventStatus: z
        .enum(['scheduled', 'cancelled', 'postponed', 'rescheduled', 'moved-online'])
        .optional(),
      performers: z
        .array(z.union([z.string(), z.object({ name: z.string(), affiliation: z.string().optional() })]))
        .optional()
    })
  ),
  impacts: mk('impacts'),
  'open-source': mk('open-source')
};
