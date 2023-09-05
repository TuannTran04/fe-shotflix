import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CommentFilm = () => {
  const router = useRouter();
  console.log("comment", router);
  const [commentInput, setCommentInput] = useState("");

  const handleCommentInput = (e) => {
    const { name, value } = e.target;
    setCommentInput(value);
  };
  const handleSubmitCommentInput = (e) => {
    e.preventDefault();
    console.log(commentInput);
  };

  useEffect(() => {
    const initFacebookSDK = () => {
      if (window.FB) {
        window.FB.XFBML.parse();
      }

      // let { language } = this.props;
      // let locale = language === LANGUAGES.VI ? "vi_VN" : "en_US";

      window.fbAsyncInit = function () {
        window.FB.init({
          appId: process.env.REACT_APP_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: "v2.5",
        });
      };

      // Load the SDK asynchronously
      (function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = `//connect.facebook.net/vi_VN/sdk.js`;
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    };

    initFacebookSDK();
  }, []); // Empty dependency array ensures the effect runs once on mount

  return (
    <div className="mt-[70px] p-6 bg-white">
      <div
        className="fb-comments h-[700px] w-full overflow-y-auto"
        // data-href="https://developers.facebook.com/docs/plugins/comments#configurator"
        data-href={`${process.env.NEXT_PUBLIC_URL}/${router.asPath}`}
        data-width="100%"
        data-numposts="5"
        data-order-by="reverse_time"
        data-lazy="true"
      ></div>
      {/* <div className="flex items-center h-[50px] mb-5">
        <div className="h-full w-[50px] mr-2.5 border-[2px] border-[#444] flex items-center justify-center">
          <i className="fa-solid fa-user inline-block text-xl text-white "></i>
        </div>
        <div className="h-full flex-1 flex border-[1px] border-[#444]">
          <input
            className="w-full bg-[#2D2D2D] focus:outline-0 focus:outline-none px-3.5 text-white"
            type="text"
            name="commentInput"
            value={commentInput}
            onChange={handleCommentInput}
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
        <div className="flex min-h-[60px]">
          <div className="relative w-[50px] h-[50px] mr-2.5 ">
            <Image
              className=""
              src={
                "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/329103902_1170346807183250_1864135939632522915_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=be3454&_nc_ohc=C9lQEIytigIAX-MOAgk&_nc_ht=scontent.fsgn8-4.fna&oh=00_AfACtkyqIXs3rgq-rzqA3G_ASZPwimjCGcSqbXZvAujHLg&oe=64DF5019" ||
                "/vercel.svg"
              }
              alt="error"
              layout="fill"
              // width={50}
              // height={50}
              // loading="lazy"
              priority
            />
          </div>
          <div className="flex-1 ">
            <h4 className="text-[#0285b5] font-semibold">Tuan Tran</h4>
            <p className="text-white my-1">phim nhu ccphim nhu cc</p>
            <div className="text-sm text-white">
              <span className="mr-[15px] cursor-pointer">
                <i className="fa-regular fa-thumbs-up mr-[4px]"></i>
                <i className="fa-solid fa-thumbs-up hidden"></i>
                10
              </span>
              <span className="mr-[15px] cursor-pointer">
                <i className="fa-regular fa-thumbs-down mr-[4px]"></i>
                <i className="fa-solid fa-thumbs-down hidden"></i>1
              </span>
              <span className="mr-[15px] cursor-pointer hover:underline">
                <i className="fa-solid fa-reply mr-[4px]"></i>trả lời
              </span>
              <span className="mr-[15px]">
                <i className="fa-regular fa-clock mr-[4px]"></i>3 tuần trước
              </span>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default CommentFilm;
