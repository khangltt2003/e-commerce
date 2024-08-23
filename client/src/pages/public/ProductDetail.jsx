import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../apis";
import { ExtraInfo, ProductDescription, ProductImageSlide } from "../../components";
const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const fetchProduct = async (id) => {
    const response = await getProductById(id);
    setProduct(response.product);
    console.log(product);
  };

  useEffect(() => {
    fetchProduct(id);
  }, []);

  if (!product) return <div>loading...</div>;

  return (
    <div className="flex  gap-10">
      <ProductImageSlide images={product.images} />
      <ProductDescription title={product.title} price={product.price} description={product.description} variants={product.variants} />
      <ExtraInfo />
    </div>
  );
};

export default Product;
