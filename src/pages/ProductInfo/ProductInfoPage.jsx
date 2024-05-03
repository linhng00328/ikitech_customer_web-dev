import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { constants as c } from "../../constants";
import PageLoading from "../../components/PageLoading";
import { productActions as a } from "../../actions/productActions";
import { useHistory, useParams } from "react-router-dom";

const DataLoading = React.lazy(() =>
  import("../ProductsList/child/DataLoading")
);
const SimilarProducts = React.lazy(() => import("./child/SimilarProducts"));
const MainInfo = React.lazy(() => import("./child/MainInfo"));
const DetailInfo = React.lazy(() => import("./child/DetailInfo"));
// const Header = React.lazy(() => import("../../components/Header"));
const Footer = React.lazy(() => import("../../components/Footer"));


function ProductInfoPage(props) {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.info);
  const productLiked = useSelector((state) => state.product.info.is_favorite);
  const similarProducts = useSelector((state) => state.product.similar);
  const reviews = useSelector((state) => state.product.review);
  let productId = -1;
  let { slug } = useParams();

  if (props.match.params.id) {
    let arr = props.match.params.id.split("-");
    productId = arr[arr.length - 1];
  }
  useEffect(() => {
    if (product.status === c.LOADING) {
      if (slug) {
        dispatch(a.getProductInfo(slug));
        // history.replace(`/${slug}`);
      } else {
        dispatch(a.getProductInfo(productId));
      }
    }
    if (product.status === c.SUCCESS) {
      if ((productId != -1 && parseInt(productId) !== product.id) || (slug && slug != product.seo_title)) {
        dispatch({ type: c.RESET_PRODUCT_STATUS });
      } else {
        if (product.seo_title != null && product.seo_title.length > 0) {
          document.title = product.seo_title;
        } else {
          document.title = product.name;
        }

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        if (similarProducts.status === c.LOADING) {
          if (slug) {
            dispatch(a.getSimilarProducts(slug));
          } else {
            dispatch(a.getSimilarProducts(productId));
          }
        }

        if (reviews.status === c.LOADING) {
          if (slug) {
            dispatch(a.getProductReview(slug));
          } else {
            dispatch(a.getProductReview(productId));
          }
        }
      }
    }
  }, [props.match.params.id, product, slug]);
  return (
    <React.Fragment>
      {/* <Header /> */}
      {product.status === c.LOADING ? (
        <DataLoading />
      ) : (
        <React.Fragment>
          <div className="product-info-page container">
            <MainInfo product={product} isLiked={productLiked} />
            <SimilarProducts products={similarProducts?.list ?? []} />
            <DetailInfo
              description={product.description}
              attributes={product.attributes}
              productId={productId}
            />
          </div>
        </React.Fragment>
      )}
      {product.status === c.LOADING ? null : <Footer />}
    </React.Fragment>
  );
}
export default ProductInfoPage;
