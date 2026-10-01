import { team, collaborators } from '../data/team';

export interface ResolvedMember {
  name: string;
  href: string | null;
  external: boolean;
}

// Each frontmatter `members` entry is either a team slug (-> their /author/
// page), a collaborator slug, or an inline { name, url? } for an external
// person with no CCAIS page. Unknown slugs are dropped.
export function resolveMembers(list: (string | { name: string; url?: string })[] = []): ResolvedMember[] {
  return list
    .map((m) => {
      if (typeof m === 'string') {
        const t = team.find((x) => x.slug === m);
        if (t) return { name: t.name, href: `/author/${t.slug}/`, external: false };
        const c = collaborators.find((x) => x.slug === m);
        if (c) return { name: c.name, href: c.url ?? null, external: true };
        return null;
      }
      return { name: m.name, href: m.url ?? null, external: true };
    })
    .filter((m): m is ResolvedMember => m !== null);
}
