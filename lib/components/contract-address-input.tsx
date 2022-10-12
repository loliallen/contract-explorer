import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Menu,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { ReactNode, useState, useEffect } from "react";
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
    <FormControl>
      <FormLabel>Contract Address</FormLabel>
      <InputGroup>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        {children}
        <Box position="absolute" left="0" bottom="0">
          <Menu isOpen={!address}>
            <MenuList>
              {memoContracts.map((el, i) => (
                <MenuItem key={i} onClick={() => handleClickOnMenuItem(el)}>
                  {el}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
      </InputGroup>
    </FormControl>
  );
};
