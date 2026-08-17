// Minimal GitHub Contents API client.
//
// GitHub Pages serves static files only — there is no server to POST to. So the
// admin page commits content.json straight to the repo; the Pages workflow then
// rebuilds and redeploys. api.github.com sends permissive CORS headers, so this
// works entirely from the browser.

const API = 'https://api.github.com'

const headers = (token) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
})

/** UTF-8 safe base64 — btoa alone mangles any non-Latin1 character (– ’ é …). */
export function toBase64(str) {
  const bytes = new TextEncoder().encode(str)
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin)
}

export function fromBase64(b64) {
  const bin = atob(b64.replace(/\s/g, ''))
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

async function request(url, token, init) {
  const res = await fetch(url, { ...init, headers: headers(token) })

  if (!res.ok) {
    let detail = ''
    try {
      detail = (await res.json())?.message ?? ''
    } catch {
      /* response had no JSON body */
    }

    const hint =
      res.status === 401
        ? 'Token is invalid or expired.'
        : res.status === 403
          ? 'Token lacks permission (needs Contents: Read and write on this repo).'
          : res.status === 404
            ? 'Repo, branch or file path not found — also shown when the token cannot see the repo.'
            : res.status === 409
              ? 'The file changed on GitHub since it was loaded. Reload before publishing.'
              : ''

    throw new Error(`GitHub ${res.status}: ${detail || res.statusText}${hint ? ` — ${hint}` : ''}`)
  }

  return res.json()
}

/** Confirms the token can see the repo and reports whether it can write. */
export async function checkAccess({ owner, repo, token }) {
  const data = await request(`${API}/repos/${owner}/${repo}`, token)
  return {
    fullName: data.full_name,
    defaultBranch: data.default_branch,
    canWrite: Boolean(data.permissions?.push),
    private: data.private,
  }
}

/** Reads a file and returns its parsed JSON plus the blob sha needed to update it. */
export async function loadContent({ owner, repo, branch, path, token }) {
  const data = await request(
    `${API}/repos/${owner}/${repo}/contents/${encodeURI(path)}?ref=${encodeURIComponent(branch)}`,
    token,
  )

  const text = fromBase64(data.content)

  let json
  try {
    json = JSON.parse(text)
  } catch (e) {
    throw new Error(`${path} on GitHub is not valid JSON: ${e.message}`)
  }

  return { json, sha: data.sha }
}

/**
 * Commits new file contents. `sha` must be the blob sha from loadContent —
 * GitHub rejects the write if the file moved on in the meantime, which is what
 * stops two tabs from silently overwriting each other.
 */
export async function saveContent({ owner, repo, branch, path, token, json, sha, message }) {
  const body = {
    message,
    content: toBase64(JSON.stringify(json, null, 2) + '\n'),
    branch,
    ...(sha ? { sha } : {}),
  }

  const data = await request(`${API}/repos/${owner}/${repo}/contents/${encodeURI(path)}`, token, {
    method: 'PUT',
    body: JSON.stringify(body),
  })

  return { sha: data.content.sha, commitUrl: data.commit.html_url }
}
