import { Flex, Image, useColorMode } from "@chakra-ui/react";
import React from "react";

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex justifyContent={"right"} mt={8} mb={12}>
      <Image
        cursor={"pointer"}
        alt="logo"
        src={colorMode === "dark" ? "./light-logo.svg" : "./dark-logo.svg"}
        onClick={toggleColorMode}
      />
    </Flex>
  );
}

export default Header;
