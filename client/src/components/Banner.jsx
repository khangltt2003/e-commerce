import cover_image_1 from "../assets/cover_image_1.png";
import cover_image_2 from "../assets/cover_image_2.png";
import cover_image_3 from "../assets/cover_image_3.png";
import Slider from "react-slick";

const settings = {
  dots: true,
  fade: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  waitForAnimate: false,
};

const Banner = () => {
  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div>
          <img src={cover_image_1} />
        </div>
        <div>
          <img src={cover_image_2} />
        </div>
        <div>
          <img src={cover_image_3} />
        </div>
      </Slider>
    </div>
  );
};

export default Banner;
