import React from "react";
import { Button } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../slice/userSlice";
import axios from "axios";

const Logout = () => {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/users/logout");
      const data = res.data;
      if (data.error) {
        toast.error(data.error);
      }
      localStorage.removeItem("user-threads");
      dispatch(logout());
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Button
        position={"fixed"}
        size={"sm"}
        top={"30px"}
        right={"30px"}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </>
  );
};

export default Logout;
