import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect, useState } from "react";
import { Flex, Spinner, Text } from "@chakra-ui/react";

const UserPage = () => {
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

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) return <Text>User Not Found</Text>;
  return (
    <>
      <UserHeader user={user} />
      <UserPost
        postImg={"/post1.png"}
        postTitle={"This is my first post"}
        likes={234}
        replies={123}
      />
      <UserPost
        postImg={"/post2.png"}
        postTitle={"Hello Sunshine"}
        likes={546}
        replies={23}
      />
      <UserPost
        postImg={"/post3.png"}
        postTitle={"Hey Everyone"}
        likes={100}
        replies={2}
      />
      <UserPost postTitle={"Hey Guys"} likes={100} replies={2} />
    </>
  );
};

export default UserPage;
