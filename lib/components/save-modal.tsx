import { useState, ChangeEvent } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useNetwork } from "wagmi";
import { memorize } from "../store";

type Props = {
  isOpen: boolean;
  onClose: () => void;

  data: { address: string; abi: any };
};

export const SaveModal = ({ isOpen, onClose, data }: Props) => {
  const network = useNetwork();
  const { address, abi } = data;

  const [name, setName] = useState("");

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSave = () => {
    memorize(name, data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Save Contract</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Contract Address</FormLabel>
            <Input value={address} />
          </FormControl>
          <FormControl mt="1rem">
            <FormLabel>Network</FormLabel>
            <Input value={network.chain && network.chain.name} />
          </FormControl>
          <FormControl mt="1rem">
            <FormLabel>Contract Name</FormLabel>
            <Input value={name} onChange={handleChangeName} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="blue" onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
