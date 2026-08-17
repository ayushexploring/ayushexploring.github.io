// All site content lives in content.json — edit it through the admin page
// (/admin.html) or by hand. This module just re-exports it as named bindings so
// components can keep importing `{ publications }` etc.
//
// Vite inlines the JSON at build time, so there is no runtime fetch.
import content from './content.json'

export const {
  profile,
  contacts,
  scholar,
  experience,
  education,
  publications,
  upcoming,
  honors,
  teaching,
  mentorship,
  sections,
} = content

export default content
