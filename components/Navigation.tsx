import { Button, Container, Select, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

const Navigation: React.FC<{}> = () => {
  const { push, pathname, locale } = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Container
      display="flex"
      as="nav"
      height="20"
      alignItems="center"
      justifyContent="flex-end"
      maxW="container.lg"
      gridGap="2"
    >
      <Select
        value={locale}
        onChange={(e) => {
          push(pathname, pathname, { locale: e.target.value });
        }}
        maxW="100px"
      >
        <option value="id">ID</option>
        <option value="en">EN</option>
      </Select>
      <Button onClick={toggleColorMode} variant="outline" w="10" px="0">
        {colorMode === "light" ? (
          <MoonIcon color="blackAlpha.600" />
        ) : (
          <SunIcon />
        )}
      </Button>
    </Container>
  );
};

export default Navigation;
