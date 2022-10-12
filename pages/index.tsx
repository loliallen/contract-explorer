import {
  Box,
  Button,
  Code,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Link,
  Text,
} from "@chakra-ui/react";
import { AiOutlineSave as SaveIcon } from "react-icons/ai";
import { useSigner } from "wagmi";
import { Contract, ethers } from "ethers";
import { useState, useEffect } from "react";
import { AbiInput } from "../lib/components/abi-input";
import { Connect } from "../lib/components/connect";
import { SaveModal } from "../lib/components/save-modal";
import { ContractAddressInput } from "../lib/components/contract-address-input";
import { Seo } from "../lib/components/seo";
import NextLink from "next/link";
import Head from "next/head";
import { configureParams } from "../lib/utils/abi";
import { HowToWork } from "../lib/containers/how-to-work";

const Page = () => {
  const { data: signer } = useSigner();

  const [isOpen, setIsOpen] = useState(false);

  const [abi, setAbi] = useState<any[]>([]);
  const [params, setParams] = useState<
    Record<string, { type: "call" | "send"; params: any[] }>
  >({});
  const [results, setResults] = useState<
    Record<string, { type: "success" | "error"; value: any }>
  >({});
  const [address, setAddress] = useState("");
  const [contract, setContract] = useState<Contract | null>();

  const toggleModal = () => setIsOpen((p) => !p);

  const execContractFunction = async (fnName: string) => {
    try {
      if (!contract) return;
      let res: any;
      if (params[fnName].type === "call")
        res = await contract[fnName](...params[fnName].params);
      else res = await contract[fnName](...params[fnName].params).wait();
      setResults((p) => ({ ...p, [fnName]: { value: res, type: "success" } }));
    } catch (e) {
      console.log(e);
      setResults((p) => ({ ...p, [fnName]: { value: e, type: "error" } }));
    }
  };

  const handleChangeFunctionParam =
    (name: string, index: number, len: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const data: any[] = [];
      for (let i = 0; i < len; i++) {
        if (i === index) data.push(e.target.value);
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

  useEffect(() => {
    if (ethers.utils.isAddress(address) && abi && signer) {
      setContract(new Contract(address, abi, signer));
    }
  }, [address, abi, signer]);

  useEffect(() => {
    if (Array.isArray(abi)) {
      setParams(configureParams(abi));
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
                                  onChange={handleChangeFunctionParam(
                                    a.name,
                                    Number(j),
                                    a.inputs.length
                                  )}
                                />
                              </InputGroup>
                            </Box>
                          )
                        )}
                      {results[a.name] && (
                        <Box
                          mt="1rem"
                          color={
                            results[a.name].type === "error"
                              ? "red.600"
                              : "blue.300"
                          }
                          flexShrink="0"
                          overflow="hidden"
                        >
                          <Heading fontSize="md">
                            Output{" "}
                            {results[a.name].type === "error" && "(ERROR)"}
                          </Heading>
                          <Code p=".5rem" overflow="auto">
                            <pre>
                              {JSON.stringify(
                                results[a.name].value,
                                ["reason", "code", "transaction", "data"],
                                4
                              )}
                            </pre>
                          </Code>
                        </Box>
                      )}
                    </Box>
                    <Box width="5rem" justifyContent="right" display="flex">
                      <Button onClick={() => execContractFunction(a.name)}>
                        Exec
                      </Button>
                    </Box>
                  </Flex>
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
