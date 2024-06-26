import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import ProductList10 from "../../ProductList/ProductList10/ProductList10";

const ProductHome10Styles = styled.section`
  margin: 25px 0 30px;
  .productHome10__title {
    text-align: center;
    margin-bottom: 30px;
    h2 {
      line-height: 54px;
      color: #070707;
      text-transform: uppercase;
      font-size: 32px;
    }
  }
  .productHome10__listProduct {
    margin-left: -8px;
    .product__main {
      padding-left: 8px;
    }
  }
  &.productHome10Discount {
    border: 3px solid transparent;
    border-radius: 15px;
    padding: 10px 30px;
    position: relative;
    margin-top: 50px;
    .productHome10__title {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 4;
      width: 100%;
      transform: translateY(-50%);
      display: flex;
      justify-content: center;
      & > h2 {
        display: inline-block;
        background-color: white;
        padding: 5px 30px;
        border-radius: 30px;
        box-shadow: 0 2px 6px 1px rgba(0, 0, 0, 0.1);
        & > div {
          display: flex;
          align-items: center;
          column-gap: 10px;
        }
      }
    }
    .productHome10__content {
      margin-top: 50px;
    }
  }
  @media only screen and (max-width: 450px) {
    .productHome10__title {
      margin-bottom: 12px;
      h2 {
        font-size: 20px;
      }
    }
    &.productHome10Discount {
      padding: 10px 15px !important;
    }
  }
`;

