/**
 * People paste whatever identifies the repo to them — the full URL, owner/repo,
 * or a .git clone address. Reduce all of it to the bare repo name, and pull the
 * owner out too when the pasted value carries one.
 */
export function normaliseRepo(raw, currentOwner) {
  let value = String(raw ?? '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^(www\.)?github\.com\//i, '')
    .replace(/\.git$/i, '')
    .replace(/\/+$/, '')

  let owner = currentOwner
  // "owner/repo" — but not "ayushexploring.github.io" (a bare repo name).
  const slash = value.indexOf('/')
  if (slash > 0) {
    owner = value.slice(0, slash)
    value = value.slice(slash + 1)
  }

  return { owner, repo: value }
}
