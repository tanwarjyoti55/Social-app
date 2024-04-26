import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useDeletePost = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.userSlice.value);
  const handleDeletePost = async (postId) => {
    try {
      if (!window.confirm("Are you sure want to delete this post")) return;
      const res = await axios.delete(`/api/posts/${postId}`);
      const data = res.data;
      if (data.error) {
        toast.error(data.error);
      }
      navigate(`/${user.username}`);
    } catch (error) {
      toast.error(error);
    }
  };
  return { handleDeletePost };
};

export default useDeletePost;
