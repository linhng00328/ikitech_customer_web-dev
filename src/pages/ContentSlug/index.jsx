import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductInfoPage from "../ProductInfo/ProductInfoPage";
import { productActions as a } from "../../actions/productActions";
import { newsActions as n } from "../../actions/newsActions";

import { constants as c } from "../../constants";
import NewsPage from "../News/NewsPage";
import { appServices } from "../../services/appServices";
import axios from "axios";
import ErrorPage from "../Error/ErrorPage";
import { useParams } from "react-router-dom";
import ProductsListPage from "../ProductsList/ProductsListPage";
import NewsListPage from "../NewsList/NewsListPage";
const store_code = appServices.store_code;

try {
  var tokenInfo = JSON.parse(localStorage.getItem("tokenInfo"));
} catch (error) {
  var tokenInfo = null;
  window.localStorage.removeItem("tokenInfo");
}

function ContentSlug(props) {
  //   const dispatch = useDispatch();
  //   const product = useSelector((state) => state.product.info);
  //   const pageInfo = useSelector((state) => state.news.info);

  //   console.log("product", product);

  //   useEffect(() => {
  //     if (product.status === c.LOADING) {
  //       dispatch(a.getProductInfo(productId));
  //     }
  //     // if (pageInfo.status === c.LOADING) {
  //     //   dispatch(n.getNewsInfo(productId));
  //     // }
  //   }, [props.match.params.slug, productId]);

  //   useEffect(() => {
  //     if (productId != -1 && parseInt(productId) !== product.id) {
  //       dispatch({ type: c.RESET_PRODUCT_STATUS });
  //     }
  //     // if (parseInt(productId) !== pageInfo.id) {
  //     //   dispatch({ type: c.RESET_NEWS_STATUS });
  //     // }
  //   }, [productId, product]);

  //   useEffect(() => {
  //     if (Object.keys(product).length > 0) {
  //       setContent("product");
  //       return;
  //     }
  //     if (Object.keys(pageInfo).length > 0) {
  //       setContent("news");
  //       return;
  //     }
  //   }, [productId, product , pageInfo]);
  const [content, setContent] = useState("");
  let id = -1;
  if (props?.match?.params?.slug) {
    let arr = props.match.params.slug.split("-");
    id = arr[arr.length - 1];
  }
  let { slug } = useParams();

  useEffect(() => {
    if (slug == "san-pham") {
      setContent("product-category");
      return;
    }
    if (slug == "tin-tuc") {
      setContent("post-category");
      return;
    }
    const fetchContentType = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "customer-token": tokenInfo ? tokenInfo.token : "",
        },
      };
      const res = await axios.get(
        `${c.API_URL}/customer/${store_code}/slugs/${props.match.params.slug}`,
        requestOptions
      );
      console.log("res", res.data?.data?.type);
      if (!res.data?.data) {
        setContent("notfound");
        return;
      }
      setContent(res.data?.data?.type);
    };
    fetchContentType();
  }, [props.match.params.slug]);

  return (
    <div>
      {content === "product" && (
        <ProductInfoPage productId={slug} props={props} />
      )}
      {content === "post" && <NewsPage newsId={slug} props={props} />}
      {content === "product-category" && (
        <ProductsListPage newsId={slug} props={props} />
      )}
      {content === "post-category" && (
        <NewsListPage newsId={slug} props={props} />
      )}
      {content === "notfound" && <ErrorPage props={props} />}
    </div>
  );
}

export default ContentSlug;
