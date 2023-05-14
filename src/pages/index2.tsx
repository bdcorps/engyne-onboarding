import BlogDrawer from "@/components/BlogDrawer";
import {
  Box,
  Button,
  Container,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { createParser } from "eventsource-parser";
import { useState } from "react";

export default function Home() {
  const [url, setURL] = useState("");
  const [ideas, setIdeas] = useState(["How to exit a startup?"]);
  const [prompt, setPrompt] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");

  const [product, setProduct] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  const [loadingScrape, setLoadingScrape] = useState(false);
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [loadingIngest, setLoadingIngest] = useState(false);
  const [loadingGenerate, setLoadingGenerate] = useState(false);

  // const library = [
  //   {id:"1", text:"pinecones are the woody fruiting body and of a pine tree"}
  // ]

  const library = [
    {
      id: "gen1",
      text: "Don't obsess over finding a unique business idea: While it's important to have a solid business idea, it's not necessary to come up with something completely new or groundbreaking. Many successful startups are built on existing ideas that are executed better or in a different way than competitors. Instead of focusing on finding a unique idea, focus on executing it better than anyone else. Don't waste time on a formal business plan: A formal business plan can be helpful, but it's not essential to building a successful startup. In fact, spending too much time on a business plan can be a waste of time and resources. Instead, focus on creating a simple, flexible plan that can adapt to changes in the market or your business. Don't rely on outside funding: Many startups become overly focused on securing outside funding, such as from venture capitalists or angel investors. However, relying too heavily on outside funding can lead to a lack of focus on revenue and profitability. Instead, focus on building a sustainable business model that generates revenue from the start. Don't prioritize team culture over talent: While team culture is important, it shouldn't come at the expense of hiring the best talent available. Prioritizing team culture over talent can lead to a lack of diversity and a limited pool of candidates. Instead, focus on building a team that values diversity of thought and experience, and prioritizes talent above all else. Don't focus solely on growth: While growth is important, it shouldn't come at the expense of long-term sustainability. Many startups become overly focused on growth and scale, which can lead to a lack of focus on profitability and sustainability. Instead, focus on building a sustainable business that can weather ups and downs in the market and continue to provide value to customers over the long term.",
    },
    {
      id: "gen2",
      text: "While the options I provided are commonly used to exit a startup, there are cases where a contrarian approach might make sense. Here are a few examples: Stay independent: One contrarian approach would be for the founders to resist the urge to exit the startup and instead choose to stay independent. This can be a good option if the founders believe in the long-term potential of the company and are not interested in cashing out. Staying independent can also give the founders more control over the direction of the company and allow them to maintain their vision and values. Pivot: Instead of looking for an exit strategy, the founders could choose to pivot the company in a new direction. This can be a risky move, but it can also be a way to reinvent the company and find new opportunities. Pivoting can also allow the founders to avoid selling the company for less than they believe it's worth. Take a break: If the founders are feeling burnt out or overwhelmed, taking a break from the startup may be a contrarian approach. Instead of rushing to exit the company, the founders could choose to take some time off to recharge and refocus. This can help them come back to the startup with fresh ideas and renewed energy. Build a lifestyle business: While many startups are focused on growth and scaling, a contrarian approach would be to build a lifestyle business that provides a comfortable income for the founders without the pressure to grow rapidly. This can be a good option if the founders value work-life balance and are not interested in the high-stress, high-growth environment of a typical startup.",
    },
  ];

  const handleScrape = async () => {
    console.log("scraping");
    setLoadingScrape(true);
    fetch("/api/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })
      .then((response) => response.json())
      .then(({ data }: any) => {
        setProduct(data.product);
        setTargetAudience(data.target_audience);
        setLoadingScrape(false);

        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleGenerateIdeas = async () => {
    setLoadingIdeas(true);
    fetch("/api/ideas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product,
        targetAudience,
        prompt:
          "generate a list of listicle ideas for the target market " +
          targetAudience,
      }),
    })
      .then((response) => response.json())
      .then(({ data }: any) => {
        console.log(data);
        setIdeas(data);
        setLoadingIdeas(false);

        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleIngest = async () => {
    setLoadingIngest(true);
    fetch("/api/ingest-old", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ docs: library }),
    })
      .then((response) => response.json())
      .then(({ data }: any) => {
        setLoadingIngest(false);
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  async function handleGenerateBlog(title: string) {
    const response = await fetch("/api/generate-old", {
      method: "POST",
      body: JSON.stringify({
        title,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response || !response.body) {
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    function onParse(event: any) {
      if (event.type === "event") {
        try {
          const data = JSON.parse(event.data);
          data.choices
            .filter(({ delta }: any) => !!delta.content)
            .forEach(({ delta }: any) => {
              setBlogContent((prev: string) => {
                return `${prev || ""}${delta.content}`;
              });
            });
        } catch (e) {
          console.log(e);
        }
      }
    }

    const parser = createParser(onParse);

    while (true) {
      const { value, done } = await reader.read();
      const dataString = decoder.decode(value);
      if (done || dataString.includes("[DONE]")) break;
      parser.feed(dataString);
    }

    // setIsLoading(false);
  }

  // const handleGenerateBlog = async (text:string) => {
  //   setLoadingGenerate(true)
  // const response = await fetch('/api/generate-old', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ title:text }),
  // })

  // if (!response.ok) {
  //   throw new Error(response.statusText);
  // }

  // // This data is a ReadableStream
  // const data = response.body;
  // if (!data) {
  //   return;
  // }

  // const reader = data.getReader();
  // const decoder = new TextDecoder();
  // let done = false;

  // while (!done) {
  //   const { value, done: doneReading } = await reader.read();
  //   done = doneReading;
  //   const chunkValue = decoder.decode(value);
  //   setBlogContent((prev:string) => prev + chunkValue);
  // }
  // setLoadingGenerate(false);

  // }

  return (
    <Container maxW="container.md" pt={10}>
      <Tabs>
        <TabList>
          <Tab>Dashboard</Tab>
          <Tab>Library</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={4} align="flex-start">
              <Input
                placeholder="engyne.ai"
                onChange={(evt: any) => {
                  setURL(evt.target.value);
                }}
              />
              <Button
                onClick={() => {
                  handleScrape();
                }}
                disabled={!url}
                isLoading={loadingScrape}
              >
                Scrape
              </Button>

              <Text fontWeight={500}>Product</Text>
              <Text>{product}</Text>

              <Text fontWeight={500}>Target Audience</Text>
              <Text>{targetAudience}</Text>

              <Input
                defaultValue="generate a list of keyword ideas"
                placeholder="generate a list of keyword ideas"
                onChange={(evt: any) => {
                  setURL(evt.target.value);
                }}
              />

              <Button
                onClick={() => {
                  handleGenerateIdeas();
                }}
                isLoading={loadingIdeas}
              >
                Generate Ideas
              </Button>

              <VStack w="full" spacing={0}>
                {ideas.map((item, index) => (
                  <Box
                    p={2}
                    _hover={{
                      backgroundColor: "gray.50",
                      cursor: "pointer",
                      rounded: "md",
                    }}
                    key={index}
                    w="full"
                    onClick={() => {
                      handleGenerateBlog(item);
                      setBlogTitle(item);
                    }}
                  >
                    <Text>
                      {index + 1}. {item}
                    </Text>
                  </Box>
                ))}
              </VStack>
              {
                <BlogDrawer
                  title={blogTitle}
                  content={blogContent}
                ></BlogDrawer>
              }

              {/* <Text whiteSpace="pre-line">{ideas}</Text> */}
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack spacing={4} align="flex-start">
              <Button
                onClick={() => {
                  handleIngest();
                }}
                isLoading={loadingIngest}
              >
                Ingest
              </Button>
              {library.map((item, index) => (
                <Text key={index} noOfLines={6}>
                  {item.text}
                </Text>
              ))}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
