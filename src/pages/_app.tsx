import "@/styles/globals.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: any) {
  const [queryClient] = useState(() => new QueryClient());

  const theme = extendTheme({
    components: {
      Input: {
        defaultProps: {
          size: "sm",
        },
      },
      Button: {
        defaultProps: {
          size: "sm",
          variant: "solid",
        },
        variants: {
          solid() {
            return {
              _hover: {
                bg: `brand.400`,
              },
              bg: `brand.500`,
              color: "white",
            };
          },
          danger() {
            return {
              _hover: {
                bg: `danger.controlDangerHover`,
              },
              bg: "danger.controlDanger",
              color: "danger.labelDanger",
            };
          },
          secondary() {
            return {
              _hover: {
                bg: `control.secondary`,
                boxShadow:
                  "0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.15), 0px 3px 1px -2px rgba(0, 0, 0, 0.2), inset 0px 1px 0px rgba(255, 255, 255, 0.05)",
              },
              bg: "control.secondaryLabel",
              color: "control.secondaryLabel",
              boxShadow: "inset 0px 1px 0px rgba(255, 255, 255, 0.05)",
              borderRadius: "sm",
            };
          },
        },
      },
    },
    colors: {
      danger: {
        labelDanger: "#fb7185",
        controlDanger: "rgb(244, 63, 94, 0.1)",
        controlDangerHover: "rgb(242, 85, 108, 0.2)",
      },
      control: {
        secondaryLabel: "#D4D4D8",
        secondary: "#3F3F46",
      },
      black: "#18181B",
      brand: {
        50: "#fff9f2",
        100: "#fedec5",
        200: "#fdbe8a",
        300: "#fca863",
        400: "#fb9d50",
        500: "#fb923c",
        600: "#e28336",
        700: "#c97530",
        800: "#b0662a",
        900: "#975824",
      },
      gray: {
        50: "#fafafa",
        100: "#f4f4f5",
        200: "#e4e4e7",
        300: "#d4d4d8",
        400: "#a1a1aa",
        500: "#71717a",
        600: "#52525b",
        700: "#3f3f46",
        800: "#27272a",
        900: "#18181b",
      },
    },
    fonts: {
      heading: `'Inter', sans-serif`,
      body: `'Inter', sans-serif`,
    },
    initialColorMode: "dark",
    useSystemColorMode: false,
  });

  return (
    <SessionProvider session={session} refetchInterval={0}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
