// Daily cron: dumps the registrations table as JSON into R2 under
// backups/YYYY-MM-DD.json. Private to the R2 bucket — not accessible via the site.
interface Env {
  DB: { prepare(q: string): { all(): Promise<{ results: unknown[] }> } };
  BACKUPS: { put(key: string, value: string): Promise<unknown> };
}

export default {
  async scheduled(_event: unknown, env: Env): Promise<void> {
    const { results } = await env.DB.prepare('SELECT * FROM registrations').all();
    const key = `backups/registrations-${new Date().toISOString().slice(0, 10)}.json`;
    await env.BACKUPS.put(key, JSON.stringify(results, null, 2));
    console.log(`Backup written: ${key} (${results.length} rows)`);
  },
};
