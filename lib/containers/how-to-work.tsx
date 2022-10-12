import { List, ListItem } from "@chakra-ui/react";
import React from "react";

export const HowToWork = () => {
  return (
    <List>
      <ListItem>1. Connect Wallet</ListItem>
      <ListItem>2. Select Network</ListItem>
      <ListItem>3. Input Contract Address</ListItem>
      <ListItem>4. Input Contract ABI</ListItem>
      <ListItem>5. Explore contract functions</ListItem>
    </List>
  );
};
