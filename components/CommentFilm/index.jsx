import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import {
  addComment,
  addReplyComment,
  deleteCommentById,
  getComment,
  updateCommentById,
} from "../../store/apiRequest";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import CommentUI from "./components/CommentUI";
import { io } from "socket.io-client";
import { useRef } from "react";
import { useSearchParams } from "next/navigation";
import Loading from "../Loading/Loading";
// const socket = io("http://localhost:8000"); // Thay đổi URL máy chủ của bạn
// const socket = io("https://be-movie-mt-copy.vercel.app", {
//   // withCredentials: true,
//   transports: ["websocket", "polling", "flashsocket"],
// }); // Thay đổi URL máy chủ của bạn

const CommentFilm = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  // console.log(comments);

  console.log(totalComments, comments.length, totalComments != comments.length);

  const [hasScrolled, setHasScrolled] = useState(false);

  const [loading, setLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  console.log("loading >", loading, "hasMoreData >", hasMoreData);

  const [page, setPage] = useState(1);
  const batchSize = 3; // Kích thước lô thông báo
  // console.log("page", page);

  const searchParams = useSearchParams();
  const commentIdScrollTo = searchParams.get("commentId");
  // console.log(commentIdScrollTo);

  useEffect(() => {
    if (commentIdScrollTo && comments.length > 0 && !hasScrolled) {
      const commentElement = document.getElementById(`${commentIdScrollTo}`);
      if (commentElement) {
        commentElement.scrollIntoView({ behavior: "smooth" });
        setHasScrolled(true);
      }
    }
  }, [commentIdScrollTo, comments, hasScrolled]);

  const socket = useRef();
  const router = useRouter();
  // console.log("comment", router);
  const user = useSelector((state) => state.auth.login.currentUser);
  const userId = user?._id;
  const accessToken = user?.accessToken;

  const [textInputs, setTextInputs] = useState({
    commentInput: "",
  });
  const { commentInput } = textInputs;
  // console.log(textInputs);

  const handleChangeInputs = (e) => {
    // console.log([e.target]);
    const { name, value } = e.target;
    setTextInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Add comment
  const handleSubmitCommentInput = async (e) => {
    // e.preventDefault();
    console.log(movieId, commentInput);
    try {
      if (!user || !accessToken) {
        toast("Đăng nhập để sử dụng tính năng này");
        return;
      }
      if (!commentInput) {
        toast("Chưa có nội dung bình luận");
        return;
      }
      const res = await addComment(userId, movieId, commentInput);
      console.log(">>> addComment <<<", res);
      toast(res?.data?.message);
      if (res && res.data?.data) {
        setComments((prevComments) => {
          return [res.data.data, ...prevComments];
        });
        socket.current.emit("new-comment", JSON.stringify(res.data.data));
      }
      setTextInputs((prevState) => ({
        ...prevState,
        commentInput: "",
      }));
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  useEffect(() => {
    // https://be-movie-mt-copy.vercel.app
    socket.current = io(" https://be-movie-mt-copy.vercel.app", {
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

    // Xử lý bình luận ở đây
    socket.current.on("new-comment-user", (data) => {
      console.log("an event");
      setComments((prevComments) => {
        return [JSON.parse(data), ...prevComments];
      });
    });

    socket.current.on("new-reply-comment-user", (data) => {
      console.log(data);
      const dataServer = JSON.parse(data);
      setComments((prevComments) => {
        return prevComments.map((prevComment) => {
          if (prevComment._id === dataServer._id) {
            return dataServer;
          } else {
            return prevComment;
          }
        });
      });
    });
    socket.current.on("comment-updated-user", (updatedComment) => {
      // Cập nhật giao diện người dùng với comment đã được cập nhật
      const dataServer = JSON.parse(updatedComment);

      setComments((prevComments) => {
        return prevComments.map((prevComment) => {
          if (prevComment._id === dataServer._id) {
            return dataServer;
          } else {
            return prevComment;
          }
        });
      });
    });
    socket.current.on("reply-comment-updated-user", (updatedComment) => {
      const dataServer = JSON.parse(updatedComment);
      setComments((prevComments) => {
        return prevComments.map((prevComment) => {
          if (prevComment._id === dataServer._id) {
            return dataServer;
          } else {
            return prevComment;
          }
        });
      });
    });

    socket.current.on("comment-deleted-user", (commentId) => {
      // Cập nhật giao diện người dùng để xóa comment với commentId đã được xóa
      const dataServer = JSON.parse(commentId);
      setComments((prevComments) => {
        return prevComments.filter((comment) => comment._id !== dataServer);
      });
    });
    socket.current.on("reply-comment-deleted-user", (data) => {
      // Cập nhật giao diện người dùng để xóa reply với commentId đã xóa từ comment với commentParentId tương ứng
      // console.log(commentId, commentParentId);
      const { commentId, commentParentId } = JSON.parse(data);
      console.log(commentId, commentParentId);

      setComments((prevComments) => {
        return prevComments.map((comment) => {
          if (comment._id === commentParentId) {
            // Tạo một bản sao của comment và loại bỏ reply với commentId đã xóa
            const updatedComment = { ...comment };
            updatedComment.replies = updatedComment.replies.filter(
              (reply) => reply._id !== commentId
            );
            return updatedComment;
          } else {
            return comment;
          }
        });
      });
    });

    // Ngắt kết nối Socket.current.IO khi component unmount (trang bị đóng hoặc chuyển sang trang khác)
    return () => {
      socket.current.disconnect();
    };
  }, []); // [] đảm bảo hiệu chỉnh này chỉ chạy một lần sau khi trang được tải

  // Load more comment
  const handleLoadMoreCmt = () => {
    if (hasMoreData && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const renderComments = async () => {
      try {
        setLoading(true);
        console.log("siuu");

        let comments = await getComment(movieId, page, batchSize);

        if (comments.data.code === 200) {
          const newComments = comments.data.data;
          console.log("newComments", comments);
          setTotalComments(comments.data.count);

          if (newComments.length === 0) {
            setHasMoreData(false);
            setLoading(false);
          } else {
            if (page === 1) {
              setComments(newComments);
            } else {
              setComments((prev) => [...prev, ...newComments]);
            }

            setLoading(false);
          }
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    if (movieId && hasMoreData) {
      renderComments();
    }
  }, [movieId, page, hasMoreData]);

  // useEffect(() => {
  //   const initFacebookSDK = () => {
  //     if (window.FB) {
  //       window.FB.XFBML.parse();
  //     }

  //     // let { language } = this.props;
  //     // let locale = language === LANGUAGES.VI ? "vi_VN" : "en_US";

  //     window.fbAsyncInit = function () {
  //       window.FB.init({
  //         appId: process.env.REACT_APP_FACEBOOK_APP_ID,
  //         cookie: true,
  //         xfbml: true,
  //         version: "v2.5",
  //       });
  //     };

  //     // Load the SDK asynchronously
  //     (function (d, s, id) {
  //       var js,
  //         fjs = d.getElementsByTagName(s)[0];
  //       if (d.getElementById(id)) return;
  //       js = d.createElement(s);
  //       js.id = id;
  //       js.src = `//connect.facebook.net/vi_VN/sdk.js`;
  //       fjs.parentNode.insertBefore(js, fjs);
  //     })(document, "script", "facebook-jssdk");
  //   };

  //   initFacebookSDK();
  // }, []); // Empty dependency array ensures the effect runs once on mount

  return (
    <div className="mt-[40px] lg:mt-[70px] p-3 lg:p-6 bg-[#333333]">
      {/* <div
        className="fb-comments h-[700px] w-full overflow-y-auto"
        data-href="https://developers.facebook.com/docs/plugins/comments#configurator"
        // data-href={`${process.env.NEXT_PUBLIC_URL}/${router.asPath}`}
        data-width="100%"
        data-numposts="5"
        data-order-by="reverse_time"
        data-lazy="true"
      ></div> */}

      <div className="flex items-center h-[50px] mb-5">
        <div className="relative h-full w-[50px] mr-2.5 border-[2px] border-[#444] flex items-center justify-center">
          {user && user?.avatar ? (
            <Image
              className="absolute block object-cover w-full h-full"
              src={user?.avatar}
              alt="pic"
              layout="fill"
            />
          ) : (
            <i className="fa-solid fa-user inline-block text-xl text-white"></i>
          )}
        </div>
        <div className="h-full flex-1 flex border-[1px] border-[#444]">
          <input
            className="w-full bg-[#2D2D2D] focus:outline-0 focus:outline-none px-3.5 text-white"
            type="text"
            name="commentInput"
            value={commentInput}
            onChange={handleChangeInputs}
            autoComplete="off"
            placeholder="Bình luận..."
          />
          <button
            className="text-black  w-11 border-[2px] border-[#444]"
            onClick={handleSubmitCommentInput}
          >
            <i className="fa-solid fa-paper-plane text-white"></i>
          </button>
        </div>
      </div>

      <div className="">
        {/* {comments?.map((item, i) =>
          item.replies && item.replies.length > 0
            ? UIComment(
                item,
                item.replies.map((reply, i) => UIComment(reply))
              )
            : UIComment(item)
        )} */}
        {comments.length > 0 ? (
          comments?.map((item, i) =>
            item.replies && item.replies.length > 0 ? (
              <CommentUI
                key={item._id}
                movieId={movieId}
                item={item}
                isLastItem={i !== comments.length - 1}
                setComments={setComments}
                socket={socket?.current}
                replyComment={item.replies.map((reply, i) => (
                  <CommentUI
                    key={reply._id}
                    movieId={movieId}
                    item={reply}
                    isLastItem={i !== item.replies.length - 1}
                    commentParentId={item._id}
                    setComments={setComments}
                    socket={socket?.current}
                  />
                ))}
              />
            ) : (
              <CommentUI
                key={item._id}
                movieId={movieId}
                item={item}
                isLastItem={i !== comments.length - 1}
                setComments={setComments}
                socket={socket?.current}
              />
            )
          )
        ) : loading ? (
          <Loading />
        ) : (
          <p className="p-2 text-white text-center">Không có bình luận nào</p>
        )}

        {comments.length > 0 && loading ? <Loading /> : <></>}
      </div>

      {comments.length > 0 &&
      totalComments !== comments.length &&
      hasMoreData &&
      !loading ? (
        <div
          className="py-2 flex justify-center items-center cursor-pointer hover:bg-[rgba(255,255,255,0.5)] select-none"
          onClick={handleLoadMoreCmt}
        >
          <span className="italic text-xs text-white">
            Tải thêm bình luận?...
          </span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default memo(CommentFilm);
