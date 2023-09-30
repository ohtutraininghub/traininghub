import { Fragment } from 'react';

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
        <Fragment key={`${item.header}-${index}`}>
          <li>
            <h1>{item.header}</h1>
            <p>{item.description}</p>
          </li>
          <br />
        </Fragment>
      ))}
    </ul>
  );
}
