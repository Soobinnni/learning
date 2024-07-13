import { Link, useParams } from 'react-router-dom';


function ProductDetailPage() {
  const params = useParams();

  return (
    <>
      <h1>Product Details!</h1>
      <p>{params.productId}</p>
      <Link to=".." relative='path'>뒤로가기</Link>
      <Link to=".." relative='route'>뒤로가기</Link>
    </>
  );
}

export default ProductDetailPage;