import BlogDrawer from "@/components/BlogDrawer";
import Layout from "@/components/Layout";
import { useSite } from "@/hooks/api";
import {
  Button,
  Container,
  HStack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FunctionComponent, useCallback, useState } from "react";

interface SiteProps {}

interface Idea {
  id: number;
  title: string;
  content: string;
}

const Site: FunctionComponent<SiteProps> = () => {
  const router = useRouter();
  const subdomain: string = router.query.subdomain as string;
  const { data: site, isLoading: isSiteLoading } = useSite(subdomain);

  const [ideas, setIdeas] = useState<Idea[]>([
    { id: 1, title: "How to exit a startup?", content: "" },
  ]);

  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateIdeas = async () => {
    if (!site) return;
    setLoading(true);
    fetch("/api/ideas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product: site.product,
        targetAudience: site.targetAudience,
        prompt:
          "generate a list of listicle ideas for the target market " +
          site.targetAudience,
      }),
    })
      .then((response) => response.json())
      .then(({ data }: any) => {
        const ideasData: Idea[] = data.map((idea: any, index: number) => {
          return {
            id: index,
            title: idea,
            content: "",
          };
        });

        setIdeas(ideasData);
        setLoading(false);

        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  if (!site) {
    return <Text>Loading...</Text>;
  }

  // console.log(site);

  return (
    <Layout>
      <Container maxW="container.lg" pt={4}>
        <VStack w="full" align="flex-start">
          <Text fontWeight={600} fontSize="2xl">
            Your content & stats
          </Text>

          <HStack w="full" justify="space-between" pt={6}>
            <Text fontWeight={600} fontSize="lg">
              Your content
            </Text>

            <HStack>
              <Button
                onClick={handleGenerateIdeas}
                rounded="full"
                isLoading={loading}
              >
                Generate Ideas
              </Button>
              {/* <Button
                onClick={handleGenerateIdeas}
                variant="ghost"
                colorScheme="brand"
              >
                Start writing
              </Button> */}
            </HStack>
          </HStack>

          {ideas.length > 0 && (
            <VStack
              w="full"
              spacing={0}
              divider={<StackDivider borderColor="gray.200" />}
            >
              {ideas.map((item, index) => (
                <BlogTopic key={index} title={item.title} />
              ))}
            </VStack>
          )}
        </VStack>
      </Container>
    </Layout>
  );
};

interface BlogTopicProps {
  title: string;
}

const BlogTopic: FunctionComponent<BlogTopicProps> = ({
  title,
}: BlogTopicProps) => {
  const [content, setContent] = useState("");
  const [isWriting, setIsWriting] = useState<boolean>(false);

  const handleGenerateBlog = useCallback(() => {
    setIsWriting(true);

    setContent("");

    const aiStream = new EventSource(
      `/api/generate-old?title=${encodeURIComponent(title)}`
    );

    aiStream.addEventListener("message", (e) => {
      if (e.data === "[DONE]") {
        aiStream.close();
        setIsWriting(false);
        return;
      }

      const message = JSON.parse(e.data);
      const delta = message.choices[0].delta.content;

      if (delta) {
        setContent((prev: any) => prev + delta);
      }
    });
  }, [setContent, content, title]);

  // async function handleGenerateBlog() {
  //   setIsWriting(true);

  //   console.log("wabout to write");

  //   const response = await fetch("/api/generate-old", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       title,
  //     }),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });

  //   if (!response || !response.body) {
  //     console.log("no body");

  //     return;
  //   }

  //   const reader = response.body.getReader();
  //   const decoder = new TextDecoder();

  //   function onParse(event: any) {
  //     if (event.type === "event") {
  //       try {
  //         console.log("data coming in ");

  //         const data = JSON.parse(event.data);
  //         data.choices
  //           .filter(({ delta }: any) => !!delta.content)
  //           .forEach(({ delta }: any) => {
  //             console.log("writing", delta.content);
  //             setContent((prev: string) => {
  //               return `${prev || ""}${delta.content}`;
  //             });
  //           });
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     }
  //   }

  // const parser = createParser(onParse);

  //   while (true) {
  //     const { value, done } = await reader.read();
  //     const dataString = decoder.decode(value);
  //     if (done || dataString.includes("[DONE]")) break;
  //     parser.feed(dataString);
  //   }

  //   console.log("done writing");

  //   setIsWriting(false);
  // }

  return (
    <HStack
      _hover={{
        backgroundColor: "gray.50",
        cursor: "pointer",
        rounded: "md",
      }}
      w="full"
      p={2}
      justify="space-between"
      align="center"
      onClick={() => {
        handleGenerateBlog();
      }}
    >
      <VStack w="full" align="flex-start" flex={1}>
        <Text fontWeight={500}>{title}</Text>
        <Text noOfLines={2}>{content}</Text>
      </VStack>
      {isWriting ? (
        <Button variant="ghost">Writing...</Button>
      ) : (
        <Button variant="ghost">Write →</Button>
      )}

      {isWriting && (
        <BlogDrawer title={title} content={content} isOpen={true}></BlogDrawer>
      )}
    </HStack>
  );
};

export default Site;
