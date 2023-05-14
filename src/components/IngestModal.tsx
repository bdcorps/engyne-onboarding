import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";

interface IngestModalProps {
  addDoc: (doc: string) => void;
}

const IngestModal: FunctionComponent<IngestModalProps> = ({
  addDoc,
}: IngestModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [doc, setDoc] = useState<string>("");

  return (
    <>
      <Button onClick={onOpen} variant="link">
        + Add new
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Text</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              placeholder="This is the doc"
              resize="none"
              h={300}
              onChange={(evt) => {
                setDoc(evt.target.value);
              }}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={(evt) => {
                addDoc(doc);
                onClose();
              }}
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default IngestModal;
