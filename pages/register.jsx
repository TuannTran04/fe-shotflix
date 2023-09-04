import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { registerOTP } from "../store/apiRequest";

const RegisterPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    username: yup.string().min(6).max(20).required(),
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
  const [username, email, password, confirmPassword] = watch([
    "username",
    "email",
    "password",
    "confirmPassword",
  ]);

  console.log(username, email, password);

  // const onSubmit = async (dataForm) => {
  //   const base_url = process.env.NEXT_PUBLIC_URL;
  //   // console.log(">>> form register <<<", data);
  //   if (!verifyOTP) {
  //     try {
  //       const response = await axios.post(
  //         `${base_url}/api/v1/auth/register`,
  //         dataForm
  //       );
  //       console.log(response);
  //       if (response.status === 200) {
  //         setVerifyOTP(true);
  //         console.log(response.data);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       if (error.response.data.mes.code === 11000) {
  //         toast(
  //           `${Object.keys(error.response.data.mes.keyValue)[0]} đã tồn tại`
  //         );
  //       }
  //       if (error?.response?.data?.code == 404) {
  //         toast(error?.response?.data?.mes);
  //         toast(error?.response?.data?.mes?.mes);
  //       }
  //     }
  //   } else {
  //     try {
  //       const response = await axios.post(
  //         `${base_url}/api/v1/auth/register/verify`,
  //         dataForm
  //       );
  //       console.log(">>> Response REGISTER VERIFY <<<", response);
  //       const data = response.data;
  //       console.log(data);
  //       toast(data?.mes);
  //     } catch (error) {
  //       console.log(error);
  //       if (error.response.data.mes.code === 11000) {
  //         toast(
  //           `${Object.keys(error.response.data.mes.keyValue)[0]} đã tồn tại`
  //         );
  //       }
  //       if (error?.response?.data?.code == 404) {
  //         toast(error?.response?.data?.mes);
  //         toast(error?.response?.data?.mes?.mes);
  //       }
  //     }
  //   }
  // };

  const onSubmit = async (dataForm) => {
    registerOTP(dataForm, verifyOTP, setVerifyOTP, dispatch, router, toast);
  };

  const reGeneratorOTP = async () => {
    const base_url = process.env.NEXT_PUBLIC_URL;
    const dataForm = { username, email, password };
    try {
      if ((username, email, password)) {
        const response = await axios.post(
          `${base_url}/api/v1/auth/register`,
          dataForm
        );
        console.log(">>> Response REGISTER <<<", response);
        if (response.status === 200) {
          setVerifyOTP(true);
          console.log(response.data);
          toast(response?.data?.message);
        }
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.mes.code === 11000) {
        toast(`${Object.keys(error.response.data.mes.keyValue)[0]} đã tồn tại`);
      }

      if (error?.response?.data?.code == 404) {
        toast(error?.response?.data?.mes);
        toast(error?.response?.data?.mes?.mes);
      }
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Tạo tài khoản
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
                  Nhập username
                </label>

                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Tên đăng nhập..."
                  {...register("username", { required: true })}
                />
                {
                  <span className="text-red-500">
                    {errors.username?.message}
                  </span>
                }
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

              <div className="flex items-start">
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
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
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
              <button
                type="submit"
                className="w-full text-white bg-black hover:opacity-70 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Đăng ký
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Bạn đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Đăng nhập
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

export default RegisterPage;
