import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  useMemo,
} from "react";
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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
} from "@chakra-ui/react";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

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

  const objectWithPrefix = useMemo(() => {
    if (!prefix) return jsonObject;
    return jsonObject[prefix];
  }, [prefix, jsonObject]);

  const isValidAbiStr = useMemo(() => {
    if (!abiStr) return false;
    try {
      const object = eval(abiStr);
      console.log(Array.isArray(object));
      return Array.isArray(object);
    } catch {
      return false;
    }
  }, [abiStr]);

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

  const handleInputAbi = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setAbiStr(e.target.value);
  };

  const handleUploadAbi = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const abiObj = await readJsonFile(e.target.files[0]);
    setJsonObject(abiObj);
  };

  const hanldeUse = (mode: "json" | "text") => {
    if (mode === "text") {
      try {
        const object = eval(abiStr);
        if (Array.isArray(object)) {
          setAbi(object);
          configureParams(object);
        } else {
          // show error
        }
      } catch (e) {
        // eval error
      }
    } else {
      if (Array.isArray(objectWithPrefix)) {
        setAbi(objectWithPrefix);
        configureParams(objectWithPrefix);
      } else {
        // show error
      }
    }
  };

  return (
    <>
      <Tabs>
        <TabList>
          <Tab>ABI JSON</Tab>
          <Tab>ABI Plain text</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormControl mb="1rem">
              <FormLabel>ABI json</FormLabel>
              <InputGroup>
                <InputLeftAddon>prefix:</InputLeftAddon>
                <Input
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                />
              </InputGroup>
              <Box position="relative">
                <Menu
                  isOpen={
                    prefix.length > 0 &&
                    !Object.keys(jsonObject).includes(prefix)
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
              <Button
                mt=".5rem"
                width="full"
                onClick={() => hanldeUse("json")}
                colorScheme="blackAlpha"
                disabled={!Array.isArray(objectWithPrefix)}
              >
                Use
              </Button>
            </FormControl>
          </TabPanel>
          <TabPanel>
            <FormControl>
              <FormLabel>ABI</FormLabel>
              <Textarea value={abiStr} onChange={handleInputAbi} />
              <Button
                mt=".5rem"
                width="full"
                onClick={() => hanldeUse("text")}
                colorScheme="blackAlpha"
                disabled={!isValidAbiStr}
              >
                Use
              </Button>
            </FormControl>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <input
        hidden
        ref={ref}
        type="file"
        accept=".json"
        onChange={handleUploadAbi}
      />
    </>
  );
};
