import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Menu,
  MenuItem,
  MenuList,
  Textarea,
} from "@chakra-ui/react";

type Props = {
  setParams: React.Dispatch<React.SetStateAction<any>>;
  setAbi: React.Dispatch<React.SetStateAction<any>>;
};
export const AbiInput = ({ setParams, setAbi }: Props) => {
  const ref = useRef<HTMLInputElement>(null);

  const [prefix, setPrefix] = useState("");
  const [abiStr, setAbiStr] = useState<any>([]);
  const [jsonObject, setJsonObject] = useState<any>({});

  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const readJsonFile = (file: File) =>
    new Promise<Record<string, any>>((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(JSON.parse(fr.result as string));
      fr.onerror = (error) => rej(error);
      fr.readAsText(file);
    });

  const configureParams = (abi: any[]) => {
    const data: Record<string, { type: "call" | "send"; params: any[] }> = {};

    for (const fnItem of abi) {
      if (fnItem.type === "function") {
        let type: "call" | "send";
        if (fnItem.stateMutability === "view") {
          type = "call";
        } else {
          type = "send";
        }
        data[fnItem.name] = {
          type,
          params: [],
        };
      }
    }

    setParams(data);
  };

  const handleUploadAbi = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const abiObj = await readJsonFile(e.target.files[0]);
    setJsonObject(abiObj);
  };

  useEffect(() => {
    if (jsonObject && prefix && Object.keys(jsonObject).includes(prefix)) {
      let res = jsonObject[prefix];

      setAbi(res);
      configureParams(res);
    }
  }, [jsonObject, prefix]);

  return (
    <>
      <FormControl mb="1rem">
        <FormLabel>ABI json</FormLabel>
        <InputGroup>
          <InputLeftAddon>prefix:</InputLeftAddon>
          <Input value={prefix} onChange={(e) => setPrefix(e.target.value)} />
        </InputGroup>
        <Box position="relative">
          <Menu
            isOpen={
              prefix.length > 0 && !Object.keys(jsonObject).includes(prefix)
            }
          >
            <MenuList>
              {Object.keys(jsonObject)
                .filter((k) => Array.isArray(jsonObject[k]))
                .map((k, i) => (
                  <MenuItem onClick={() => setPrefix(k)} key={i}>
                    {k}
                  </MenuItem>
                ))}
            </MenuList>
          </Menu>
        </Box>
        <Button
          mt=".5rem"
          width="full"
          onClick={() => ref.current && ref.current.click()}
        >
          Upload
        </Button>
        <input
          hidden
          ref={ref}
          type="file"
          accept=".json"
          onChange={handleUploadAbi}
        />
      </FormControl>
      <FormControl>
        <FormLabel>ABI</FormLabel>
        <Textarea value={abiStr} onChange={(e) => setAbiStr(e.target.value)} />
      </FormControl>
    </>
  );
};
