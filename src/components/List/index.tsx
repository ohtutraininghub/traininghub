interface ListData {
  header: string;
  description: string;
}

interface ListProps {
  data: ListData[];
}

export function List({ data }: ListProps) {
  return (
    <ul>
      {data.map((item, index) => (
        <>
          <li key={`${item.header}-${index}`}>
            <h1>{item.header}</h1>
            <p>{item.description}</p>
          </li>
          <br />
        </>
      ))}
    </ul>
  );
}
