import type { NextPage, GetServerSideProps } from "next";
import {
  Text,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Badge,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { HOME_TEXT } from "i18n/home";
import { SUBSCRIPTION_PRICE } from "helpers/const";
import { baseUrl } from "helpers/baseUrl";

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${baseUrl}/api/users`);
  const data: UserSchema[] = (await res.json()).data ?? [];

  return {
    props: {
      users: data,
    },
  };
};

const Home: NextPage<{ users: UserSchema[] }> = ({ users }) => {
  const { locale } = useRouter();

  return (
    <Container maxW="container.lg">
      <Text
        fontWeight="bold"
        fontSize={{ base: "3xl", md: "4xl", lg: "6xl" }}
        mb={{ base: "4", lg: "8" }}
        lineHeight="1.2"
      >
        {HOME_TEXT.get("title", locale)}
      </Text>
      <Table variant="simple">
        <TableCaption>
          Current Spotify package is{" "}
          {new Intl.NumberFormat("id-ID").format(SUBSCRIPTION_PRICE)} IDR /
          month.
        </TableCaption>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th isNumeric>Remaining Balance (IDR)</Th>
            <Th isNumeric>Enough For (Times)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map(({ id, balance, name }) => {
            const formattedBalance = new Intl.NumberFormat("id-ID").format(
              balance
            );
            let enoughFor = Math.floor(balance / SUBSCRIPTION_PRICE).toFixed(0);

            return (
              <Tr key={`user-${id}`}>
                <Td>{name}</Td>
                <Td isNumeric>{formattedBalance}</Td>
                <Td isNumeric>
                  {balance < 0 ? (
                    <Badge colorScheme="red">Need Payment</Badge>
                  ) : (
                    enoughFor
                  )}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Container>
  );
};

export default Home;
