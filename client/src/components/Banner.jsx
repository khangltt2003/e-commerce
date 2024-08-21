import cover_image_1 from "../assets/cover_image_1.png";
import cover_image_2 from "../assets/cover_image_2.png";
const Banner = () => {
  return (
    <div>
      <img src={cover_image_1} className=" w-full object-contain" alt="cover_image" />
    </div>
  );
};

export default Banner;
