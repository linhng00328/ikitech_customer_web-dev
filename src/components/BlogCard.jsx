import { Link } from "react-router-dom";
import { useRef } from "react";
import { handleImgErr } from "../helper";
import LazyImage from "./LazyImage";
import Lazyload from "react-lazyload";
export default function BlogCard(props) {
  const myLink = useRef(null);
  function handleClick() {
    myLink.current.click();
  }
  return (
    <div className="blog-card" onClick={handleClick}>
      <div style={{ display: "none" }}>
        <Link ref={myLink} to={props.post_url ? `/${props.post_url}` : `/${props.id}`} />
      </div>
      <div className="image">
        <div className="img-container">
        <Lazyload
         offset={100}
                    throttle={300}
                    placeholder={<LazyImage></LazyImage>}
                  >
          <img src={props.img} alt="" onError={handleImgErr} />

                  </Lazyload>
        </div>
      </div>
      <div style = {{padding : "10px"}}>
        <div className="blog-title">
          {props.title}
        </div>
        <div className="date">
          {props.date ? props.date.split(" ")[0] : ""}
        </div>
        <div className="line"></div>
        <div className=""
         style={{
          display: "-webkit-inline-box",
          "-webkit-line-clamp": "2",
          "-webkit-box-orient": "vertical",
          overflow: "hidden",
          width : "100%",
        }}
        dangerouslySetInnerHTML={{ __html: extractContent(props.quote) }}
         >
        </div>
      </div>
    </div>
  )

  function extractContent(s) {
    var span = document.createElement('span');
    span.innerHTML = s;
    var text = span.textContent || span.innerText;
    return text.slice(0, 200);
  };
}