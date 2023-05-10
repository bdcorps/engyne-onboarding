import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { FunctionComponent } from "react";


interface BlogDrawerProps {
  title: string;
  content:string;
}
 
const BlogDrawer: FunctionComponent<BlogDrawerProps> = ({title, content}:BlogDrawerProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return  <Drawer onClose={onClose} isOpen={true} size="lg">
  <DrawerOverlay />
  <DrawerContent>
    <DrawerCloseButton />
    <DrawerHeader>{title}</DrawerHeader>
    <DrawerBody>
    <Text>{content}</Text>
    </DrawerBody>
  </DrawerContent>
</Drawer>
}
 
export default BlogDrawer;
