import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { constants as c } from "../constants";
import { appServices } from "../services/appServices";
import { formatDate, uploadImage, isJson } from "../helper";
import { appActions } from "../actions/appActions";
const store_code = appServices.store_code;

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
  const [customClass, setCustomClass] = useState({
    container: "",
    messages: "",
  });
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
  function buildMessages(messages) {
    return messages.map(
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
                          <div className="image" key={i}>
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
    const tokenInfo = JSON.parse(localStorage.getItem("tokenInfo"));
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
        setMessages(removeDuplicate(newArr));
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

  function unique(messageId) {
    for (const elment of messages) {
      if (elment.id == messageId) {
        return true;
      }
    }
    return false;
  }

  function handleGetFileInfo(e) {
    let info = {
      width: e.target.naturalWidth,
      height: e.target.naturalHeight,
    };
    let newArr = [...linkImages, info];
    setLinkImages(newArr);
  }
  function removePeople(e) {
    var array = [...this.state.people]; // make a separate copy of the array
    var index = array.indexOf(e.target.value);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ people: array });
    }
  }
  async function handleSendImages() {
    let cloneArr = [...linkImages];
    for (let i = 0; i < selectedFiles.length; i++) {
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
      const userAgentZalo =
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11 _zbot";
      createdSoket = true;
      if (!profile.id) return;
      if (status === c.LOADING) {
        getMessages();
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
    <div className="chat">
      <img
        className="fa-headset"
        src="/img/U0LwC5d.gif"
        onClick={toggleClass}
        alt=""
      />
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
    </div>
  ) : (
    <></>
  );
}
