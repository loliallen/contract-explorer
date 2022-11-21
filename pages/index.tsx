import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Code,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Link,
  Text,
} from "@chakra-ui/react";
import { AiOutlineSave as SaveIcon } from "react-icons/ai";
import { useAccount, useSigner } from "wagmi";
import { Contract, ContractFunction, ethers } from "ethers";
import { useState, useEffect } from "react";
import { AbiInput } from "../lib/components/abi-input";
import { Connect } from "../lib/components/connect";
import { SaveModal } from "../lib/components/save-modal";
import { ContractAddressInput } from "../lib/components/contract-address-input";
import { Seo } from "../lib/components/seo";
import NextLink from "next/link";
import { configureArgs, configureParams } from "../lib/utils/abi";
import { HowToWork } from "../lib/containers/how-to-work";

const Page = () => {
  const { data: signer } = useSigner();
  const { address: accountAddress } = useAccount();

  const [isOpen, setIsOpen] = useState(false);

  const [abi, setAbi] = useState<any[]>([]);
  const [params, setParams] = useState<
    Record<string, { type: "call" | "send"; params: any[] }>
  >({});
  const [args, setArgs] = useState<
    Record<string, { from: string; value?: any }>
  >({});
  const [results, setResults] = useState<
    Record<string, { type: "success" | "error"; value: any }>
  >({});
  const [address, setAddress] = useState("");
  const [contract, setContract] = useState<Contract | null>();

  const toggleModal = () => setIsOpen((p) => !p);

  const execContractFunction = async (hash: string, name: string) => {
    try {
      if (!contract) return;
      const data = [...params[hash].params, args[hash]];
      console.log("data", data, contract, name);
      const res = await contract[name](...params[hash].params, args[hash]);
      setResults((p) => ({ ...p, [hash]: { value: res, type: "success" } }));
    } catch (e) {
      console.log(e);
      setResults((p) => ({ ...p, [hash]: { value: e, type: "error" } }));
    }
  };

  const handleChangeFunctionParam =
    (name: string, index: number, len: number) => (value: any) => {
      const data: any[] = [];
      for (let i = 0; i < len; i++) {
        if (i === index) data.push(value);
        else {
          const prev_value = params[name].params[i];
          data.push(prev_value || undefined);
        }
      }
      setParams((p) => ({
        ...p,
        [name]: { type: p[name].type, params: data },
      }));
    };

  const handleChangeFunctionArgs =
    (name: string, field: "from" | "value") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setArgs((p) => ({
        ...p,
        [name]: { ...p[name], [field]: e.target.value },
      }));
    };

  useEffect(() => {
    if (ethers.utils.isAddress(address) && abi && signer) {
      setContract(new Contract(address, abi, signer));
    }
  }, [address, abi, signer]);

  useEffect(() => {
    if (Array.isArray(abi)) {
      setParams(configureParams(abi));
      setArgs(configureArgs(abi));
    }
  }, [abi]);

  return (
    <>
      <Seo />
      <Connect />
      <Box mx="2rem">
        <Box id="descriptions" m="2rem 0">
          <Heading as="h1">Contracts explorer</Heading>
          <Text>
            <NextLink href={"/about"}>
              <Link>How to work</Link>
            </NextLink>{" "}
            with that?
          </Text>
          <HowToWork />
        </Box>
        <Flex id="settings" alignItems="center" justifyContent="left">
          <Box minW="40vw" maxW="60vw ">
            <ContractAddressInput
              setAbi={setAbi}
              setAddress={setAddress}
              address={address}
            >
              <InputRightAddon>
                <Button variant="ghost" onClick={toggleModal}>
                  <SaveIcon />
                </Button>
              </InputRightAddon>
            </ContractAddressInput>
            <AbiInput setAbi={setAbi} />
          </Box>
        </Flex>
        <Box mt="2rem">
          <Box hidden={!contract}>
            <Heading fontSize="3xl" mb="1rem">
              Functions
            </Heading>
            {abi
              .filter((a) => a.type === "function")
              .map((a, i) => (
                <Box key={i} p="1rem 0" borderBottom="1px solid lightGray">
                  <Heading fontSize="xl">{a.name}</Heading>
                  <Flex pl=".5rem" align="center" gap="2rem">
                    <Box flex="1">
                      {a.inputs &&
                        a.inputs.map(
                          (
                            input: { name: string; type: string },
                            j: React.Key
                          ) => (
                            <Box key={j} mt=".25rem">
                              <InputGroup>
                                <InputLeftAddon>
                                  {input.name} : {input.type}
                                </InputLeftAddon>
                                <Input
                                  onChange={(e: { target: { value: any } }) =>
                                    handleChangeFunctionParam(
                                      a.hash,
                                      Number(j),
                                      a.inputs.length
                                    )(
                                      input.type.includes("[]")
                                        ? e.target.value.split(",")
                                        : e.target.value
                                    )
                                  }
                                />
                              </InputGroup>
                            </Box>
                          )
                        )}
                      {results[a.hash] && (
                        <Box
                          mt="1rem"
                          color={
                            results[a.hash].type === "error"
                              ? "red.600"
                              : "blue.300"
                          }
                          flexShrink="0"
                          overflow="hidden"
                        >
                          <Heading fontSize="md">
                            Output{" "}
                            {results[a.hash].type === "error" && "(ERROR)"}
                          </Heading>
                          <Code p=".5rem" overflow="auto">
                            <pre>
                              {JSON.stringify(results[a.hash].value, null, 2)}
                            </pre>
                          </Code>
                        </Box>
                      )}
                    </Box>
                    <Box width="5rem" justifyContent="right" display="flex">
                      <Button
                        onClick={() => execContractFunction(a.hash, a.name)}
                      >
                        Exec
                      </Button>
                    </Box>
                  </Flex>
                  <Box pl=".5rem" mt="1rem">
                    <Accordion allowToggle>
                      <AccordionItem>
                        <AccordionButton>
                          <Heading fontSize="md">Args</Heading>
                        </AccordionButton>
                        <AccordionPanel>
                          <InputGroup>
                            <InputLeftAddon>From</InputLeftAddon>
                            <Input
                              defaultValue={accountAddress}
                              onChange={handleChangeFunctionArgs(
                                a.hash,
                                "from"
                              )}
                            />
                          </InputGroup>
                          {args[a.hash]?.value !== undefined && (
                            <InputGroup mt=".5rem">
                              <InputLeftAddon>Value</InputLeftAddon>
                              <Input
                                onChange={handleChangeFunctionArgs(
                                  a.hash,
                                  "value"
                                )}
                              />
                            </InputGroup>
                          )}
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
        <SaveModal
          isOpen={isOpen}
          onClose={toggleModal}
          data={{ address, abi }}
        />
      </Box>
    </>
  );
};

export default Page;
