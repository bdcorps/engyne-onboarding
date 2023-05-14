import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Circle,
  HStack,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { FunctionComponent } from "react";

interface LayoutProps {
  children: React.ReactNode;
  toolbar?: React.ReactNode;
  title?: string;
  showDrawer?: boolean;
  showHeader?: boolean;
}

const Layout: FunctionComponent<LayoutProps> = (props: LayoutProps) => {
  return (
    <Box
      backgroundColor="white"
      h="100vh"
      w="full"
      overflow="hidden"
      position="relative"
      id="layout"
    >
      <Header />
      <Box position="absolute" w="full" h="full">
        {props.children}
      </Box>
    </Box>
  );
};

interface HeaderProps {}

const Header: FunctionComponent<HeaderProps> = () => {
  let { data: session, status }: any = useSession();
  const router = useRouter();

  return (
    <Box
      w="full"
      borderBottom="1px"
      borderColor="gray.200"
      px={[4, null, 10]}
      backgroundColor="white"
      h="56px"
      position="sticky"
    >
      {/* <Container maxW="container.xl"> */}
      <HStack
        w="full"
        spacing={4}
        justify="space-between"
        // px={4}
        py={2}
      >
        <HStack spacing={4}>
          <Image
            src="https://launchman.com/new_logo_1.svg"
            alt="Logo"
            w={6}
          ></Image>
          <Link
            fontSize="sm"
            color="black"
            href="/"
            _hover={{ fontWeight: 500 }}
          >
            Dashboard
          </Link>

          {/* <Link
            fontSize="sm"
            color="black"
            href="/"
            _hover={{ fontWeight: 500 }}
          >
            Learn <Badge colorScheme="green">New</Badge>
          </Link> */}
        </HStack>

        <Spacer />

        <HStack spacing={4}>
          <Text fontSize="sm" color="black">
            {session?.user?.email}
          </Text>

          <HStack spacing={1}>
            <Circle size="40px" backgroundColor="brand.100">
              <Image src="/profile.png" alt="Profile Picture"></Image>
            </Circle>

            {session?.user && (
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<ChevronDownIcon />}
                  variant="unstyled"
                />
                <Portal>
                  <MenuList>
                    {/* <MenuItem
                      onClick={() => {
                        window.open(
                          `https://billing.stripe.com/p/login/bIYaGMcFc71I44E8ww?prefilled_email=${session.user.email}`
                        );
                      }}
                    >
                      Manage Billing
                    </MenuItem> */}
                    <MenuItem
                      onClick={() => {
                        signOut({ callbackUrl: "/login" });
                      }}
                    >
                      Log out
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            )}
          </HStack>
        </HStack>
      </HStack>
      {/* </Container> */}
    </Box>
  );
};

export default Layout;
