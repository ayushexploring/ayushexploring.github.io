// Describes every editable section. The editor UI is generated from this, so
// adding a field to the site means adding one line here — not a new form.
//
// Field types: text | textarea | number | url | select | boolean | stringList |
//              object (subFields) | objectList (subFields)

const thisYear = new Date().getFullYear()

export const PUB_TYPES = ['Journal', 'Conference', 'Book Chapter']

const ICONS = ['mail', 'scholar', 'github', 'linkedin', 'orcid', 'external']

export const SECTIONS = [
  {
    key: 'publications',
    label: 'Publications',
    hint: 'Everything in the filterable publications grid. Most-cited sorts first on the site, so order here does not matter.',
    kind: 'list',
    itemLabel: (it) => it.title || 'Untitled publication',
    itemMeta: (it) => [it.type, it.year, it.citations ? `${it.citations} cites` : null].filter(Boolean).join(' · '),
    newItem: () => ({
      type: 'Journal',
      year: thisYear,
      title: '',
      authors: ['Verma, A.', 'Khari, M.'],
      venue: '',
      details: '',
      doi: '',
      citations: 0,
      tags: [],
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'textarea', rows: 2, required: true },
      { name: 'type', label: 'Type', type: 'select', options: PUB_TYPES, required: true },
      { name: 'year', label: 'Year', type: 'number', min: 1990, max: thisYear + 5, required: true },
      {
        name: 'authors',
        label: 'Authors',
        type: 'stringList',
        required: true,
        addLabel: 'Add author',
        hint: 'In citation order, e.g. “Verma, A.”. Your own name is bolded automatically on the site.',
      },
      { name: 'venue', label: 'Venue / Journal / Book', type: 'textarea', rows: 2, required: true },
      { name: 'details', label: 'Details', type: 'text', hint: 'e.g. “27(3), 22–29” or “pp. 160–186”' },
      {
        name: 'doi',
        label: 'DOI link',
        type: 'url',
        required: true,
        unique: true,
        hint: 'Full URL, e.g. https://doi.org/10.1109/mim.2024.10505198',
      },
      { name: 'citations', label: 'Citations', type: 'number', min: 0, hint: 'From Google Scholar. Use 0 for a new paper.' },
      { name: 'tags', label: 'Tags', type: 'stringList', addLabel: 'Add tag', hint: 'Short topic labels shown on the card.' },
    ],
  },

  {
    key: 'scholar',
    label: 'Google Scholar',
    hint: 'Citation counts, h-index and i10-index are deliberately not stored here — they would go stale between manual updates. The hero links out to Scholar instead, which Google keeps current.',
    kind: 'object',
    fields: [{ name: 'url', label: 'Scholar profile URL', type: 'url', required: true }],
  },

  {
    key: 'upcoming',
    label: 'Forthcoming',
    hint: 'The “Forthcoming & recently indexed” list under the publications grid — for papers without a DOI yet.',
    kind: 'list',
    itemLabel: (it) => it.title || 'Untitled',
    itemMeta: (it) => String(it.year ?? ''),
    newItem: () => ({ title: '', authors: ['Verma, A.', 'Khari, M.'], venue: '', year: thisYear }),
    fields: [
      { name: 'title', label: 'Title', type: 'textarea', rows: 2, required: true },
      { name: 'authors', label: 'Authors', type: 'stringList', required: true, addLabel: 'Add author' },
      { name: 'venue', label: 'Venue', type: 'textarea', rows: 2, required: true },
      { name: 'year', label: 'Year', type: 'number', min: 1990, max: thisYear + 5, required: true },
    ],
  },

  {
    key: 'honors',
    label: 'Talks & honors',
    kind: 'list',
    itemLabel: (it) => it.title || 'Untitled',
    itemMeta: (it) => [it.kind === 'talk' ? 'Talk' : 'Award', it.when].filter(Boolean).join(' · '),
    newItem: () => ({ title: '', where: '', when: '', note: '', kind: 'award' }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'where', label: 'Organisation / event', type: 'text', required: true },
      { name: 'when', label: 'When', type: 'text', required: true, hint: 'e.g. “2024” or “Jan’22”' },
      { name: 'note', label: 'Note', type: 'textarea', rows: 3 },
      {
        name: 'kind',
        label: 'Kind',
        type: 'select',
        options: ['award', 'talk'],
        optionLabels: { award: 'Award / honour', talk: 'Talk / session' },
        required: true,
        hint: 'Only changes the icon and colour.',
      },
    ],
  },

  {
    key: 'mentorship',
    label: 'Supervision',
    hint: 'Students grouped by level. The site counts them for the “students mentored” metric.',
    kind: 'list',
    itemLabel: (it) => it.level || 'Level',
    itemMeta: (it) => `${it.students?.length ?? 0} students`,
    newItem: () => ({ level: '', students: [] }),
    fields: [
      { name: 'level', label: 'Level', type: 'text', required: true, hint: 'e.g. M.Tech, MCA, B.Tech' },
      {
        name: 'students',
        label: 'Students',
        type: 'objectList',
        addLabel: 'Add student',
        itemLabel: (s) => s.name || 'New student',
        newItem: () => ({ name: '', institute: '', title: '', period: '' }),
        subFields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'institute', label: 'Institute', type: 'text', required: true },
          { name: 'title', label: 'Thesis title', type: 'textarea', rows: 2, hint: 'Leave blank to hide the title on the card.' },
          { name: 'period', label: 'Period', type: 'text', hint: 'e.g. “Dec’22 – Jun’23”' },
        ],
      },
    ],
  },

  {
    key: 'experience',
    label: 'Experience',
    kind: 'list',
    itemLabel: (it) => it.role || 'Role',
    itemMeta: (it) => [it.start, it.end].filter(Boolean).join(' – '),
    newItem: () => ({ role: '', org: '', sub: '', start: '', end: 'Present', current: true }),
    fields: [
      { name: 'role', label: 'Role', type: 'text', required: true },
      { name: 'org', label: 'Organisation', type: 'text', required: true },
      { name: 'sub', label: 'Parent body / department', type: 'textarea', rows: 2 },
      { name: 'start', label: 'Start', type: 'text', required: true, hint: 'e.g. “May’24”' },
      { name: 'end', label: 'End', type: 'text', required: true, hint: 'e.g. “Sept’22” or “Present”' },
      { name: 'current', label: 'Current role', type: 'boolean', hint: 'Highlights the entry in accent colour.' },
    ],
  },

  {
    key: 'education',
    label: 'Education',
    kind: 'list',
    itemLabel: (it) => [it.degree, it.field].filter(Boolean).join(' — ') || 'Degree',
    itemMeta: (it) => it.years ?? '',
    newItem: () => ({ degree: '', field: '', school: '', place: '', years: '', grade: '', current: false }),
    fields: [
      { name: 'degree', label: 'Degree', type: 'text', required: true, hint: 'e.g. Ph.D., M.Tech' },
      { name: 'field', label: 'Field', type: 'text', required: true },
      { name: 'school', label: 'Institution', type: 'text', required: true },
      { name: 'place', label: 'Location', type: 'text' },
      { name: 'years', label: 'Years', type: 'text', required: true, hint: 'e.g. “2023 – Present”' },
      { name: 'grade', label: 'Grade', type: 'text', hint: 'e.g. “8.66 / 10”. Leave blank to hide.' },
      { name: 'current', label: 'Ongoing', type: 'boolean' },
    ],
  },

  {
    key: 'teaching',
    label: 'Teaching',
    kind: 'list',
    itemLabel: (it) => it.role || 'Role',
    itemMeta: (it) => it.org ?? '',
    newItem: () => ({ role: '', org: '', note: '' }),
    fields: [
      { name: 'role', label: 'Role', type: 'text', required: true },
      { name: 'org', label: 'Institution', type: 'text', required: true },
      { name: 'note', label: 'Note', type: 'textarea', rows: 2 },
    ],
  },

  {
    key: 'profile',
    label: 'About & identity',
    hint: 'Name, roles and the About section.',
    kind: 'object',
    fields: [
      { name: 'name', label: 'Full name', type: 'text', required: true },
      { name: 'initials', label: 'Initials', type: 'text', required: true, hint: 'Shown in the nav badge.' },
      { name: 'role', label: 'Primary role', type: 'text', required: true },
      { name: 'org', label: 'Organisation', type: 'text', required: true },
      { name: 'orgParent', label: 'Parent body', type: 'textarea', rows: 2 },
      { name: 'secondRole', label: 'Secondary role', type: 'text' },
      { name: 'secondOrg', label: 'Secondary organisation', type: 'textarea', rows: 2 },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'tagline', label: 'Tagline', type: 'text', hint: 'Shown in the hero and footer.' },
      {
        name: 'about',
        label: 'About paragraphs',
        type: 'stringList',
        multiline: true,
        addLabel: 'Add paragraph',
        required: true,
      },
      { name: 'interests', label: 'Research interests', type: 'stringList', addLabel: 'Add interest', required: true },
      {
        name: 'advisor',
        label: 'Advisor',
        type: 'object',
        subFields: [
          { name: 'name', label: 'Name', type: 'text' },
          { name: 'url', label: 'Profile URL', type: 'url' },
        ],
      },
      {
        name: 'department',
        label: 'Department',
        type: 'object',
        subFields: [
          { name: 'name', label: 'Short name', type: 'text' },
          { name: 'url', label: 'URL', type: 'url' },
        ],
      },
    ],
  },

  {
    key: 'contacts',
    label: 'Contact links',
    hint: 'Drives the contact cards, the hero icon row and the footer icons.',
    kind: 'list',
    itemLabel: (it) => it.label || 'Link',
    itemMeta: (it) => it.value ?? '',
    newItem: () => ({ label: '', value: '', href: '', icon: 'external' }),
    fields: [
      { name: 'label', label: 'Label', type: 'text', required: true },
      { name: 'value', label: 'Display value', type: 'text', required: true },
      { name: 'href', label: 'Link', type: 'text', required: true, hint: 'Full URL, or mailto:you@example.com' },
      { name: 'icon', label: 'Icon', type: 'select', options: ICONS, required: true },
    ],
  },

  {
    key: 'sections',
    label: 'Navigation',
    hint: 'Nav items, in order. The id must match a section on the page — changing it breaks the link.',
    kind: 'list',
    itemLabel: (it) => it.label || 'Item',
    itemMeta: (it) => `#${it.id}`,
    newItem: () => ({ id: '', label: '' }),
    fields: [
      { name: 'id', label: 'Section id', type: 'text', required: true },
      { name: 'label', label: 'Nav label', type: 'text', required: true },
    ],
  },
]