const ProductHome10 = ({ title, categories, ...props }) => {
  const appTheme = useSelector((state) => state.app.appTheme);
  return (
    <ProductHome10Styles
      className={`productHome10 ${
        title === "Sản phẩm giảm giá" ? "productHome10Discount" : ""
      }`}
      style={{
        borderColor: appTheme.color_main_1,
      }}
    >
      <div className="productHome10__content">
        <div className="wrapper-container">
          <div className="productHome10__title">
            <h2>
              {categories && categories.length > 0 ? (
                <Link
                  to={
                    categories && categories.length > 0
                      ? `/san-pham?danh-muc=${categories[0].slug}-${categories[0].id}`
                      : "#"
                  }
                >
                  <h2>{title}</h2>
                </Link>
              ) : (
                <div>
                  {title === "Sản phẩm giảm giá" ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        viewBox="0 0 511.548 511.548"
                        style={{
                          enableBackground: "new 0 0 511.548 511.548",
                        }}
                        xmlSpace="preserve"
                        width={30}
                        height={30}
                      >
                        <g>
                          {" "}
                          <path
                            style={{
                              fill: "#FF6200",
                            }}
                            d="M394.441,191.548C307.52,95.547,287.775,20.882,287.775,20.882s-15.054,6.718-32,22.11   l-21.333,244.556l21.333,209h0.001c104.842-0.001,189.833-84.992,189.833-189.833C445.608,263.409,421.423,221.349,394.441,191.548   z"
                          />{" "}
                          <path
                            style={{
                              fill: "#FD7D21",
                            }}
                            d="M223.775,84.882c-10.873,21.747-13.434,46.265-13.33,65.08c0.1,18.252-12.758,34.004-30.655,37.584   c-12.504,2.501-25.43-1.413-34.447-10.43l-17.568-17.568c0,0-26.044,35.911-30.507,42.667   c-20.047,30.346-31.613,66.786-31.321,105.945c0.778,104.581,85.244,188.388,189.828,188.388V42.992   C244.69,53.06,232.797,66.838,223.775,84.882z"
                          />{" "}
                          <g>
                            {" "}
                            <path
                              style={{
                                fill: "#FFB62D",
                              }}
                              d="M405.561,181.48c-43.372-47.903-69.147-90.072-83.134-117.013    c-15.148-29.181-20.112-47.276-20.15-47.42L297.768,0l-16.104,7.183c-0.917,0.409-11.941,5.434-25.89,16.238l-10.667,18.794    l10.667,22.117c8.336-9.351,16.934-16.341,23.849-21.18c11.282,28.696,39.881,87.981,103.699,158.465    c14.217,15.702,47.285,57.376,47.285,105.099c0,96.403-78.43,174.833-174.832,174.833h-0.001l-10.667,19.333l10.667,10.667h0.001    c112.945-0.001,204.832-91.888,204.832-204.833C460.608,265.764,440.544,220.118,405.561,181.48z"
                            />{" "}
                            <path
                              style={{
                                fill: "#FDCB02",
                              }}
                              d="M132.499,430.925c-32.898-32.646-51.206-76.285-51.553-122.876    c-0.26-34.878,9.712-68.616,28.837-97.565c2.335-3.534,11.702-16.602,19.833-27.879l5.119,5.119    c12.592,12.592,30.53,18.025,47.996,14.532c24.888-4.978,42.852-27.004,42.713-52.375c-0.087-15.701,1.881-38.558,11.746-58.29    c5.351-10.702,11.883-19.741,18.584-27.258V23.421c-14.692,11.381-32.628,29.175-45.417,54.753    c-12.515,25.031-15.018,52.9-14.913,71.87c0.061,11.04-7.761,20.626-18.598,22.793c-7.598,1.518-15.414-0.844-20.898-6.328    l-29.997-29.997l-10.319,14.229c-1.071,1.477-26.289,36.256-30.88,43.205c-22.419,33.937-34.109,73.47-33.806,114.325    c0.406,54.565,21.864,105.686,60.421,143.948c38.554,38.259,89.839,59.329,144.407,59.329v-30    C209.176,481.548,165.396,463.57,132.499,430.925z"
                            />{" "}
                          </g>{" "}
                          <g>
                            {" "}
                            <path
                              style={{
                                fill: "#ED3800",
                              }}
                              d="M255.775,206.042c-0.111,0-0.222,0.004-0.333,0.004l-24.997,117.329l24.997,117.329    c0.111,0,0.222,0.004,0.333,0.004c64.801,0,117.333-52.532,117.333-117.333C373.108,258.574,320.576,206.042,255.775,206.042z"
                            />{" "}
                            <path
                              style={{
                                fill: "#FF4B00",
                              }}
                              d="M138.441,323.375c0,64.69,52.352,117.149,117,117.329V206.046    C190.794,206.226,138.441,258.685,138.441,323.375z"
                            />{" "}
                          </g>{" "}
                          <g>
                            {" "}
                            <polygon
                              style={{
                                fill: "#D9E7EC",
                              }}
                              points="319.432,254.503 286.177,254.503 255.441,299.513 245.108,340.882 255.441,348.214   "
                            />{" "}
                            <path
                              style={{
                                fill: "#D9E7EC",
                              }}
                              d="M306.248,317.472c-20.858,0-36.601,13.971-36.601,38.372c0,24.597,15.742,38.371,36.601,38.371    s36.601-13.774,36.601-38.371C342.849,331.443,327.106,317.472,306.248,317.472z M306.248,372.963    c-4.329,0-8.658-3.936-8.658-17.12c0-13.184,4.329-17.12,8.658-17.12s8.658,3.936,8.658,17.12    C314.906,369.027,310.577,372.963,306.248,372.963z"
                            />{" "}
                            <polygon
                              style={{
                                fill: "#FAFCFD",
                              }}
                              points="225.372,392.247 255.441,348.214 255.441,299.513 192.117,392.247   "
                            />{" "}
                            <path
                              style={{
                                fill: "#FAFCFD",
                              }}
                              d="M241.902,290.907c0-24.4-15.742-38.372-36.601-38.372s-36.601,13.971-36.601,38.372    c0,24.597,15.742,38.372,36.601,38.372S241.902,315.504,241.902,290.907z M196.643,290.907c0-13.184,4.329-17.12,8.658-17.12    c4.329,0,8.658,3.936,8.658,17.12c0,13.184-4.329,17.12-8.658,17.12C200.972,308.027,196.643,304.091,196.643,290.907z"
                            />{" "}
                          </g>{" "}
                        </g>
                      </svg>
                    </span>
                  ) : null}
                  <h2>{title}</h2>
                </div>
              )}
            </h2>
          </div>
          <ProductList10 products={props.products}></ProductList10>
        </div>
      </div>
    </ProductHome10Styles>
  );
};

export default ProductHome10;
