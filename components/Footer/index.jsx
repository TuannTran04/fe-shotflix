import Link from "next/link";

export default function Footer() {
  const handleClickToTop = (e) => {
    e.preventDefault();
    window.scroll({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="bg-[#0F0F0FE6] border-t border-gray-500">
        <div className="sm:w-full px-10 text-white mx-auto">
          <section className="border-b border-gray-500 grid grid-cols-1 grid-rows-2 gap-3 pb-2 md:grid-cols-5 md:grid-rows-1 md:gap-4 md:pb-1 md:pt-4 pt-1">
            <div className="md:col-span-4">
              <div>logo</div>
              <div className="mt-6">
                <p className="text-justify text-sm w-full">
                  <Link href="#" className="font-bold text-[#408BEA]">
                    TheMovie
                  </Link>{" "}
                  - Trang xem phim Online với giao diện mới được bố trí và thiết
                  kế thân thiện với người dùng. Nguồn phim được tổng hợp từ các
                  website lớn với đa dạng các đầu phim và thể loại vô cùng phong
                  phú.
                </p>
              </div>
            </div>
            
            <div className="md:mx-auto">
              <h3>Thông tin</h3>
              <ul className="text-[#408BEA] text-sm">
                <div className="grid grid-cols-2 grid-rows-1 gap-3 md:grid-cols-1 md:grid-rows-1">
                  <div>
                    <li className="m-2 ml-0">
                      <Link href="#">Giới thiệu</Link>
                    </li>
                    <li className="m-2 ml-0">
                      <Link href="#">Liên hệ chúng tôi</Link>
                    </li>
                    <li className="m-2 ml-0">
                      <Link href="#">Điều khoản sử dụng</Link>
                    </li>
                  </div>
                  <div>
                    <li className="m-2 ml-0">
                      <Link href="#">Chính sách riêng tư</Link>
                    </li>
                    <li className="m-2 ml-0">
                      <Link href="#">Khiếu nại bản quyền</Link>
                    </li>
                  </div>
                </div>
              </ul>
            </div>
            {/*<div className="grid grid-cols-2 grid-rows-1 gap-3">
              <div >1</div>
              <div >2</div>
          </div>*/}
          </section>
          <section className="flex justify-between items-center py-6 md:mr-10">
            <div>TheStone</div>
            <div>
              <i className=" fab fa-facebook-f p-4 border-r-[1px] border-gray-500"></i>
              <i className="fab fa-twitter p-4 border-r-[1px] border-gray-500"></i>
              <i className="fab fa-instagram p-4 border-r-[1px] border-gray-500"></i>
              <i className="fab fa-youtube p-4 "></i>

              {/*<Link
                href="#"
                className="p-3 bg-gray-500 rounded"
                onClick={handleClickToTop}
              >
                <i className="fas fa-angle-up"></i>
              </Link>*/}
            </div>
          </section>
        </div>
      </footer>
    </>
  );
}