export const SECTION_BY_KEY = Object.fromEntries(SECTIONS.map((s) => [s.key, s]))

function fieldIssues(field, value, path) {
  const issues = []
  const empty =
    value === undefined ||
    value === null ||
    (typeof value === 'string' && !value.trim()) ||
    (Array.isArray(value) && value.filter((v) => String(v ?? '').trim()).length === 0)

  if (field.required && empty) {
    issues.push({ path, message: `${field.label} is required` })
    return issues
  }
  if (empty) return issues

  if (field.type === 'number') {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      issues.push({ path, message: `${field.label} must be a number` })
    } else {
      if (field.min !== undefined && value < field.min)
        issues.push({ path, message: `${field.label} must be at least ${field.min}` })
      if (field.max !== undefined && value > field.max)
        issues.push({ path, message: `${field.label} must be at most ${field.max}` })
    }
  }

  if (field.type === 'url' && !/^https?:\/\/\S+$/i.test(String(value).trim())) {
    issues.push({ path, message: `${field.label} must be a full URL starting with http:// or https://` })
  }

  if (field.type === 'select' && field.options && !field.options.includes(value)) {
    issues.push({ path, message: `${field.label} must be one of: ${field.options.join(', ')}` })
  }

  return issues
}

/** Returns [] when the content is publishable. */
export function validate(content) {
  const issues = []

  for (const section of SECTIONS) {
    const value = content[section.key]

    if (section.kind === 'object') {
      for (const field of section.fields) {
        if (field.type === 'object') continue
        issues.push(...fieldIssues(field, value?.[field.name], `${section.label} → ${field.label}`))
      }
      continue
    }

    if (!Array.isArray(value)) {
      issues.push({ path: section.label, message: `${section.label} must be a list` })
      continue
    }

    value.forEach((item, i) => {
      const where = `${section.label} #${i + 1}`
      for (const field of section.fields) {
        if (field.type === 'objectList') {
          const rows = item?.[field.name] ?? []
          rows.forEach((row, j) => {
            for (const sub of field.subFields) {
              issues.push(...fieldIssues(sub, row?.[sub.name], `${where} → ${field.label} #${j + 1} → ${sub.label}`))
            }
          })
          continue
        }
        issues.push(...fieldIssues(field, item?.[field.name], `${where} → ${field.label}`))
      }
    })

    // Fields flagged `unique` must not repeat — doi doubles as the React key.
    for (const field of section.fields.filter((f) => f.unique)) {
      const seen = new Map()
      value.forEach((item, i) => {
        const v = String(item?.[field.name] ?? '').trim().toLowerCase()
        if (!v) return
        if (seen.has(v)) {
          issues.push({
            path: `${section.label} #${i + 1} → ${field.label}`,
            message: `Duplicate ${field.label} — already used by #${seen.get(v) + 1}`,
          })
        } else {
          seen.set(v, i)
        }
      })
    }
  }

  return issues
}
