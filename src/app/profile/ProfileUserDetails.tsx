interface Props {
  name: string;
  email: string;
  image: string;
}

export default async function UserDetails({ name, email, image }: Props) {
  return (
    <>
      {name} <br />
      {email} <br />
      {image} <br />
    </>
  );
}
