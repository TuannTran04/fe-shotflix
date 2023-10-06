import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  addComment,
  addReplyComment,
  deleteCommentById,
  updateCommentById,
} from "../../store/apiRequest";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import CommentUI from "./components/CommentUI";
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

const CommentFilm = ({ movieId }) => {
  const router = useRouter();
  // console.log("comment", router);
  const user = useSelector((state) => state.auth.login.currentUser);
  const userId = user?._id;
  const accessToken = user?.accessToken;

  const [textInputs, setTextInputs] = useState({
    commentInput: "",
  });
  const { commentInput } = textInputs;
  console.log(textInputs);

  const [comments, setComments] = useState([]);
  console.log(comments);

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
    // Khởi tạo kết nối Socket.IO tại đây khi trang `/playFilm` được tải lên
    // const socket = io("http://localhost:8000"); // Thay đổi URL máy chủ của bạn
    const socket = io("https://be-movie-mt-copy.vercel.app"); // Thay đổi URL máy chủ của bạn

    // let count = 0;
    // setInterval(() => {
    //   socket.emit("ping", count++);
    // }, 1000);

    // Xử lý bình luận ở đây
    socket.on("new-comment", (data) => {
      setComments((prevComments) => {
        return [data, ...prevComments];
      });
    });

    socket.on("new-reply-comment", (data) => {
      console.log(data);
      setComments((prevComments) => {
        return prevComments.map((prevComment) => {
          if (prevComment._id === data._id) {
            return data;
          } else {
            return prevComment;
          }
        });
      });
    });
    socket.on("comment-updated", (updatedComment) => {
      // Cập nhật giao diện người dùng với comment đã được cập nhật
      setComments((prevComments) => {
        return prevComments.map((prevComment) => {
          if (prevComment._id === updatedComment._id) {
            return updatedComment;
          } else {
            return prevComment;
          }
        });
      });
    });
    socket.on("reply-comment-updated", (updatedComment) => {
      // Tìm và cập nhật comment reply tương ứng trong danh sách comments
      const updatedComments = comments.map((comment) => {
        if (comment._id === updatedComment._id) {
          return updatedComment;
        } else {
          return comment;
        }
      });

      // Cập nhật state của danh sách comments với thông tin đã cập nhật
      setComments(updatedComments);
    });

    socket.on("comment-deleted", (commentId) => {
      // Cập nhật giao diện người dùng để xóa comment với commentId đã được xóa
      setComments((prevComments) => {
        return prevComments.filter((comment) => comment._id !== commentId);
      });
    });
    socket.on("reply-comment-deleted", ({ commentId, commentParentId }) => {
      // Cập nhật giao diện người dùng để xóa reply với commentId đã xóa từ comment với commentParentId tương ứng
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

    // Ngắt kết nối Socket.IO khi component unmount (trang bị đóng hoặc chuyển sang trang khác)
    return () => {
      socket.disconnect();
    };
  }, [comments]); // [] đảm bảo hiệu chỉnh này chỉ chạy một lần sau khi trang được tải

  useEffect(() => {
    console.log("rerender", movieId);
    if (movieId) {
      const renderComments = async () => {
        try {
          let comments = await axios.get(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/comment/${movieId}`
          );

          if (comments.data.code === 200) {
            setComments(comments.data.data);
          }
        } catch (err) {
          console.log(err);
        }
      };
      renderComments();
    }
  }, [movieId]);

  // const UIComment = (item, replyUI) => (
  //   <div key={item._id} className="mb-4 flex min-h-[60px]">
  //     <div className="relative w-[50px] h-[50px] mr-2.5 ">
  //       {user && item.user?.avatar ? (
  //         <Image
  //           className="absolute block object-cover w-full h-full"
  //           src={item.user?.avatar}
  //           alt="pic"
  //           layout="fill"
  //         />
  //       ) : (
  //         <div className="relative h-full w-[50px] mr-2.5 border-[2px] border-[#444] flex items-center justify-center">
  //           <i className="fa-solid fa-user inline-block text-xl text-white"></i>
  //         </div>
  //       )}
  //     </div>
  //     <div className="flex-1 overflow-hidden">
  //       <div className="flex justify-between items-center">
  //         <h4 className="text-[#0285b5] font-semibold">
  //           {item.user?.username}
  //         </h4>

  //         {userId === item.user?._id ? (
  //           <span className="relative flex justify-center text-white">
  //             <i
  //               className="fa-solid fa-ellipsis-vertical cursor-pointer"
  //               onClick={(e) => {
  //                 e.preventDefault();
  //                 e.stopPropagation();
  //                 handleShowMenuComment(item._id);
  //               }}
  //             ></i>
  //             {item._id === showMenuCommentId && (
  //               <span className="py-1 absolute top-1 right-[10px] bg-white min-h-[50px] min-w-[100px] z-40">
  //                 <span
  //                   className="px-2 flex justify-start items-center hover:bg-[rgba(0,0,0,0.3)] cursor-pointer"
  //                   onClick={() => handleShowInputEdit(item._id, item.text)}
  //                 >
  //                   <p className="flex-1 w-full whitespace-nowrap text-black">
  //                     Chỉnh sửa
  //                   </p>
  //                 </span>
  //                 <span
  //                   className="px-2 flex justify-start items-center mt-1 hover:bg-[rgba(0,0,0,0.3)] cursor-pointer"
  //                   onClick={() => deleteComment(item._id)}
  //                 >
  //                   <p className="flex-1 w-full whitespace-nowrap text-black">
  //                     Xóa
  //                   </p>
  //                 </span>
  //               </span>
  //             )}
  //           </span>
  //         ) : (
  //           <></>
  //         )}
  //       </div>

  //       {showEditingCommentId === item._id ? (
  //         <div className="bg-[rgba(0,0,0,0.1)]">
  //           <textarea
  //             name="updatedText"
  //             className="p-2 w-full outline-none"
  //             value={updatedText}
  //             onChange={handleChangeInputs}
  //           />
  //           <div className="flex items-center justify-end">
  //             <button
  //               type="button"
  //               className="py-[9px] px-[16px] tracking-[.085em] text-sm font-bold text-[#f4fcf0] bg-[#DD0C39] rounded select-none cursor-pointer"
  //               onClick={() => setShowEditingCommentId(null)}
  //             >
  //               Hủy
  //             </button>
  //             <button
  //               type="button"
  //               className="ml-[10px] py-[9px] px-[16px] tracking-[.085em] text-sm font-bold text-[#f4fcf0] bg-[#00b020] rounded select-none cursor-pointer"
  //               onClick={() => updateComment(item._id, updatedText)}
  //             >
  //               Lưu
  //             </button>
  //           </div>
  //         </div>
  //       ) : (
  //         <p className="break-words text-white my-1">{item.text}</p>
  //       )}

  //       <div className="text-sm text-white">
  //         <span
  //           className="mr-[15px] cursor-pointer hover:underline"
  //           onClick={(e) => {
  //             handleShowInputReply(item._id);
  //           }}
  //         >
  //           <i className="fa-solid fa-reply mr-[4px]"></i>trả lời
  //         </span>
  //         <span className="mr-[15px]">
  //           <i className="fa-regular fa-clock mr-[4px]"></i>
  //           {timeAgo(new Date(item.createdAt))}
  //         </span>
  //       </div>

  //       {showInputReply === item._id ? (
  //         <div className="mt-2 bg-[rgba(0,0,0,0.1)]">
  //           <textarea
  //             name="replyText"
  //             className="p-2 w-full outline-none"
  //             autoFocus
  //             value={replyText}
  //             onChange={handleChangeInputs}
  //           />
  //           <div className="flex items-center justify-end">
  //             <button
  //               type="button"
  //               className="py-[9px] px-[16px] tracking-[.085em] text-sm font-bold text-[#f4fcf0] bg-[#DD0C39] rounded select-none cursor-pointer"
  //               onClick={(e) => {
  //                 handleHideInputReply();
  //               }}
  //             >
  //               Hủy
  //             </button>
  //             <button
  //               type="button"
  //               className="ml-[10px] py-[9px] px-[16px] tracking-[.085em] text-sm font-bold text-[#f4fcf0] bg-[#00b020] rounded select-none cursor-pointer"
  //               onClick={() => handleAddReplyComment(item._id, replyText)}
  //             >
  //               Lưu
  //             </button>
  //           </div>
  //         </div>
  //       ) : (
  //         <></>
  //       )}

  //       {replyUI ? <div className="mt-4">{replyUI}</div> : <></>}
  //     </div>
  //   </div>
  // );
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
        {comments?.map((item, i) =>
          item.replies && item.replies.length > 0 ? (
            <CommentUI
              key={item._id}
              movieId={movieId}
              item={item}
              isLastItem={i !== comments.length - 1}
              replyComment={item.replies.map((reply, i) => (
                <CommentUI
                  key={reply._id}
                  movieId={movieId}
                  item={reply}
                  isLastItem={i !== item.replies.length - 1}
                  commentParentId={item._id}
                />
              ))}
            />
          ) : (
            <CommentUI
              key={item._id}
              movieId={movieId}
              item={item}
              isLastItem={i !== comments.length - 1}
            />
          )
        )}
      </div>
    </div>
  );
};

export default CommentFilm;

// {/* <div className="flex min-h-[60px]">
// <div className="relative w-[50px] h-[50px] mr-2.5 ">
//   {/* <img
//     className="block object-cover w-full h-full"
//     src={
//       "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-1/329103902_1170346807183250_1864135939632522915_n.jpg?stp=dst-jpg_p100x100&_nc_cat=108&ccb=1-7&_nc_sid=fe8171&_nc_ohc=BwLZsu7s9sEAX-ZFMw6&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.fsgn8-4.fna&oh=00_AfA5YRwD59jyNbPR6-y-VinMzKFtuBzQ2mtjYY_lZNdP4g&oe=6520AADB" ||
//       "/vercel.svg"
//     }
//     alt="pic"
//   /> */}
//   <Image
//     className="block object-cover w-full h-full"
//     src={
//       "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-1/329103902_1170346807183250_1864135939632522915_n.jpg?stp=dst-jpg_p100x100&_nc_cat=108&ccb=1-7&_nc_sid=fe8171&_nc_ohc=BwLZsu7s9sEAX-ZFMw6&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.fsgn8-4.fna&oh=00_AfA5YRwD59jyNbPR6-y-VinMzKFtuBzQ2mtjYY_lZNdP4g&oe=6520AADB" ||
//       "/vercel.svg"
//     }
//     alt="pic"
//     layout="fill"
//     // width={50}
//     // height={50}
//     // loading="lazy"
//     // priority
//   />
// </div>
// <div className="flex-1 ">
//   <h4 className="text-[#0285b5] font-semibold">Tuan Tran</h4>
//   <p className="text-white my-1">phim nhu ccphim nhu cc</p>
//   <div className="text-sm text-white">
//     {/* <span className="mr-[15px] cursor-pointer">
//       <i className="fa-regular fa-thumbs-up mr-[4px]"></i>
//       <i className="fa-solid fa-thumbs-up hidden"></i>
//       10
//     </span>
//     <span className="mr-[15px] cursor-pointer">
//       <i className="fa-regular fa-thumbs-down mr-[4px]"></i>
//       <i className="fa-solid fa-thumbs-down hidden"></i>1
//     </span> */}
//     <span className="mr-[15px] cursor-pointer hover:underline">
//       <i className="fa-solid fa-reply mr-[4px]"></i>trả lời
//     </span>
//     <span className="mr-[15px]">
//       <i className="fa-regular fa-clock mr-[4px]"></i>3 tuần trước
//     </span>
//   </div>
// </div>
// </div> */}
