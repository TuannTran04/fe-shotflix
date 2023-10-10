import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAxios } from "../../utils/createInstance";
import { useState } from "react";
import { logOutSuccess } from "../../store/authSlice";
import Link from "next/link";
import axios from "axios";
import { deleteNotifyById, updateNotifyRead } from "../../store/apiRequest";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
// const socket = io("http://localhost:8000"); // Thay đổi URL máy chủ của bạn

function timeAgo(createdAt) {
  const currentTime = new Date();
  const timeDifferenceInMilliseconds = currentTime - createdAt;

  if (timeDifferenceInMilliseconds < 1000) {
    return "Vừa mới đây";
  }

  const seconds = Math.floor(timeDifferenceInMilliseconds / 1000);
  if (seconds < 60) {
    return `${seconds} giây trước`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} phút trước`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} giờ trước`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} ngày trước`;
  }

  const months = Math.floor(days / 30);
  return `${months} tháng trước`;
}

const Notification = ({}) => {
  const socket = useRef();

  const router = useRouter();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const id = user?._id;
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user, dispatch, logOutSuccess);

  const [listNoti, setListNoti] = useState([]);
  console.log(listNoti);
  const [showNotification, setShowNotification] = useState(false);
  console.log("showNotification", showNotification);
  const [showMenuNotification, setShowMenuCommentNotification] = useState(null);

  const handleShowNotification = (e) => {
    setShowNotification((prev) => !prev);
  };
  const handleShowMenuNotification = (notifyId) => {
    if (showMenuNotification === notifyId) {
      setShowMenuCommentNotification(null);
    } else {
      setShowMenuCommentNotification(notifyId);
      console.log("toggle", notifyId);
    }
  };
  const deleteNotification = async (notifyId) => {
    console.log("deleteNotification", notifyId);
    try {
      const res = await deleteNotifyById(notifyId);
      console.log(">>> deleteNotification <<<", res);

      if (res && res.data?.data) {
        setListNoti((prevNotify) => {
          return prevNotify.filter((item) => item._id !== res.data?.data);
        });
        // socket.emit("comment-deleted", JSON.stringify(res.data.data));
      }
      toast(res?.data?.message);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  const handleNavToCmt = async (notifyId, commentParentId, slugMovie) => {
    console.log("Ok", notifyId, commentParentId, slugMovie);
    try {
      if (!user || !accessToken) {
        toast("Đăng nhập để sử dụng tính năng này");
        return;
      }

      const res = await updateNotifyRead(notifyId);
      console.log(">>> updateNotifyRead <<<", res);

      if (res && res.data?.data) {
        setListNoti((prevNotify) => {
          const updatedIsRead = prevNotify.map((notify) => {
            if (notify._id === notifyId) {
              return {
                ...notify,
                read: true,
              };
            }
            return notify;
          });
          return updatedIsRead;
        });

        router.push(`/playFilm/${slugMovie}?commentId=${commentParentId}`);
      }
    } catch (error) {
      console.log(err);
      throw new Error(err);
    }
  };

  useEffect(() => {
    // Đặt sự kiện lắng nghe chuột trên toàn trang
    const mouseClickHandler = (e) => {
      const notificationContainer = document.querySelector(
        ".scroll_search_header"
      );

      // Kiểm tra xem người dùng đã nhấp chuột ra ngoài phần tử thông báo
      if (
        notificationContainer &&
        !notificationContainer?.contains(e.target) &&
        e.target !== document.querySelector(".fa-bell").parentNode &&
        e.target !== document.querySelector(".fa-bell")
      ) {
        // Ẩn thông báo khi người dùng nhấp chuột ra ngoài
        setShowNotification(false);
      }
    };

    document.addEventListener("mousedown", mouseClickHandler);

    // Loại bỏ sự kiện lắng nghe khi component bị hủy
    return () => {
      document.removeEventListener("mousedown", mouseClickHandler);
    };
  }, []); // [] đảm bảo sự kiện chỉ được đăng ký một lần khi component được tạo

  useEffect(() => {
    // https://be-movie-mt-copy.vercel.app
    socket.current = io("https://be-movie-mt-copy.vercel.app", {
      query: {
        token: accessToken,
      },
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      },
    });

    socket.current.on("new-notify-comment-user", (data) => {
      console.log("an event new-notify-comment-user", data);
      setListNoti((prevNotify) => {
        return [JSON.parse(data), ...prevNotify];
      });
    });
    // Ngắt kết nối Socket.IO khi component unmount (trang bị đóng hoặc chuyển sang trang khác)
    return () => {
      socket.current.disconnect();
    };
  }, [socket.current]); // [] đảm bảo hiệu chỉnh này chỉ chạy một lần sau khi trang được tải

  useEffect(() => {
    if (user && id) {
      const renderNotifications = async () => {
        try {
          let notify = await axios.get(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/notify/${id}`
          );
          console.log("renderNotifications", notify);

          if (notify?.data.code === 200) {
            setListNoti(notify.data.data);
          }
        } catch (err) {
          console.log(err);
        }
      };
      renderNotifications();
    }
  }, []);

  return (
    <>
      {user ? (
        <div className="relative">
          <button
            className="relative rounded-full bg-white text-black h-11 w-11 z-20"
            title="Thông báo"
            onClick={(e) => {
              e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
              handleShowNotification(); // Hiển thị thông báo
            }}
          >
            {listNoti.length > 0 &&
            listNoti.some((item) => item.read === false) ? (
              <span className="absolute top-[-20%] right-[-10%] h-[30px] w-[30px] text-[14px] font-medium flex justify-center items-center bg-red-600 text-white rounded-[50%]">
                {/* {listNoti.filter((item) => item.read === false).length} */}
                {listNoti.filter((item) => item.read === false).length > 99
                  ? "99+"
                  : listNoti.filter((item) => item.read === false).length}
              </span>
            ) : (
              <></>
            )}
            <i className="fa-regular fa-bell"></i>
          </button>
          {showNotification && (
            <div
              // ref={resultsRef}
              className="scroll_search_header absolute top-[110%] right-[30%] min-h-[50px] max-h-[400px] w-[450px] bg-[rgba(0,0,0,.8)] overflow-y-auto border-2"
            >
              <div className="px-4 py-2 border-b-[1px] border-gray-400">
                <h2 className="text-base font-semibold text-white">
                  Thông báo
                </h2>
              </div>

              <div className="overflow-hidden">
                {listNoti.length === 0 ? (
                  <p className="p-2 text-white text-center">
                    Không có thông báo
                  </p>
                ) : (
                  listNoti.map((item, i) => (
                    <div
                      key={item._id}
                      className="flex overflow-hidden hover:bg-gray-700"
                    >
                      <Link
                        // href={`/playFilm/${item?.movie.slug}`}
                        href="#"
                        className="px-2 py-4 flex w-full"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavToCmt(
                            item._id,
                            item.comment,
                            item?.movie.slug
                          );
                        }}
                      >
                        {!item?.read ? (
                          <span className="mt-[22px] mr-[6px] h-[5px] w-[5px] bg-blue-500 rounded-[50%]"></span>
                        ) : (
                          <span className="mt-[22px] mr-[6px] h-[5px] w-[5px]"></span>
                        )}
                        <span className="mr-[10px] overflow-hidden">
                          <img
                            src={item?.sender.avatar}
                            // src="https://yt3.ggpht.com/oEiclGnYQdKhndmRnTOI-V0qU0pwoijkwSs-dLgTGAzr9zcS6NGS-H3ryfRjhgs3LTZwkLjHyA=s300-c-k-c0x00ffffff-no-rj"
                            alt="pic"
                            className="object-cover w-[48px] h-[48px] rounded-[50%]"
                          />
                        </span>

                        <span className="flex flex-col flex-[2] overflow-hidden">
                          <p className="mb-[8px] text-sm text-white line-clamp-3 whitespace-normal text-ellipsis">
                            <strong>{item?.sender.username}</strong> đã trả lời:
                            "{item?.content}"
                          </p>
                          <p className="text-xs text-gray-400 font-normal">
                            {timeAgo(new Date(item?.createdAt))}
                          </p>
                        </span>

                        <span className="ml-[10px] overflow-hidden">
                          <img
                            src={item?.movie?.photo?.[0]}
                            // src="https://yt3.ggpht.com/oEiclGnYQdKhndmRnTOI-V0qU0pwoijkwSs-dLgTGAzr9zcS6NGS-H3ryfRjhgs3LTZwkLjHyA=s300-c-k-c0x00ffffff-no-rj"
                            alt="pic"
                            className="object-cover w-[100px] h-[50px]"
                          />
                        </span>
                      </Link>

                      <span
                        className="relative flex justify-center items-center h-[40px] w-[30px] select-none cursor-pointer hover:bg-white group"
                        onClick={() => handleShowMenuNotification(item._id)}
                      >
                        <i className="fa-solid fa-ellipsis-vertical text-white group-hover:text-black"></i>

                        {item._id === showMenuNotification && (
                          <span className="py-1 absolute top-0 right-[18px] bg-white min-w-[100px] z-40 select-none">
                            <span
                              className="px-2 flex justify-start items-center hover:bg-[rgba(0,0,0,0.3)] cursor-pointer"
                              onClick={() => deleteNotification(item._id)}
                            >
                              <p className="flex-1 w-full whitespace-nowrap text-black">
                                Xóa
                              </p>
                            </span>
                          </span>
                        )}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Notification;
