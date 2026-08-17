import { useState } from 'react'
import { checkAccess } from './github'
import { normaliseRepo } from './repo'

const input =
  'w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 ' +
  'focus:border-accent-500 focus:outline-none dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100'

const TOKEN_URL =
  'https://github.com/settings/personal-access-tokens/new'

export default function Connect({ settings, onSave }) {
  const [form, setForm] = useState(settings)
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value.trim() })

  // Normalise on blur, never on change — rewriting mid-keystroke corrupts the
  // value as it is typed (the "https://" is stripped before the rest arrives).
  const normaliseRepoField = () => {
    const { owner, repo } = normaliseRepo(form.repo, form.owner)
    if (repo !== form.repo || owner !== form.owner) {
      setForm({ ...form, owner: owner || form.owner, repo })
    }
  }

  async function connect(e) {
    e.preventDefault()
    setBusy(true)
    setStatus(null)
    try {
      // Re-normalise here too, in case submit happened without a blur.
      const { owner, repo } = normaliseRepo(form.repo, form.owner)
      const cleaned = { ...form, owner: owner || form.owner, repo }
      setForm(cleaned)

      const info = await checkAccess(cleaned)
      if (!info.canWrite) {
        setStatus({
          ok: false,
          msg: `Connected to ${info.fullName}, but this token cannot write to it. Give it "Contents: Read and write".`,
        })
      } else {
        setStatus({ ok: true, msg: `Connected to ${info.fullName}.` })
        onSave(cleaned)
      }
    } catch (err) {
      // fetch() rejects with a bare "Failed to fetch" for a malformed URL or a
      // dropped connection — neither of which tells you what to change.
      const msg = /failed to fetch|networkerror|load failed/i.test(err.message)
        ? 'Could not reach api.github.com. Check that Repository is just the repo name ' +
          '(e.g. ayushexploring.github.io, not a full URL), and that you are online.'
        : err.message
      setStatus({ ok: false, msg })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-14">
      <h1 className="font-serif text-2xl font-semibold text-ink-900 dark:text-ink-50">Connect to GitHub</h1>
      <p className="mt-3 text-[14px] leading-relaxed text-ink-600 dark:text-ink-300">
        GitHub Pages only serves static files, so this editor saves by committing straight to your repository.
        That needs a personal access token, which is stored in this browser only and sent nowhere except
        <span className="font-medium"> api.github.com</span>.
      </p>

      <ol className="mt-5 space-y-2 rounded-xl border border-ink-200 bg-ink-100/60 p-4 text-[13px] leading-relaxed text-ink-700 dark:border-ink-800 dark:bg-ink-900/50 dark:text-ink-300">
        <li>
          1. Create a{' '}
          <a
            href={TOKEN_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium text-accent-700 underline underline-offset-2 dark:text-accent-300"
          >
            fine-grained token
          </a>
          .
        </li>
        <li>2. Under “Repository access”, pick <em>Only select repositories</em> → this repo.</li>
        <li>3. Under “Permissions → Repository permissions”, set <strong>Contents</strong> to <em>Read and write</em>.</li>
        <li>4. Copy the token and paste it below.</li>
      </ol>

      <form onSubmit={connect} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[12px] font-semibold text-ink-700 dark:text-ink-200">GitHub username</span>
            <input className={`${input} mt-1.5`} value={form.owner} onChange={set('owner')} placeholder="ayushexploring" required />
          </label>
          <label className="block">
            <span className="text-[12px] font-semibold text-ink-700 dark:text-ink-200">Repository</span>
            <input
              className={`${input} mt-1.5`}
              value={form.repo}
              onChange={set('repo')}
              onBlur={normaliseRepoField}
              placeholder="ayushexploring.github.io"
              required
            />
            <span className="mt-1 block text-[11.5px] text-ink-500 dark:text-ink-400">
              Just the name, not the address. Pasting a full GitHub URL also works.
            </span>
          </label>
          <label className="block">
            <span className="text-[12px] font-semibold text-ink-700 dark:text-ink-200">Branch</span>
            <input className={`${input} mt-1.5`} value={form.branch} onChange={set('branch')} placeholder="main" required />
          </label>
          <label className="block">
            <span className="text-[12px] font-semibold text-ink-700 dark:text-ink-200">Content file path</span>
            <input className={`${input} mt-1.5`} value={form.path} onChange={set('path')} required />
          </label>
        </div>

        <label className="block">
          <span className="text-[12px] font-semibold text-ink-700 dark:text-ink-200">Access token</span>
          <input
            type="password"
            className={`${input} mt-1.5`}
            value={form.token}
            onChange={set('token')}
            placeholder="github_pat_…"
            autoComplete="off"
            required
          />
        </label>

        {status && (
          <p
            className={`rounded-lg px-3 py-2.5 text-[13px] ${
              status.ok
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
            }`}
          >
            {status.msg}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-semibold text-ink-50 disabled:opacity-50 dark:bg-ink-50 dark:text-ink-900"
        >
          {busy ? 'Checking…' : 'Connect'}
        </button>
      </form>
    </div>
  )
}
