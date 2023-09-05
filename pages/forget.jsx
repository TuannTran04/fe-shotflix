import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { login } from "../store/apiRequest";
import Link from "next/link";
import Cookies from "js-cookie";
import { forgotPwdUser } from "../services/userRequest";

const ForgetPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const schema = yup.object().shape({
    email: yup.string().email().required().max(50).lowercase(),
    password: yup.string().min(6).max(32).required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [verifyOTP, setVerifyOTP] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [email, password, confirmPassword] = watch([
    "email",
    "password",
    "confirmPassword",
  ]);

  const onSubmit = async (data) => {
    // console.log(">>> Data FORGET <<<", data);
    forgotPwdUser(data, router, dispatch, toast, verifyOTP, setVerifyOTP);
  };

  const reGeneratorOTP = async () => {
    const base_url = process.env.NEXT_PUBLIC_URL;
    const dataForm = { email, password };
    try {
      if ((email, password)) {
        const response = await axios.put(
          `${base_url}/api/v1/auth/forgot-pwd-user`,
          dataForm
        );
        console.log(">>> Response FORGOT <<<", response);
        if (response.status === 200) {
          setVerifyOTP(true);
          console.log(response.data);
          toast(response?.data?.message);
        }
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.code == 400) {
        toast(error?.response?.data?.mes);
      }
      if (error?.response?.data?.code == 404) {
        toast(error?.response?.data?.mes);
      }
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Quên mật khẩu
            </h1>

            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Nhập email
                </label>

                <input
                  type="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  {...register("email", { required: true })}
                />
                {<span className="text-red-500">{errors.email?.message}</span>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Nhập mật khẩu
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="..."
                    {...register("password", { required: true })}
                  />
                  {password && (
                    <i
                      className="fa-solid fa-eye absolute top-[50%] right-[10px] -translate-y-1/2 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    ></i>
                  )}
                </div>
                {
                  <span className="text-red-500">
                    {errors.password?.message}
                  </span>
                }
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Xác nhận lại mật khẩu
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="..."
                    {...register("confirmPassword", { required: true })}
                  />
                  {confirmPassword && (
                    <i
                      className="fa-solid fa-eye absolute top-[50%] right-[10px] -translate-y-1/2 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    ></i>
                  )}
                </div>
                {
                  <span className="text-red-500">
                    {errors.confirmPassword?.message}
                  </span>
                }
              </div>

              {verifyOTP && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Xác nhận OTP từ Gmail
                  </label>
                  <div className="relative">
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="..."
                      {...register("otp", { required: true })}
                    />
                  </div>
                  {<span className="text-red-500">{errors.otp?.message}</span>}
                  <p className="mt-2 text-[13px]">
                    bạn chưa nhận được OTP ?{" "}
                    <span
                      className="underline cursor-pointer"
                      onClick={reGeneratorOTP}
                    >
                      gửi lại
                    </span>
                  </p>
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-light text-gray-500 dark:text-gray-300">
                      Tôi đồng ý{" "}
                      <a
                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        href="#"
                      >
                        Điều khoản
                      </a>
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-black hover:opacity-70 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Lưu
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Bạn chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default ForgetPage;
