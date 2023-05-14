import IngestModal from "@/components/IngestModal";
import { useCreateSite } from "@/hooks/api";
import { generateRandomSiteName, getRandomNumber } from "@/utils";
import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  HStack,
  Heading,
  Input,
  List,
  ListIcon,
  ListItem,
  Progress,
  Spinner,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { FunctionComponent, useState } from "react";

interface OnboardingProps {}

const Onboarding: FunctionComponent<OnboardingProps> = () => {
  const { data: session, status } = useSession();
  const { mutate: createSiteMutation, isSuccess } = useCreateSite();

  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const [url, setURL] = useState("");

  const [siteData, setSiteData] = useState<any>({});

  const MAX_STEPS = 3;

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, MAX_STEPS - 1));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Step0
            onNextAction={(data: any) => {
              setSiteData((prev: any) => ({ ...prev, ...data }));
              handleNext();
            }}
            // loading={loading}
          />
        );
      case 1:
        return (
          <Step1
            onPrevAction={() => {
              handlePrev();
            }}
            onNextAction={(data: any) => {
              setSiteData((prev: any) => ({ ...prev, ...data }));
              handleNext();
            }}
          />
        );
      case 2:
        return (
          <Step2
            onPrevAction={() => {
              handlePrev();
            }}
            onNextAction={(data: any) => {
              const siteDataToPost = {
                ...siteData,
                ...data,
                userId: (session as any)?.userId,
                subdomain: generateRandomSiteName(),
              };

              setSiteData((prev: any) => siteDataToPost);

              createSiteMutation(siteDataToPost);
            }}
          />
        );
    }
  };

  return (
    <HStack w="full" h="100vh" spacing={0}>
      <VStack
        w={500}
        backgroundColor="brand.300"
        h="full"
        align="center"
        justify="center"
      >
        <Heading color="white">Engyne LLM</Heading>
      </VStack>

      <Box w="full" h="full">
        <Center alignItems="center" justifyItems="center" w="full" h="full">
          <VStack w={500} align="flex-start" spacing={10}>
            <VStack w={500} align="flex-start" spacing={2}>
              <Text fontSize="sm" color="gray.500">{`${
                step + 1
              }/${MAX_STEPS}`}</Text>

              <VStack w={500} align="flex-start" spacing={6}>
                {renderStep()}
              </VStack>
            </VStack>
          </VStack>
        </Center>
      </Box>
    </HStack>
  );
};

interface Step0Props {
  // loading: boolean;
  onNextAction: (data: any) => void;
}

const Step0: FunctionComponent<Step0Props> = ({
  onNextAction,
}: // onNextAction,
// loading,
Step0Props) => {
  const [url, setURL] = useState("https://engyne.ai");

  const [product, setProduct] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  const [loading, setLoading] = useState(false);
  const { mutate: createSiteMutation, isSuccess } = useCreateSite();

  const handleScrape = async () => {
    setLoading(true);
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
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <Text fontSize="xl" fontWeight={600}>
        About your company
      </Text>

      <VStack w={500} align="flex-start" spacing={2}>
        <HStack align="flex-end" w="full">
          <VStack align="flex-start" w="full">
            <Text fontSize="sm">What&apos;s your website?</Text>
            <Input
              defaultValue={url}
              placeholder="https://engyne.ai"
              onChange={(evt) => {
                setURL(evt.target.value);
              }}
            />
          </VStack>
          <Button
            onClick={() => {
              handleScrape();
            }}
          >
            Add
          </Button>
        </HStack>
      </VStack>

      {loading && (
        <Progress size="xs" isIndeterminate colorScheme="brand" w="full" />
      )}

      {product && (
        <VStack w="full" align="flex-start">
          <Text fontWeight={500} fontSize="sm">
            You&apos;re selling...
          </Text>
          <Text fontSize="sm">{product}</Text>
        </VStack>
      )}

      {targetAudience && (
        <VStack w="full" align="flex-start">
          <Text fontWeight={500} fontSize="sm">
            to...
          </Text>
          <Text fontSize="sm">{targetAudience}</Text>
        </VStack>
      )}

      <HStack w="full" justify="space-between">
        {/* <Button onClick={handlePrevious}>Previous</Button> */}
        <Button
          onClick={() => {
            onNextAction({ url, targetAudience, product });
          }}
          isDisabled={!product || !targetAudience}
        >
          Next
        </Button>
      </HStack>
    </>
  );
};

interface Step1Props {
  onPrevAction: () => void;
  onNextAction: (data: any) => void;
}

const Step1: FunctionComponent<Step1Props> = ({
  onPrevAction,
  onNextAction,
}: Step1Props) => {
  const [library, setLibrary] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addDoc = (doc: string) => {
    setLibrary((prev) => [...prev, doc]);
    handleIngest(doc);
  };

  const handleIngest = async (doc: string) => {
    setLoading(true);
    fetch("/api/ingest-old", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docs: [{ id: getRandomNumber(1, 100), text: doc }],
      }),
    })
      .then((response) => response.json())
      .then(({ data }: any) => {
        setLoading(false);
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <Text fontSize="xl" fontWeight={600}>
        Add your marketing docs
      </Text>

      <List spacing={1} w="full" rounded="md">
        {library.map((doc, index) => (
          <ListItem key={index} p={1} rounded="sm">
            <HStack w="full" align="center" spacing={2}>
              {loading ? (
                <Spinner size="sm" />
              ) : (
                <ListIcon as={CheckCircleIcon} color="green.500" />
              )}
              <Text fontSize="sm">{doc}</Text>
            </HStack>
          </ListItem>
        ))}
        <ListItem p={2} rounded="sm">
          <IngestModal addDoc={addDoc} />
        </ListItem>
      </List>

      <HStack w="full" justify="space-between">
        <Button onClick={onPrevAction} variant="unstyled">
          ←
        </Button>
        <Button
          onClick={() => {
            onNextAction({});
          }}
        >
          Next
        </Button>
      </HStack>
    </>
  );
};

interface Step2Props {
  onPrevAction: () => void;
  onNextAction: (data: any) => void;
}

const Step2: FunctionComponent<Step2Props> = ({
  onPrevAction,
  onNextAction,
}: Step2Props) => {
  const [contentStyle, setContentStyle] = useState("");

  return (
    <>
      <Text fontSize="xl" fontWeight={600}>
        Describe your content style
      </Text>
      <Textarea
        placeholder="Helping indie founders grow their startup in a healthy way"
        resize="none"
        onChange={(evt) => {
          setContentStyle(evt.target.value);
        }}
      />
      <HStack w="full" justify="space-between">
        <Button onClick={onPrevAction} variant="unstyled">
          ←
        </Button>
        <Button
          onClick={() => {
            onNextAction({ contentStyle });
          }}
        >
          Generate my blog
        </Button>
      </HStack>
    </>
  );
};

export default Onboarding;
