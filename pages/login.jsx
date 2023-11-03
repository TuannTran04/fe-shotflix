import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/apiRequest";
import Link from "next/link";
import Cookies from "js-cookie";

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  // console.log(">>> router <<<", router);

  const infoForm = useSelector((state) => state.auth.autoFill?.infoForm);
  // console.log(infoForm);

  const schema = yup.object().shape({
    email: yup.string().email().required().max(50).lowercase(),
    password: yup.string().min(6).max(32).required(),
    // currency: yup
    //   .string()
    //   .test("is-number", "Chỉ được nhập số từ 0-9", (value) => {
    //     if (!isNaN(parseInt(value))) {
    //       return true;
    //     }
    //     return false;
    //   })
    //   .test("has-d", 'Phải có chữ "đ" ở cuối cùng', (value) => {
    //     if (value) {
    //       return value.endsWith("đ");
    //     }
    //     return false;
    //   })
    //   .transform((value, originalValue) => {
    //     if (!isNaN(parseInt(originalValue))) {
    //       const intValue = parseInt(originalValue);
    //       return intValue.toLocaleString("vi-VN") + "đ";
    //     }
    //     return value;
    //   }),
    // currency: yup
    //   .string()
    //   .test("is-number", "Chỉ được nhập số từ 0-9", (value) => {
    //     if (!isNaN(parseInt(value))) {
    //       return true;
    //     }
    //     return false;
    //   })
    //   .test("has-d", 'Phải có chữ "đ" ở cuối cùng', (value) => {
    //     if (value) {
    //       return value.endsWith("đ");
    //     }
    //     return false;
    //   })
    //   .transform((value, originalValue) => {
    //     if (!isNaN(parseInt(originalValue))) {
    //       const intValue = parseInt(originalValue);
    //       return intValue.toLocaleString("vi-VN") + "đ";
    //     }
    //     return value;
    //   }),
    // username: yup.string().min(6).max(20).required(),
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [password] = watch(["password"]);

  const onSubmit = async (data) => {
    console.log(">>> Data LOGIN <<<", data);
    login(data, dispatch, router, toast);
  };

  useEffect(() => {
    router.push(`/login`);
  }, []);

  useEffect(() => {
    if (infoForm) {
      const loginFields = {
        // username: infoForm?.username,
        email: infoForm?.email,
        password: infoForm?.password,
      };

      for (const field in loginFields) {
        setValue(field, loginFields[field]);
      }
    }
  }, []);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Đăng nhập tài khoản
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
                  placeholder="name@gmail.com"
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

              {/* <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  currency
                </label>

                <div className="relative">
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="..."
                    {...register("currency")}
                  />
                </div>
                {
                  <span className="text-red-500">
                    {errors.currency?.message}
                  </span>
                }
              </div> */}

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

                <span className="text-sm hover:underline cursor-pointer">
                  <Link href="/forget">Quên mật khẩu</Link>
                </span>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-black hover:opacity-70 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Đăng nhập
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

export default LoginPage;
