import Section from './Section'
import Timeline from './Timeline'
import { education } from '../data/profile'

const items = education.map((e) => ({
  heading: `${e.degree} in ${e.field}`,
  org: e.school,
  sub: e.place,
  period: e.years,
  current: e.current,
  meta: e.grade ? `Grade ${e.grade}` : null,
}))

export default function Education() {
  return (
    <Section id="education" title="Education" icon="cap">
      <Timeline items={items} />
    </Section>
  )
}
