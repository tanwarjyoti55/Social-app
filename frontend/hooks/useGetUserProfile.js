import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      try {
        const res = await axios.get(`/api/users/profile/${username}`);
        const data = res.data;
        if (data.error) {
          toast.error(data.error);
        }
        setUser(data);
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [username]);
  return { user, loading };
};

export default useGetUserProfile;
