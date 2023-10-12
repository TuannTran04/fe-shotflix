import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAxios } from "../../utils/createInstance";
import { useState } from "react";
import { logOutSuccess } from "../../store/authSlice";
import Link from "next/link";
import axios from "axios";
import {
  deleteNotifyById,
  getNotify,
  getUnreadNotifyCount,
  updateNotifyRead,
} from "../../store/apiRequest";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import { floor } from "lodash";
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
  const notifyRef = useRef();
  console.log(notifyRef.current);

  const router = useRouter();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const id = user?._id;
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user, dispatch, logOutSuccess);

  const [listNoti, setListNoti] = useState([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [totalNotify, setTotalNotify] = useState(0);
  console.log("notify unread >", totalUnread, "notify total >", totalNotify);
  console.log(listNoti);
  const [showNotification, setShowNotification] = useState(false);
  console.log("showNotification", showNotification);
  const [showMenuNotification, setShowMenuCommentNotification] = useState(null);

  const [loadedOnce, setLoadedOnce] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  console.log("loadMore", loadMore);
  console.log("hasMoreData", hasMoreData);

  const [page, setPage] = useState(1);
  const batchSize = 5; // Kích thước lô thông báo
  console.log("page", page);

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

  // handle click out side notifyContainer to hide
  useEffect(() => {
    // Đặt sự kiện lắng nghe chuột trên toàn trang
    const mouseClickHandler = (e) => {
      const notificationContainer = document.querySelector(
        ".notification_container"
      );
      const btnShowNotify = document.querySelector("#btn_show_notify");

      // Kiểm tra xem người dùng đã nhấp chuột ra ngoài phần tử thông báo
      if (
        notificationContainer &&
        !notificationContainer?.contains(e.target) &&
        !btnShowNotify?.contains(e.target) &&
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
  }, []);

  // handle listent event socket realtime
  useEffect(() => {
    // https://be-movie-mt-copy.vercel.app
    socket.current = io("http://localhost:8000", {
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

      // setListNoti([JSON.parse(data), ...listNoti]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [socket.current]);

  // handle scroll notifyContainer to load more
  const handleScroll = useCallback(() => {
    if (!notifyRef.current) return;
    const notifyContainer = notifyRef.current;
    const { scrollTop, scrollHeight, clientHeight } = notifyContainer;

    if (hasMoreData && scrollHeight - Math.floor(scrollTop) === clientHeight) {
      setLoadMore(true);
      setPage((prev) => prev + 1);
    } else {
      setLoadMore(false);
    }
  }, [notifyRef.current, hasMoreData]);

  useEffect(() => {
    if (notifyRef.current) {
      notifyRef.current?.addEventListener("scroll", handleScroll);

      return () => {
        notifyRef.current?.removeEventListener("scroll", handleScroll);
      };
    }
  }, [notifyRef.current, handleScroll]);

  // handle render notifications
  const fetchData = async (pageNumber) => {
    if (!hasMoreData) return;
    try {
      setLoading(true);
      const notify = await getNotify(id, pageNumber, batchSize);
      console.log("fetchData", notify);

      if (notify?.data.code === 200) {
        const newNotifications = notify.data.data;
        console.log("newNotifications.length", newNotifications.length);

        if (newNotifications.length === 0) {
          setHasMoreData(false);
        } else {
          if (pageNumber === 1) {
            setListNoti(newNotifications);
          } else {
            setListNoti((prev) => [...prev, ...newNotifications]);
          }
          // setTotalUnread(notify.data.count.unreadNotifyCount);
          setLoadMore(false);
        }

        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("alo", loadedOnce);
    if (user && id && notifyRef.current && showNotification && !loadedOnce) {
      fetchData(1);
      // loadedOnce = true;
      setLoadedOnce(true);
    }
  }, [notifyRef, showNotification]);

  useEffect(() => {
    if (loadMore) {
      fetchData(page);
    }
  }, [loadMore, page]);

  // get count unread notify
  useEffect(() => {
    // Gọi API để lấy số lượng thông báo chưa đọc khi component tải lần đầu
    const fetchUnreadNotifyCount = async () => {
      try {
        const response = await getUnreadNotifyCount(id); // Thay thế bằng cuộc gọi API thích hợp
        console.log(response);
        if (response?.data?.code === 200) {
          setTotalUnread(response.data.data.unreadNotifyCount);
          setTotalNotify(response.data.data.totalCount);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (user && id) {
      fetchUnreadNotifyCount();
    }
  }, [listNoti]);

  return (
    <>
      {user ? (
        <div className="relative">
          <button
            id="btn_show_notify"
            className="relative rounded-full bg-white text-black h-11 w-11 z-20"
            title="Thông báo"
            onClick={(e) => {
              e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
              handleShowNotification(); // Hiển thị thông báo
            }}
          >
            {totalUnread > 0 ? (
              <span className="absolute top-[-20%] right-[-10%] h-[30px] w-[30px] text-[14px] font-medium flex justify-center items-center bg-red-600 text-white rounded-[50%]">
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            ) : (
              <></>
            )}
            <i className="fa-regular fa-bell"></i>
          </button>
          {showNotification && (
            <div className="notification_container absolute top-[110%] right-[30%] min-h-[50px] w-[450px] bg-[rgba(0,0,0,.8)] border-2 border-gray-700">
              <div className="px-4 py-2 border-b-[1px] border-gray-400">
                <h2 className="text-base font-semibold text-white">
                  Thông báo ({totalNotify})
                </h2>
              </div>

              <div
                ref={notifyRef}
                className="scroll_search_header max-h-[400px] overflow-y-auto"
              >
                {listNoti.length === 0 ? (
                  loading ? (
                    <></>
                  ) : (
                    <p className="p-2 text-white text-center">
                      Không có thông báo
                    </p>
                  )
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

              {loading && (
                <div role="status" className="flex justify-center items-center">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              )}
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
