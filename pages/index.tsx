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
import { supabase } from "libs/supabase";
import Head from "next/head";

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await supabase
    .from<UserSchema>("users")
    .select()
    .eq("is_active", true);

  return {
    props: {
      users: data,
    },
  };
};

const Home: NextPage<{ users: UserSchema[] }> = ({ users }) => {
  const { locale } = useRouter();

  return (
    <>
      <Head>
        <title>Spotify AH Billing</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
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
              <Th>{HOME_TEXT.get("table.name", locale)}</Th>
              <Th isNumeric>{HOME_TEXT.get("table.balance", locale)}</Th>
              <Th isNumeric>{HOME_TEXT.get("table.enoughFor", locale)}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map(({ id, balance, name }) => {
              const formattedBalance = new Intl.NumberFormat("id-ID").format(
                balance
              );
              let enoughFor = Math.floor(balance / SUBSCRIPTION_PRICE).toFixed(
                0
              );

              return (
                <Tr key={`user-${id}`}>
                  <Td>{name}</Td>
                  <Td isNumeric>{formattedBalance}</Td>
                  <Td isNumeric>
                    {balance < SUBSCRIPTION_PRICE ? (
                      <Badge colorScheme="red">Topup Needed</Badge>
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
    </>
  );
};

export default Home;
