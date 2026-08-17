import Section from './Section'
import Timeline from './Timeline'
import { experience } from '../data/profile'

const items = experience.map((e) => ({
  heading: e.role,
  org: e.org,
  sub: e.sub,
  period: `${e.start} – ${e.end}`,
  current: e.current,
}))

export default function Experience() {
  return (
    <Section id="experience" title="Experience" icon="briefcase">
      <Timeline items={items} />
    </Section>
  )
}
