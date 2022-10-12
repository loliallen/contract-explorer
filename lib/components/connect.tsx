import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Box } from "@chakra-ui/react";

export const Connect = () => {
  return (
    <Box as="header" display="flex" flexDir="row-reverse" p=".5rem 2rem">
      <ConnectButton />
    </Box>
  );
};
