import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import CommentActions from "./CommentActions";
import {  useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { postData } from "../slice/postSlice";

const Comment = ({ comment, createdAt, username, profilePic }) => {
  const {pid}=useParams();
  const dispatch = useDispatch();
  const post = useSelector((state) => state.postSlice.value);

  const replyIndex = post?.replies?.map((reply,index) => {return index});
  
  // useEffect(()=>{
  //   const replyToPost = async()=>{
  //     const res = await axios.put(`/api/posts/reply/${pid}`);
  //     const data = res.data;

  //     if(data.error){
  //       toast.error(data.error);
  //     }
  //     dispatch(postData(data));
  //   }
  //   replyToPost();
  // },[dispatch, pid])

  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={profilePic} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize="sm" fontWeight="bold">
              {username}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"} color={"gray.light"}>
                {createdAt}
              </Text>
            </Flex>
          </Flex>
          <Text>{comment}</Text>
          <CommentActions post={post} />
        </Flex>
      </Flex>
      <Divider />
    </>
  );
};

export default Comment;
