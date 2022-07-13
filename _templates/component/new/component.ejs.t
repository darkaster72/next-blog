---
to: " /<%= h.path.parse(h.inflection.camelize(name, false)).base %>.tsx"
---
<% formattedPath = h.inflection.camelize(name, true).replace(/::/g, '/') -%>
<% component = h.path.parse(h.inflection.camelize(name, false)).base -%>

// import Link from 'next/link'

interface Props {
  title: string
}

const <%= component %>: React.FC<Props> = (props) => {

  return (
      <main>
      <Heading className="flex justify-center"><%= component %></Heading>
      </main>
  )
}

export default <%= component %>

export type { Props as <%= component %>Props }
