//import { prisma } from '@/lib/prisma';
//
//const generateRandomString = (length: number): string => {
//  const characters =
//    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//  let result = '';
//  const charactersLength = characters.length;
//
//  for (let i = 0; i < length; i++) {
//    result += characters.charAt(Math.floor(Math.random() * charactersLength));
//  }
//
//  return result;
//};

export default async function TempTestPage() {
  //const user = await prisma.user.create({
  //  data: {
  //    name: generateRandomString(6),
  //  },
  //});

  return <h1>whoosh</h1>;
}
