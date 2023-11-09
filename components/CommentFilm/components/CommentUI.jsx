import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  addNotify,
  addReplyComment,
  deleteCommentById,
  deleteReplyCommentById,
  updateCommentById,
  updateReplyCommentById,
} from "../../../store/apiRequest";
import { memo } from "react";
import { io } from "socket.io-client";

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

const CommentUI = ({
  movieId,
  commentParentId,
  item,
  replyComment,
  isLastItem,
  isReplyCmt,
  setComments,
  // socket,
}) => {
  const router = useRouter();
  // console.log("comment", router);
  const user = useSelector((state) => state.auth.login.currentUser);
  const userId = user?._id;
  const accessToken = user?.accessToken;

  const [textInputs, setTextInputs] = useState({
    updatedText: "",
    replyText: "",
  });
  const { updatedText, replyText } = textInputs;
  // console.log(textInputs);

  const [showMenuCommentId, setShowMenuCommentId] = useState(null);
  const [showEditingCommentId, setShowEditingCommentId] = useState(null);
  const [showInputReply, setShowInputReply] = useState(null);
  const [showReplyCmt, setShowReplyCmt] = useState(false);

  const [pageReplyCmt, setPageReplyCmt] = useState(1);
  // console.log(pageReplyCmt);
  const [hasMoreReplyCmt, setHasMoreReplyCmt] = useState(true);
  const [loadOnceReplyCmt, setLoadOnceReplyCmt] = useState(false);

  const [loadingReplyCmt, setLoadingReplyCmt] = useState(false);
  console.log(loadingReplyCmt);

  const handleChangeInputs = (e) => {
    // console.log([e.target]);
    const { name, value } = e.target;
    setTextInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Show actions comment (edit, delete)
  const handleShowMenuComment = (commentId) => {
    if (showMenuCommentId === commentId) {
      setShowMenuCommentId("");
    } else {
      setShowMenuCommentId(commentId);
      setShowEditingCommentId(null);
      console.log("toggle", commentId);
    }
  };

  // Handle load more reply comment
  const handleLoadMoreReplyCommentOnce = async (commentId) => {
    // console.log(commentId);
    const base_url = process.env.NEXT_PUBLIC_URL;
    try {
      setShowReplyCmt((prev) => !prev);
      if (loadOnceReplyCmt) {
        return;
      }
      setLoadingReplyCmt(true);

      const res = await axios.get(
        `${base_url}/api/v1/comment/${commentId}/reply-comment?page=${pageReplyCmt}`
      );
      console.log(">>> handleLoadMoreReplyComment <<<", res);

      if (res.data.data.length === 0) {
        setHasMoreReplyCmt(false);
        setLoadingReplyCmt(false);
      }

      if (res.data.code === 200 && res.data.data.length > 0) {
        setComments((prevComments) =>
          prevComments.map((prevComment) => {
            if (prevComment._id === commentId) {
              return {
                ...prevComment,
                replies: [...prevComment.replies, ...res.data.data],
              };
            }
            return prevComment;
          })
        );
        setPageReplyCmt((prev) => prev + 1);
        setLoadOnceReplyCmt(true);
        setLoadingReplyCmt(false);
      }
    } catch (err) {
      console.log(err);
      setLoadingReplyCmt(false);
    }
  };
  const handleLoadMoreReplyComment = async (commentId) => {
    // console.log(commentId);
    const base_url = process.env.NEXT_PUBLIC_URL;
    try {
      setLoadingReplyCmt(true);

      const res = await axios.get(
        `${base_url}/api/v1/comment/${commentId}/reply-comment?page=${pageReplyCmt}`
      );
      console.log(">>> handleLoadMoreReplyComment <<<", res);

      if (res.data.data.length === 0) {
        setHasMoreReplyCmt(false);
        setLoadingReplyCmt(false);
      }

      if (res.data.code === 200 && res.data.data.length > 0) {
        setComments((prevComments) =>
          prevComments.map((prevComment) => {
            if (prevComment._id === commentId) {
              return {
                ...prevComment,
                replies: [...prevComment.replies, ...res.data.data],
              };
            }
            return prevComment;
          })
        );
        setPageReplyCmt((prev) => prev + 1);
        setLoadingReplyCmt(false);
      }
    } catch (err) {
      console.log(err);
      setLoadingReplyCmt(false);
    }
  };

  // Reply comment
  const handleShowInputReply = (commentReplyId) => {
    if (showInputReply === commentReplyId) {
      setShowInputReply("");
      setTextInputs((prevState) => ({
        ...prevState,
        replyText: "",
      }));
    } else {
      setShowInputReply(commentReplyId);
    }
  };
  const handleHideInputReply = () => {
    setShowInputReply(null);
    setTextInputs((prevState) => ({
      ...prevState,
      replyText: "",
    }));
  };
  const handleAddReplyComment = async (commentId, replyText) => {
    console.log("handleAddReplyComment", commentId, userId, replyText);
    try {
      if (!user || !accessToken) {
        toast("Đăng nhập để sử dụng tính năng này");
        return;
      }
      if (!replyText) {
        toast("Chưa có nội dung bình luận");
        return;
      }

      const res = await addReplyComment(userId, movieId, commentId, replyText);
      console.log(">>> handleAddReplyComment <<<", res.data?.data);

      if (res && res.data?.data) {
        setComments((prevComments) => {
          return prevComments.map((prevComment) => {
            if (prevComment._id === commentId) {
              return {
                ...prevComment,
                replies: [...prevComment.replies, res.data?.data],
              };
            } else {
              return prevComment;
            }
          });
        });
        setShowReplyCmt(true);
        // socket.emit(
        //   "new-reply-comment",
        //   JSON.stringify(res.data.data),
        //   JSON.stringify(res.data.commentId)
        // );

        if (userId != item?.user._id) {
          const resAddNotify = await addNotify(
            userId, // sender
            item?.user._id,
            movieId,
            // commentId, //cmt parent
            item._id, //cmt ma` minh` rep
            replyText
          );
          console.log(">>> resAddNotify <<<", resAddNotify);

          if (resAddNotify && resAddNotify.data?.data) {
            console.log("emit", resAddNotify.data?.data);

            // socket.emit(
            //   "new-notify-comment",
            //   JSON.stringify(resAddNotify.data.data),
            //   resAddNotify.data?.data.recipient._id
            // );
          }
        }
      }
      toast(res?.data?.message);
      setShowInputReply(null);
      setTextInputs((prevState) => ({
        ...prevState,
        replyText: "",
      }));
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };
  const updateReplyComment = async (commentId, text) => {
    console.log("updateReplyComment", commentId, commentParentId, text);
    try {
      if (!user || !accessToken) {
        toast("Đăng nhập để sử dụng tính năng này");
        return;
      }

      const res = await updateReplyCommentById(
        userId,
        movieId,
        commentId,
        commentParentId,
        text
      );

      console.log(">>> updateComment <<<", res);

      if (res && res.data?.data) {
        setComments((prevComments) => {
          return prevComments.map((prevComment) => {
            if (prevComment._id === res.data?.data._id) {
              return res.data?.data;
            } else {
              return prevComment;
            }
          });
        });
        // socket.emit("reply-comment-updated", JSON.stringify(res.data.data));
      }
      toast(res?.data?.message);
      setShowEditingCommentId(null);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  // Edit comment
  const handleShowInputEdit = (commentId, text) => {
    setShowEditingCommentId(commentId);
    setTextInputs((prevState) => ({
      ...prevState,
      updatedText: text,
    }));
    setShowMenuCommentId(null);
  };
  const updateComment = async (commentId, text) => {
    console.log("updateComment", commentId, text);
    try {
      if (!user || !accessToken) {
        toast("Đăng nhập để sử dụng tính năng này");
        return;
      }

      const res = await updateCommentById(userId, movieId, commentId, text);
      console.log(">>> updateComment <<<", res);

      if (res && res.data?.data) {
        setComments((prevComments) => {
          return prevComments.map((prevComment) => {
            if (prevComment._id === res.data?.data._id) {
              return res.data?.data;
            } else {
              return prevComment;
            }
          });
        });
        // socket.emit("comment-updated", JSON.stringify(res.data.data));
      }

      toast(res?.data?.message);
      setShowEditingCommentId(null);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  // DELETE COMMENT
  const deleteComment = async (commentId) => {
    console.log("deleteComment", commentId);
    try {
      const res = await deleteCommentById(commentId);
      console.log(">>> deleteComment <<<", res);

      if (res && res.data?.data) {
        setComments((prevComments) => {
          return prevComments.filter(
            (comment) => comment._id !== res.data?.data
          );
        });
        // socket.emit("comment-deleted", JSON.stringify(res.data.data));
      }
      toast(res?.data?.message);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };
  // DELETE COMMENT
  const deleteReplyComment = async (commentId) => {
    console.log("deleteReplyComment", commentId);
    try {
      const res = await deleteReplyCommentById(commentId, commentParentId);
      console.log(">>> deleteComment <<<", res);

      if (res && res.data?.data) {
        setComments((prevComments) => {
          return prevComments.map((comment) => {
            if (comment._id === res.data?.data.commentParentId) {
              // Tạo một bản sao của comment và loại bỏ reply với commentId đã xóa
              const updatedComment = { ...comment };
              updatedComment.replies = updatedComment.replies.filter(
                (reply) => reply._id !== res.data?.data.commentId
              );
              return updatedComment;
            } else {
              return comment;
            }
          });
        });
        // socket.emit("reply-comment-deleted", JSON.stringify(res.data.data));
      }

      toast(res?.data?.message);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  return (
    <div
      id={item._id}
      className={`${isLastItem && !isReplyCmt ? "mb-4" : "mb-0"} ${
        isLastItem && isReplyCmt ? "mb-2" : "mb-0"
      } flex min-h-[60px]`}
    >
      <div
        // className="relative w-[50px] h-[50px] mr-2.5 "
        className={`${
          !isReplyCmt ? "w-[50px] h-[50px]" : "w-[35px] h-[35px]"
        } relative mr-2.5`}
      >
        {item.user?.avatar ? (
          <Image
            className="absolute block object-cover w-full h-full"
            src={item.user?.avatar}
            alt="pic"
            layout="fill"
          />
        ) : (
          <div
            // className="relative h-full w-[50px] mr-2.5 border-[2px] border-[#444] flex items-center justify-center"
            className={`${
              !isReplyCmt ? "w-[50px]" : "w-[35px]"
            } relative h-full mr-2.5 border-[2px] border-[#444] flex items-center justify-center`}
          >
            <i className="fa-solid fa-user inline-block text-xl text-white"></i>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-start">
          <h4
            className={`${
              !isReplyCmt ? "" : "text-[12px]"
            } text-[#0285b5] font-semibold`}
          >
            {item.user?.username}
            {item.user?.isAdmin ? (
              <span
                className={`${
                  !isReplyCmt ? "text-[8px]" : "text-[6px]"
                } ml-2 p-[1px] tracking-[1px] italic text-white border-[1px] border-cyan-600 bg-cyan-600 rounded-sm`}
              >
                admin
              </span>
            ) : (
              <></>
            )}
          </h4>

          {userId === item.user?._id ? (
            <span className="relative flex justify-center text-white">
              <i
                className="fa-solid fa-ellipsis-vertical px-2 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleShowMenuComment(item._id);
                }}
              ></i>
              {item._id === showMenuCommentId && (
                <span className="py-1 absolute top-0 right-[18px] bg-white min-h-[50px] min-w-[100px] z-40 select-none">
                  <span
                    className="px-2 flex justify-start items-center hover:bg-[rgba(0,0,0,0.3)] cursor-pointer"
                    onClick={() => handleShowInputEdit(item._id, item.text)}
                  >
                    <p className="flex-1 w-full whitespace-nowrap text-black">
                      Chỉnh sửa
                    </p>
                  </span>

                  {!commentParentId ? (
                    <span
                      className="px-2 flex justify-start items-center mt-1 hover:bg-[rgba(0,0,0,0.3)] cursor-pointer"
                      onClick={() => deleteComment(item._id)}
                    >
                      <p className="flex-1 w-full whitespace-nowrap text-black">
                        Xóa
                      </p>
                    </span>
                  ) : (
                    <span
                      className="px-2 flex justify-start items-center mt-1 hover:bg-[rgba(0,0,0,0.3)] cursor-pointer"
                      onClick={() => deleteReplyComment(item._id)}
                    >
                      <p className="flex-1 w-full whitespace-nowrap text-black">
                        Xóa
                      </p>
                    </span>
                  )}
                </span>
              )}
            </span>
          ) : (
            <></>
          )}
        </div>
        {showEditingCommentId === item._id ? (
          <div className="bg-[rgba(0,0,0,0.1)]">
            <textarea
              name="updatedText"
              className="p-2 w-full outline-none"
              placeholder="Bình luận..."
              value={updatedText}
              onChange={handleChangeInputs}
            />
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="py-[9px] px-[16px] tracking-[.085em] text-sm font-bold text-[#f4fcf0] bg-[#DD0C39] rounded select-none cursor-pointer"
                onClick={() => setShowEditingCommentId(null)}
              >
                Hủy
              </button>
              {!commentParentId ? (
                <button
                  type="button"
                  className="ml-[10px] py-[9px] px-[16px] tracking-[.085em] text-sm font-bold text-[#f4fcf0] bg-[#00b020] rounded select-none cursor-pointer"
                  onClick={() => updateComment(item._id, updatedText)}
                >
                  Lưu
                </button>
              ) : (
                <button
                  type="button"
                  className="ml-[10px] py-[9px] px-[16px] tracking-[.085em] text-sm font-bold text-[#f4fcf0] bg-[#1d4224] rounded select-none cursor-pointer"
                  onClick={() => updateReplyComment(item._id, updatedText)}
                >
                  Lưu
                </button>
              )}
            </div>
          </div>
        ) : (
          <p
            // className="break-words text-white my-1"
            className={`${
              !isReplyCmt ? "" : "text-xs"
            } break-words text-white my-0`}
          >
            {item.text}
          </p>
        )}
        <div className="text-sm text-white">
          <span
            className="mr-[15px] cursor-pointer hover:underline"
            onClick={(e) => {
              handleShowInputReply(item._id);
            }}
          >
            <i className="fa-solid fa-reply mr-[4px]"></i>
            <span className={`${!isReplyCmt ? "text-[12px]" : "text-[10px]"} `}>
              trả lời
            </span>
          </span>
          <span className="mr-[15px]">
            <i className="fa-regular fa-clock mr-[4px]"></i>
            <span className={`${!isReplyCmt ? "text-[12px]" : "text-[10px]"} `}>
              {timeAgo(new Date(item.createdAt))}
            </span>
          </span>
        </div>
        {showInputReply === item._id ? (
          <div className="mt-2 flex">
            <div className="relative w-[50px] h-[50px] mr-2.5 ">
              {user ? (
                <Image
                  className="absolute block object-cover w-full h-full"
                  src={user?.avatar}
                  alt="pic"
                  layout="fill"
                />
              ) : (
                <div className="relative h-full w-[50px] mr-2.5 border-[2px] border-[#444] flex items-center justify-center">
                  <i className="fa-solid fa-user inline-block text-xl text-white"></i>
                </div>
              )}
            </div>
            <div className="flex-1 bg-[rgba(0,0,0,0.1)]">
              <textarea
                name="replyText"
                className="p-2 w-full outline-none"
                autoFocus
                placeholder="Bình luận..."
                value={replyText}
                onChange={handleChangeInputs}
              />
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="py-[9px] px-[16px] tracking-[.085em] text-sm font-bold text-[#f4fcf0] bg-[#DD0C39] rounded select-none cursor-pointer"
                  onClick={(e) => {
                    handleHideInputReply();
                  }}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="ml-[10px] py-[9px] px-[16px] tracking-[.085em] text-sm font-bold text-[#f4fcf0] bg-[#00b020] rounded select-none cursor-pointer"
                  onClick={() =>
                    handleAddReplyComment(
                      commentParentId ? commentParentId : item._id,
                      replyText
                    )
                  }
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {/* //LOAD MORE COMMENT CON */}
        {!isReplyCmt && item.repliesCount > 0 && (
          <span
            className="inline-block text-[11px] text-[#0285b5] cursor-pointer italic hover:underline"
            onClick={() => handleLoadMoreReplyCommentOnce(item._id)}
          >
            <i className="fa-solid fa-chevron-down mr-[6px] text-[#0285b5]"></i>
            <span>{item.repliesCount} phản hồi</span>
          </span>
        )}

        {/* //COMMENT CON */}
        {replyComment && showReplyCmt ? (
          <div className="mt-4">{replyComment}</div>
        ) : (
          <></>
        )}

        {/* //LOAD MORE COMMENT CON */}
        {!isReplyCmt &&
          item.repliesCount > 0 &&
          hasMoreReplyCmt &&
          showReplyCmt &&
          !loadingReplyCmt && (
            <span
              className="inline-block text-[11px] text-[#0285b5] cursor-pointer italic hover:underline"
              onClick={() => handleLoadMoreReplyComment(item._id)}
            >
              <i className="fa-solid fa-message mr-[6px] text-[#0285b5]"></i>
              <span>Xem thêm phản hồi</span>
            </span>
          )}
      </div>
    </div>
  );
};

export default memo(CommentUI);
