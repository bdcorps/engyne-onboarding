import Layout from "@/components/Layout";
import { Button, Text } from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { FunctionComponent } from "react";

interface IndexProps {}

const Index: FunctionComponent<IndexProps> = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        Signed in as {session.user!.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      <Layout>
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
      </Layout>
    </>
  );
};

export default Index;
