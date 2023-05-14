import Layout from "@/components/Layout";
import { Button, Center, Link, Text, VStack } from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { FunctionComponent } from "react";

interface IndexProps {}

const Index: FunctionComponent<IndexProps> = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <Center h="100vh" alignItems="center" justifyItems="center">
        <VStack w="full">
          <Text>Engyne</Text>
          <Text fontWeight={600} fontSize="lg">
            Hi {session.user!.name}!
          </Text>
          <Link href="/onboarding">Start Creating →</Link>
          <Button onClick={() => signOut()} variant="ghost">
            Sign out
          </Button>
        </VStack>
      </Center>
    );
  }
  return (
    <>
      <Layout>
        <Center h="100vh" alignItems="center" justifyItems="center">
          <VStack w="full" align="center">
            <Text>Not signed in</Text>
            <Button
              colorScheme="brand"
              onClick={(e) => {
                e.preventDefault();
                signIn("google", {
                  callbackUrl: `/onboarding`,
                });
              }}
            >
              Sign in with Google
            </Button>
          </VStack>
        </Center>
      </Layout>
    </>
  );
};

export default Index;
