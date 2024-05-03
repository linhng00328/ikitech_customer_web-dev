import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { constants as c } from "../../constants";
import { appServices } from "../../services/appServices";
import { formatDate, uploadImage, isJson } from "../../helper";
import { appActions } from "../../actions/appActions";
import styled from "styled-components";
const store_code = appServices.store_code;

const ChatStyles = styled.div`
  @media (min-width: 500px) and (max-width: 720px) {
    transform: translateX(130%);
  }
`;
const PopupChatStyles = styled.div`
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #eaeaea;
  margin-bottom: 10px;
  position: absolute;
  right: 0;
  bottom: 100%;
  width: 300px;
  transform: translateX(0);
  animation: translatePopup 1.5s ease-in-out 1;
  .popupChat__main {
    padding: 10px;
    display: flex;
    column-gap: 20px;
    .popupChat__main-content {
      display: flex;
      flex-direction: column;
      row-gap: 8px;
      .popupChat__main-content__title {
        font-size: 16px;
        font-weight: 500;
        text-align: start;
      }
      .popupChat__main-content__image {
        display: flex;
        align-items: center;
        column-gap: 5px;

        img {
          width: 20px;
          height: 20px;
          border-radius: 100rem;
          border: 1px solid #aaaaaa;
        }
        span {
          font-size: 12px;
          color: #979696;
        }
      }
    }
    .popupChat__main-delete {
      flex-shrink: 0;
      span {
        background-color: #dfdfdf;
        width: 20px;
        height: 20px;
        display: flex;
        border-radius: 100rem;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s;
        &:hover {
          background-color: #d1d1d1;
        }
        svg {
          width: 14px;
          height: 14px;
        }
      }
    }
  }
  .popupChat__send {
    padding: 10px 0;
    border-top: 1px solid #eaeaea;
    button {
      cursor: pointer;
      font-weight: 500;
      font-size: 16px;
      animation: scaleMessage 2s ease-in-out infinite;
    }
  }
  @keyframes scaleMessage {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes translatePopup {
    0% {
      transform: translateX(100%);
    }

    100% {
      transform: translateX(0);
    }
  }
  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const ModalImage = ({ image, onSetModalImageUrl }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(0, 0, 0, 0.53)",
        overflowY: "scroll",
        zIndex: "999999",
      }}
      onClick={() => onSetModalImageUrl(null)}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <img
          src={image}
          width="50%"
          alt="Image"
          draggable={false}
          style={{
            objectFit: "cover",
            maxHeight: "60vh",
            maxW: "60vw",
            userSelect: "none",
            userDrag: "none",
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </div>
    </div>
  );
};

export default function Chat(props) {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);
  const appTheme = useSelector((state) => state.app.appTheme);
  const chatStatus = useSelector((state) => state.app.chatStatus);
  const [status, setStatus] = useState(c.LOADING);
  const myInput = useRef(null);
  const [message, setMessage] = useState("");
  const [lastPage, setLastPage] = useState(0);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(0);
  const [linkImages, setLinkImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showPopupIntroChat, setShowPopupIntroChat] = useState(false);
  const [customClass, setCustomClass] = useState({
    container: "",
    messages: "",
  });
  const [modalImageUrl, setModalImageUrl] = useState(null);

  async function handleSendMessage() {
    let link_images = null;
    if (selectedFiles.length) link_images = await handleSendImages();
    if (!message && !selectedFiles.length) return;
    setMessage("");
    setLinkImages([]);
    setSelectedFiles([]);
    setPreviewImages([]);
    let newClass = { ...customClass };
    newClass.messages = "";
    setCustomClass(newClass);
    let date = formatDate(new Date());
    const tokenInfo = JSON.parse(localStorage.getItem("tokenInfo"));
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "customer-token": tokenInfo ? tokenInfo.token : "",
      },
      body: JSON.stringify({
        content: message,
        link_images,
      }),
    };
    return fetch(`${c.API_URL}/customer/${store_code}/messages`, requestOptions)
      .then((res) => res.json())
      .then((json) => {
        if (json.code !== 200) return;

        let newMsg = [...messages];
        newMsg.unshift(json.data);
        setMessages(newMsg);
      })
      .catch((err) => {
        return {};
      });
  }
  function buildMessages(messages = []) {
    const messagesDefault = [
      ...messages,
      {
        content: "Chào bạn! Chúng tôi có thể giúp gì cho bạn?",
        created_at: "",
        customer_id: 2835,
        id: 0,
        is_duplicate: false,
        is_user: true,
        link_images: null,
        product: null,
        updated_at: "",
      },
    ];

    return messagesDefault.map(
      (v, i) =>
        !v.is_duplicate && (
          <div
            className={
              !v.is_user ? "message-container user" : "message-container"
            }
            key={i}
          >
            <div
              style={{
                background: !v.is_user ? appTheme.color_main_1 : "white",
                color: !v.is_user ? "white" : "black",
              }}
              className={v.is_user ? "message user" : "message"}
              key={i}
            >
              <div className="content">{v.content}</div>
              {v.link_images && isJson(v.link_images) && (
                <div className="message-images">
                  {Array.isArray(JSON.parse(v.link_images)) &&
                    JSON.parse(v.link_images).map(
                      (image, i) =>
                        image && (
                          <div
                            className="image"
                            key={i}
                            onClick={() => {
                              setModalImageUrl(image.link_images);
                            }}
                          >
                            <div className="img-container">
                              <img src={image.link_images} alt="" />
                            </div>
                          </div>
                        )
                    )}
                </div>
              )}
              <span>{v.created_at.slice(11, 16)}</span>
            </div>
          </div>
        )
    );
  }

  function removeDuplicate(arr) {
    let newArr = [...arr];
    let indexArr = arr.map((v) => v.id);
    return newArr.map((v, i) => {
      return {
        ...v,
        is_duplicate: i !== indexArr.lastIndexOf(v.id),
      };
    });
  }
  function getMessages() {
    try {
      var tokenInfo = JSON.parse(localStorage.getItem("tokenInfo"));
    } catch (error) {
      var tokenInfo = null;
    }
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "customer-token": tokenInfo ? tokenInfo.token : "",
      },
    };
    return fetch(
      `${c.API_URL}/customer/${store_code}/messages?page=${currentPage + 1}`,
      requestOptions
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.code !== 200) {
          setStatus(c.FAILURE);
          return;
        }
        setStatus(c.SUCCESS);
        setCurrentPage(json.data.current_page);
        if (lastPage === 0) setLastPage(json.data.last_page);
        let newArr = [...messages, ...json.data.data];

        const newArrRemoveDuplicate = removeDuplicate(newArr);

        if (newArrRemoveDuplicate?.length !== 0) {
          const is_hidden_popup_message = getCookie("is_hidden_popup_message");
          if (!is_hidden_popup_message) {
            setShowPopupIntroChat(true);
          }
        }
        setShowPopupIntroChat(true);
        setMessages(newArrRemoveDuplicate);
      })
      .catch((err) => {
        return {};
      });
  }
  function handleKeyEnter(e) {
    if (e.key === "Enter") handleSendMessage();
  }
  function toggleClass() {
    let newClass = chatStatus ? "" : "active";
    dispatch(appActions.setChatStatus(newClass));
    setNewMessage(0);
    setShowPopupIntroChat(false);
  }
  function openBoxChat() {
    dispatch(appActions.setChatStatus("active"));
    setNewMessage(0);
  }
  function handleImageSelect() {
    let newClass = { ...customClass };
    if (!selectedFiles.length) newClass.messages = "";
    else newClass.messages = "with-image";
    setCustomClass(newClass);
  }
  function handleFileSelect(e) {
    if (!e.target.files) return;

    const fileList = Array.prototype.slice.call(e.target.files);
    setSelectedFiles(fileList);
  }
  function handleRemoveFile(index) {
    let newArr = [...selectedFiles];
    newArr.splice(index, 1);

    setSelectedFiles(newArr);
  }

  function handleGetFileInfo(e) {
    let info = {
      width: e.target.naturalWidth,
      height: e.target.naturalHeight,
    };
    let newArr = [...linkImages, info];
    setLinkImages(newArr);
  }
  function handleSendMessageNow() {
    toggleClass();
  }
  function handleRemovePopup() {
    setShowPopupIntroChat(false);
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1); // Thêm 1 ngày
    expirationDate.setHours(0, 0, 0, 0); // Cài đặt về 00:00:00

    const cookieValue = `${encodeURIComponent(
      "is_hidden_popup_message"
    )}=${encodeURIComponent(
      true
    )}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieValue;
  }
  function getCookie(name) {
    const cookieString = document.cookie;
    const cookies = cookieString.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${name}=`)) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }

    return null;
  }

  async function handleSendImages() {
    let cloneArr = [...linkImages];
    for (let i = 0; i < selectedFiles.length; i++) {
      if (typeof cloneArr[i] === "undefined") cloneArr = [...cloneArr, {}];
      cloneArr[i].size = selectedFiles[i].size;
      //cloneArr[i].link_images = "abcdakj";
      let formData = new FormData();
      formData.append("image", selectedFiles[i]);
      let url = await uploadImage(formData);
      cloneArr[i].link_images = url;
    }

    setLinkImages(cloneArr);
    return JSON.stringify(cloneArr);
  }
  var createdSoket = false;
  var dataAfterMess = 0;
  useEffect(
    (e) => {
      if (selectedFiles.length > 0) {
        handleSendMessage();
      }
    },
    [selectedFiles]
  );

  function isFromZalo() {
    // Kiểm tra user agent
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Zalo")) {
      return true;
    }

    // Kiểm tra referrer
    const referrer = document.referrer;
    if (referrer.includes("zalo.com")) {
      return true;
    }

    return false;
  }

  useEffect((e) => {
    if (createdSoket != true) {
      createdSoket = true;
      if (!profile.id) return;
      if (status === c.LOADING) {
        getMessages();
        const userAgentZalo =
          "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11 _zbot";

        if (isFromZalo() || navigator.userAgent == userAgentZalo) {
          console.log("Trang web được mở từ ứng dụng Zalo.");
        } else {
          const socket = io("https://main.doapp.vn:6441");
          socket.on(`chat:message_from_user:${profile.id}`, (data) => {
            setTimeout(function () {
              if (data.id != dataAfterMess) {
                dataAfterMess = data.id;

                openBoxChat();
                setMessages((messages) => [data, ...messages]);
                setNewMessage(newMessage + 1);
              }
            }, 100);
          });
        }
      }
      handleImageSelect();
      setLinkImages([]);
      if (selectedFiles.length) {
        let imageUrl = [];
        imageUrl = selectedFiles.map((v) => URL.createObjectURL(v));
        setPreviewImages(imageUrl);

        return () => URL.revokeObjectURL(imageUrl);
      }
      setPreviewImages([]);
    }
  }, []);
  return profile.id ? (
    <>
      {modalImageUrl && (
        <ModalImage
          image={modalImageUrl}
          onSetModalImageUrl={setModalImageUrl}
        />
      )}
      {showPopupIntroChat ? (
        <PopupChatStyles>
          <div className="popupChat__main">
            <div className="popupChat__main-content">
              <div className="popupChat__main-content__title">
                Xin chào! Chúng tôi có thể giúp gì cho bạn?
              </div>
              <div className="popupChat__main-content__image">
                <img
                  src={
                    appTheme.logo_url
                      ? appTheme.logo_url
                      : process.env.PUBLIC_URL + "./img/user (4).png"
                  }
                  alt="avatar"
                />
                <span>{appTheme.home_title}</span>
              </div>
            </div>
            <div className="popupChat__main-delete" onClick={handleRemovePopup}>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            </div>
          </div>
          <div className="popupChat__send">
            <button
              style={{
                color: appTheme.color_main_1,
              }}
              onClick={handleSendMessageNow}
            >
              Nhắn tin ngay
            </button>
          </div>
        </PopupChatStyles>
      ) : null}

      <a
        onClick={toggleClass}
        className="item facebook-messenger item facebook-messenger"
        target
        id="btn__chat__message"
        style={{ color: "white", backgroundColor: "#3aca3a" }}
      >
        <img
          src="https://i.imgur.com/6M8vn4I.png"
          style={{ width: "28px", height: "28px" }}
        />
      </a>
      <ChatStyles
        className={`chat ${chatStatus == "active" ? "active-parent-chat" : ""}`}
      >
        <div className={`messages-container ${chatStatus}`}>
          <div
            onClick={toggleClass}
            className="title"
            style={{
              cursor: "pointer",
              background: appTheme.color_main_1,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <i class="far fa-comment-dots"></i>
              &nbsp;&nbsp; Hỗ trợ khách hàng&nbsp;
              {newMessage > 0 && (
                <span style={{ fontSize: "14px" }}>{`(${newMessage})`}</span>
              )}
            </div>
            <i
              style={{ fontSize: "12px" }}
              className="fas fa-window-minimize"
            ></i>
          </div>
          <div className={`messages ${customClass.messages}`}>
            <div className="column">
              {buildMessages(messages)}

              {lastPage > currentPage && (
                <button onClick={getMessages}>Xem tin nhắn cũ hơn</button>
              )}
            </div>
          </div>
          <div
            className="message-input"
            style={{ justifyContent: "space-between" }}
            onKeyDown={handleKeyEnter}
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              type="text"
            />
            <button onClick={handleSendMessage}>
              <i
                style={{ color: appTheme.color_main_1 }}
                className="fas fa-paper-plane"
              ></i>
            </button>
            <button
              onClick={() => {
                myInput.current.click();
              }}
            >
              <i
                style={{ color: appTheme.color_main_1 }}
                className="fas fa-camera"
              ></i>
            </button>
          </div>
          <div className="images-upload">
            {previewImages.map((v, i) => (
              <div className="previewed-image" key={i}>
                <button onClick={() => handleRemoveFile(i)}>
                  <i className="fas fa-times"></i>
                </button>
                <div className="image">
                  <div className="img-container">
                    <img src={v} alt="" onLoad={handleGetFileInfo} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <input
          type="file"
          ref={myInput}
          multiple={true}
          onChange={handleFileSelect}
          accept="image/jpeg, image/jpg, image/png"
          style={{ display: "none" }}
        />
      </ChatStyles>
    </>
  ) : (
    <></>
  );
}
