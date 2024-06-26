import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageLoading from "../../components/PageLoading";
import { constants as c } from "../../constants";
import { productActions as a } from "../../actions/productActions";

const Paginate = React.lazy(() => import('../../components/Paginate'));
const Header = React.lazy(() => import('../../components/Header'));
const ProductCard = React.lazy(() => import("../../components/ProductCard"));
const Footer = React.lazy(() => import('../../components/Footer'));

function PurchasedPage(props) {
  const pageInfo = useSelector(state => state.product.purchased);
  const dispatch = useDispatch();
  useEffect(() => {
    document.title = "Sản phẩm đã mua"
    if (pageInfo.status === c.LOADING) {
      dispatch(a.getPurchasedProducts());
    }
  });

  return (



    pageInfo.status === c.SUCCESS
      ?
      <React.Fragment>
        {/* <Header /> */}
        <div className="purchased-product-page container">
          <div className="mobile-tool mobile">
            <span>
              Có {pageInfo.total} sản phẩm đã mua
            </span>
          </div>
          <div className="products-list">
            <span>
              Đã mua {pageInfo.total} sản phẩm
            </span>
            <div className="row">
              {
                pageInfo.data.map((v, i) =>
                  <ProductCard
                    key={i}
                    images={v.images}
                    name={v.name}
                    price={v.price}
                    product_discount={v.product_discount}
                    id={v.id}
                    product={v}
                  />
                )
              }
            </div>
            <Paginate
              currentPage={pageInfo.currentPage}
              totalPage={pageInfo.last_page}
            />
          </div>
        </div>
        <Footer />
      </React.Fragment>
      : null
  )
}
export default PurchasedPage