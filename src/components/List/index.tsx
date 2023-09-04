type ListComponentProps = {
  data: ListData[]
}

type ListData = {
  header: string
  description: string
}

export function List({ data }: ListComponentProps) {
  return (
    <ul>
      {data.map((item, index) => (
        <>
          <li key={index}>
            <h1>{item.header}</h1>
            <p>{item.description}</p>
          </li>
          <br />
        </>
      ))}
    </ul>
  )
}
