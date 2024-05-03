import Slider from "react-slick";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";

import { useSelector } from "react-redux";
import ItemProduct from "./ItemProduct";
import "./style.css";
import styled from "styled-components";

const Product3Styles = styled.section`
  .slick-slider {
    margin: 0 -8px !important;
    .slick-prev {
      left: 8px !important;
      top: 50% !important;
    }
    .slick-next {
      right: 5px !important;
      top: 50% !important;
    }
  }
`;

export default function HomeBanner(props) {
  const { banners, categories, discountProducts } = props;
  const appTheme = useSelector((state) => state.app.appTheme);

  const info = useMemo(() => {
    if (categories && categories.length > 0) {
      return {
        category: categories.filter((v) => v.name === props.title),
      };
    } else {
      return {};
    }
  }, [categories]);

  const [firstLine, setFirstLine] = useState(props.products);
  const [secondLine, setSecondLine] = useState([]);
  var settings1 = {
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
    ],
  };
  var settings2 = {
    infinite: props.products.length > 4,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          infinite: props.products.length > 2,
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          infinite: props.products.length > 3,
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          infinite: props.products.length > 4,
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          infinite: props.products.length > 4,
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
    ],
  };
  useEffect(() => {
    const width = window.innerWidth;
    if (width < 600 && props.products.length > 4) {
      let firstArr = props.products.slice(0, 2);
      let secondArr = props.products.slice(2);
      setFirstLine(firstArr);
      setSecondLine(secondArr);
    }
    if (width >= 600 && width < 768 && props.products.length > 6) {
      let firstArr = props.products.slice(0, 3);
      let secondArr = props.products.slice(3);
      setFirstLine(firstArr);
      setSecondLine(secondArr);
    }
    if (width >= 768 && width < 992 && props.products.length > 8) {
      let firstArr = props.products.slice(0, 4);
      let secondArr = props.products.slice(4);
      setFirstLine(firstArr);
      setSecondLine(secondArr);
    }
    if (width >= 992 && width < 1400 && props.products.length > 10) {
      let firstArr = props.products.slice(0, 5);
      let secondArr = props.products.slice(5);
      setFirstLine(firstArr);
      setSecondLine(secondArr);
    }
    if (width >= 1400 && props.products.length > 10) {
      let firstArr = props.products.slice(0, 5);
      let secondArr = props.products.slice(5);
      setFirstLine(firstArr);
      setSecondLine(secondArr);
    }
  }, []);
  function handleCateClick(id) {
    window.location.href = `/san-pham?danh-muc-ids=${id}`;
  }
  console.log("info.category", info.category);
  return (
    <Product3Styles className="awe-section-5 product33">
      <div className="section_product product_1" id="product_1">
        <div className="block-product">
          <div
            className="section-title"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link
              to={
                info.category && info.category.length > 0
                  ? `/san-pham?danh-muc=${info.category[0].slug}-${info.category[0].id}`
                  : "#"
              }
            >
              <h3 style={{ paddingLeft: "0" }}>{props.title}</h3>
            </Link>

            {info.category && info.category.length > 0 && (
              <Link
                to={
                  info.category && info.category.length > 0
                    ? `/san-pham?danh-muc=${info.category[0].slug}-${info.category[0].id}`
                    : "#"
                }
                style={{ paddingRight: "8px" }}
              >
                <span style={{ paddingLeft: "0" }}>Xem tất cả</span>
              </Link>
            )}
            {props.title === "Sản phẩm mới" && (
              <Link
                to={"/san-pham?descending=true&sort_by=created_at"}
                style={{ paddingRight: "8px" }}
              >
                <span style={{ paddingLeft: "0" }}>Xem tất cả</span>
              </Link>
            )}
          </div>
          <Slider {...settings1}>
            {firstLine.map((v, i) => (
              <ItemProduct key={i} product={v} />
            ))}
          </Slider>

          <Slider {...settings2}>
            {secondLine.map((v, i) => (
              <ItemProduct key={i} product={v} />
            ))}
          </Slider>
        </div>
      </div>
    </Product3Styles>
  );
}
