import { useState } from "react";
import { toast } from "react-toastify";

const usePreviewImage = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const handlePreviewImage = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImgUrl(e.target.files[0]);
    } else {
      toast.error("Invalid file type");
      setImgUrl(null);
    }
  };
  return { handlePreviewImage, imgUrl, setImgUrl };
};

export default usePreviewImage;
