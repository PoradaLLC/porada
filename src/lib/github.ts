const GITHUB_API = "https://api.github.com";

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_DEMO_OWNER;
  const repo = process.env.GITHUB_DEMO_REPO;

  if (!token) throw new Error("GITHUB_TOKEN not configured");
  if (!owner) throw new Error("GITHUB_DEMO_OWNER not configured");
  if (!repo) throw new Error("GITHUB_DEMO_REPO not configured");

  return { token, owner, repo };
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

/**
 * Push a single file to a GitHub repository.
 * Handles both create and update (fetches existing SHA if the file already exists).
 */
async function pushFileToRepo(
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  token: string
) {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;

  // Check if file already exists to get its SHA (needed for updates)
  let sha: string | undefined;
  const existing = await fetch(url, { headers: headers(token) });
  if (existing.ok) {
    const data = await existing.json();
    sha = data.sha;
  }

  const body: Record<string, string> = {
    message,
    content: Buffer.from(content).toString("base64"),
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub API error (${res.status}) for ${path}: ${err}`);
  }

  return res.json();
}

/**
 * Push a complete demo site (HTML, CSS, JS) to a subfolder in the demo repo.
 * Returns the GitHub Pages URL for the site.
 */
export async function pushDemoSite(
  slug: string,
  files: { path: string; content: string }[]
) {
  const { token, owner, repo } = getConfig();

  for (const file of files) {
    await pushFileToRepo(
      owner,
      repo,
      `${slug}/${file.path}`,
      file.content,
      `Add demo site for ${slug}`,
      token
    );
  }

  return `https://${owner}.github.io/${repo}/${slug}/`;
}
