import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
  return (
    <>
      <UserHeader />
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
