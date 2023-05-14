import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
} from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";

interface BlogDrawerProps {
  title: string;
  content: string;
  isOpen: boolean;
}

const BlogDrawer: FunctionComponent<BlogDrawerProps> = ({
  title,
  content,
  isOpen,
}: BlogDrawerProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(isOpen);

  // const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Drawer
      isOpen={isDrawerOpen}
      onClose={() => {
        setIsDrawerOpen(false);
      }}
      size="lg"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton onClick={() => setIsDrawerOpen(false)} />
        <DrawerHeader>{title}</DrawerHeader>
        <DrawerBody>
          <Text>{content}</Text>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default BlogDrawer;
