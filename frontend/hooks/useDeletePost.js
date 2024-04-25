import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const useDeletePost = () => {
  const handleDeletePost = async (postId) => {
    try {
      const res = await axios.delete(`/api/posts/${postId}`);
      const data = res.data;
      if (data.error) {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error);
    }
  };
  return { handleDeletePost };
};

export default useDeletePost;
