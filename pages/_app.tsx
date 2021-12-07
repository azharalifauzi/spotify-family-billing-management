import { ChakraProvider } from "@chakra-ui/react";
import Navigation from "../components/Navigation";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { extendTheme, ChakraTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Navigation />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
