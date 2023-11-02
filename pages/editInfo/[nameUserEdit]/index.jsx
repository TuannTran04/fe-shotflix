import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import LayoutManageInfo from "../../../components/LayoutManageInfo";
import Link from "next/link";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { updateInfoUser } from "../../../store/apiRequest";
import { createAxios } from "../../../utils/createInstance";
import Cookies from "js-cookie";
import ProtectedRoute from "../../../utils/ProtectedRoutes";
import axios from "axios";
import { loginSuccess } from "../../../store/authSlice";

const EditInfoUser = ({ nameUserEdit, categories }) => {
  const schema = yup.object().shape({
    username: yup.string().min(6).max(20).required(),
    email: yup.string().email("Invalid email format").required(),
  });

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const refreshToken = user?.refreshToken;
  // let axiosJWT = createAxios(user, null, null);
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  const userId = user?._id;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const controller = new AbortController();

    console.log(">>> Data EDIT <<<", data);
    const response = await updateInfoUser(
      data,
      accessToken,
      controller,
      dispatch,
      axiosJWT
    );
    console.log(response);

    alert("Chỉnh sửa thành công!");
    if (response) {
      router.push("/user/" + response?.data?.data?.username);
    }
  };

  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setValue("email", user.email);
      setValue("givenName", user.givenName);
      setValue("familyName", user.familyName);
      setValue("national", user.national);
      setValue("avatar", user.avatar);
    }
  }, [user]);

  return (
    <ProtectedRoute>
      <LayoutManageInfo categories={categories}>
        <div className="sm:mt-20 mb-8 min-h-[400px] overflow-hidden">
          <div className="flex justify-start items-center mb-[25px]">
            <div className="h-[130px] w-[130px]">
              <img
                className="block w-full rounded-[50%] object-cover"
                src={user?.avatar || "/unknowAvatar.webp"}
                alt="pic"
              />
            </div>

            <div className="ml-[15px]">
              <div className="mb-[10px] max-w-[300px]">
                <h1 className="w-full text-xl font-semibold text-white whitespace-nowrap text-ellipsis overflow-hidden">
                  {user?.username || nameUserEdit}
                </h1>
              </div>
              <div>
                <Link
                  className="py-[6px] px-[10px] bg-[#567] text-[#c8d4e0] text-sm font-normal tracking-[.075em] rounded-[3px] shadow cursor-pointer select-none hover:bg-[#678] hover:text-white"
                  href="#"
                >
                  Thay avatar
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2 md:col-start-3">
              <h2 className="mb-[20px] text-xl font-normal text-white">
                Chỉnh sửa thông tin
              </h2>
              <form className="" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-[20px]">
                  <label className="block mb-[5px] text-base text-white">
                    Username
                  </label>
                  <input
                    className="block p-[9px] w-full text-[#89a] bg-[#2c3440] shadow-md outline-none rounded focus:bg-white focus:text-black"
                    name="username"
                    type="text"
                    {...register("username", { required: true })}
                  />
                  {
                    <span className="text-red-500">
                      {errors.username?.message}
                    </span>
                  }
                </div>

                <div className="mb-[20px] grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block mb-[5px] text-base text-white">
                      Tên
                    </label>
                    <input
                      className="block p-[9px] w-full text-[#89a] bg-[#2c3440] shadow-md outline-none rounded focus:bg-white focus:text-black"
                      name="givenName"
                      type="text"
                      {...register("givenName", { required: false })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-[5px] text-base text-white">
                      Họ
                    </label>
                    <input
                      className="block p-[9px] w-full text-[#89a] bg-[#2c3440] shadow-md outline-none rounded focus:bg-white focus:text-black"
                      name="familyName"
                      type="text"
                      {...register("familyName", { required: false })}
                    />
                  </div>
                </div>

                <div className="mb-[20px]">
                  <label className="block mb-[5px] text-base text-white">
                    Email
                  </label>
                  <input
                    className="block p-[9px] w-full text-[#89a] bg-[#2c3440] shadow-md outline-none rounded focus:bg-white focus:text-black"
                    name="email"
                    type="email"
                    {...register("email", { required: true })}
                  />
                  {
                    <span className="text-red-500">
                      {errors.email?.message}
                    </span>
                  }
                </div>

                <div className="mb-[20px]">
                  <label className="block mb-[5px] text-base text-white">
                    Quốc gia
                  </label>
                  <input
                    className="block p-[9px] w-full text-[#89a] bg-[#2c3440] shadow-md outline-none rounded focus:bg-white focus:text-black"
                    name="national"
                    type="text"
                    {...register("national", { required: false })}
                  />
                </div>

                <div className="mb-[20px]">
                  <label className="block mb-[5px] text-base text-white">
                    Ảnh đại diện (Link)
                  </label>
                  <input
                    className="block p-[9px] w-full text-[#89a] bg-[#2c3440] shadow-md outline-none rounded focus:bg-white focus:text-black"
                    name="avatar"
                    type="text"
                    placeholder="link ảnh bất kỳ"
                    {...register("avatar", { required: false })}
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    className="py-[9px] px-[16px] tracking-[.085em] text-sm font-bold text-[#f4fcf0] bg-[#00b020] rounded select-none cursor-pointer"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    className="ml-[10px] py-[9px] px-[16px] tracking-[.085em] text-sm font-bold text-[#f4fcf0] bg-[#2daaed] rounded select-none cursor-pointer"
                    onClick={() => {
                      router.back();
                    }}
                  >
                    Trở lại
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </LayoutManageInfo>
    </ProtectedRoute>
  );
};

export default EditInfoUser;

export async function getServerSideProps(context) {
  // console.log(Cookies.parse(context.req.headers.cookie));
  // console.log(context.req.headers.cookie);
  const nameUserEdit = context.params.nameUserEdit;
  let allCategory = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/v1/category`
  );

  return {
    props: { nameUserEdit, categories: allCategory.data.data },
  };
}
