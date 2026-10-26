import type { APIRoute } from 'astro';
import { team, groups } from '../data/team';
import { SITE } from '../lib/seo';

/**
 * Generates /team.json — a machine-readable copy of the team data in
 * src/data/team.ts, for other sites that show CCAIS members (e.g. members'
 * personal websites). Generated at build time, so it stays in sync with the
 * team page automatically. Emails and biographies are deliberately left out.
 *
 * Schema (version 1):
 *   { version, site, generated, groups: string[], members: [
 *       { slug, name, role, group, photo, url, websites: [{ label?, url }] } ] }
 * `photo` and `url` are absolute. `slug` is stable and can be used as a key.
 */
export const prerender = true;

const abs = (p: string) => (/^https?:\/\//.test(p) ? p : SITE + (p.startsWith('/') ? p : '/' + p));

export const GET: APIRoute = () => {
  const body = {
    version: 1,
    site: SITE,
    generated: new Date().toISOString(),
    groups: groups.map((g) => g.heading),
    members: team.map((m) => ({
      slug: m.slug,
      name: m.name,
      role: m.role,
      group: m.group,
      photo: abs(m.photo),
      url: abs(`/author/${m.slug}/`),
      websites: (m.websites ?? []).map((w) => (typeof w === 'string' ? { url: w } : { label: w.label, url: w.url }))
    }))
  };
  return new Response(JSON.stringify(body, null, 2) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
};
