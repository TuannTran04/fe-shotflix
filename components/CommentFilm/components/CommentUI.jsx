import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  addReplyComment,
  deleteCommentById,
  deleteReplyCommentById,
  updateCommentById,
  updateReplyCommentById,
} from "../../../store/apiRequest";
import { memo } from "react";
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

const CommentUI = ({
  movieId,
  commentParentId,
  item,
  replyComment,
  isLastItem,
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
  console.log(textInputs);

  const [comments, setComments] = useState([]);
  console.log(comments);

  const [showMenuCommentId, setShowMenuCommentId] = useState(null);
  const [showEditingCommentId, setShowEditingCommentId] = useState(null);
  const [showInputReply, setShowInputReply] = useState(null);

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
      console.log(">>> updateComment <<<", res);
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
      toast(res?.data);
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
      toast(res?.data);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  return (
    <div className={`${isLastItem ? "mb-4" : "mb-0"} flex min-h-[60px]`}>
      <div className="relative w-[50px] h-[50px] mr-2.5 ">
        {item.user?.avatar ? (
          <Image
            className="absolute block object-cover w-full h-full"
            src={item.user?.avatar}
            alt="pic"
            layout="fill"
          />
        ) : (
          <div className="relative h-full w-[50px] mr-2.5 border-[2px] border-[#444] flex items-center justify-center">
            <i className="fa-solid fa-user inline-block text-xl text-white"></i>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <h4 className="text-[#0285b5] font-semibold">
            {item.user?.username}
          </h4>

          {userId === item.user?._id ? (
            <span className="relative  flex justify-center text-white">
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
          <p className="break-words text-white my-1">{item.text}</p>
        )}

        <div className="text-sm text-white">
          <span
            className="mr-[15px] cursor-pointer hover:underline"
            onClick={(e) => {
              handleShowInputReply(item._id);
            }}
          >
            <i className="fa-solid fa-reply mr-[4px]"></i>trả lời
          </span>
          <span className="mr-[15px]">
            <i className="fa-regular fa-clock mr-[4px]"></i>
            {timeAgo(new Date(item.createdAt))}
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
                  Lưu
                </button>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {replyComment ? <div className="mt-4">{replyComment}</div> : <></>}
      </div>
    </div>
  );
};

export default memo(CommentUI);
