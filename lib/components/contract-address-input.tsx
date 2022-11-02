import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  List,
  ListItem,
  Menu,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { ReactNode, useState, useEffect } from "react";
import { useNetwork } from "wagmi";
import { getMemorizedData, getObject } from "../store";

type Props = {
  address: string;
  setAddress: (address: string) => void;
  setAbi: (abi: any[]) => void;
  children?: ReactNode;
};
export const ContractAddressInput = ({
  address,
  setAddress,
  setAbi,
  children,
}: Props) => {
  const [memoContracts, setMemoContracts] = useState<string[]>([]);
  const { chain } = useNetwork();
  useEffect(() => {
    const contracts = getMemorizedData();
    setMemoContracts(contracts);
  }, []);

  const handleClickOnMenuItem = (name: string) => {
    const contractData: { address: string; abi: any[] } = getObject(name);
    setAddress(contractData.address);
    setAbi(contractData.abi);
  };

  return (
    <>
      {memoContracts.length > 0 && (
        <Box id="recent" mb="1rem">
          <Heading fontSize="xl" color="gray.600" mb=".5rem">
            Recent
          </Heading>
          <List spacing={4}>
            {memoContracts.reverse().map((el, i) => (
              <ListItem
                key={i}
                onClick={() => handleClickOnMenuItem(el)}
                color="gray.400"
                cursor="pointer"
              >
                {el}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      <FormControl>
        <FormLabel fontWeight="bold">
          Contract Address{" "}
          {chain?.name ? `(on ${chain.name})` : "(Missing Network)"}
        </FormLabel>
        <InputGroup>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          {children}
        </InputGroup>
      </FormControl>
    </>
  );
};
