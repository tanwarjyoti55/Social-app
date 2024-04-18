import { Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useSelector((state) => state.userSlice.value);

  return (
    <Flex justifyContent={"space-between"} mt={8} mb={12}>
      {user && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} />
        </Link>
      )}
      <Image
        cursor={"pointer"}
        alt="logo"
        src={colorMode === "dark" ? "./light-logo.svg" : "./dark-logo.svg"}
        onClick={toggleColorMode}
      />
      {user && (
        <Link as={RouterLink} to={`/${user.username}`}>
          <RxAvatar size={24} />
        </Link>
      )}
    </Flex>
  );
}

export default Header;
