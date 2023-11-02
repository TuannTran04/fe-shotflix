import React from "react";

// const testDate = [
//   {
//     cusCreditReqTypeID: 6,
//     dateCreated: "2023-10-16T09:18:45+07:00",
//     orderId: "74948134046",
//     reason: "Hoàn trả tiền công nợ đã bị trừ nhưng chưa áp dụng",
//     sumTotal: 29000,
//   },
//   {
//     dateCreated: "2023-09-21T15:52:47+07:00",
//     sumTotal: -89000,
//     orderId: "73942048174",
//     reason: "Sử dụng tiền công nợ",
//     cusCreditReqTypeID: 5,
//   },
//   {
//     dateCreated: "2023-08-23T23:31:49+07:00",
//     sumTotal: -77000,
//     orderId: "72891090",
//     reason: "Sử dụng tiền công nợ",
//     cusCreditReqTypeID: 4,
//   },
// ];

const ProfileUser = ({ userData }) => {
  console.log("tab profile", userData);

  // const getMonthTitle = (date) => {
  //   const month = date.getMonth() + 1;
  //   const year = date.getFullYear();
  //   return `Tháng ${month}/${year}`;
  // };

  // const groupByMonth = (data) => {
  //   const groupedData = {};
  //   data.forEach((item) => {
  //     const date = new Date(item.dateCreated);
  //     const monthTitle = getMonthTitle(date);
  //     if (!groupedData[monthTitle]) {
  //       groupedData[monthTitle] = [];
  //     }
  //     groupedData[monthTitle].push(item);
  //   });
  //   return groupedData;
  // };

  // const groupedData = groupByMonth(testDate);
  // console.log(groupedData);

  return (
    <div className="min-h-[300px] text-white">
      {/* <h2 className="text-white">profile</h2> */}

      <div>
        <p>
          <span className="mr-2 font-semibold text-lg">Username:</span>{" "}
          {userData.username ? userData.username : "Không có"}
        </p>
        <p>
          <span className="mr-2 font-semibold text-lg">Email: </span>
          {userData.email ? userData.email : "Không có"}
        </p>
        <p>
          <span className="mr-2 font-semibold text-lg">Họ:</span>{" "}
          {userData.familyName ? userData.familyName : "Không có"}
        </p>
        <p>
          <span className="mr-2 font-semibold text-lg">Tên:</span>{" "}
          {userData.givenName ? userData.givenName : "Không có"}
        </p>
        <p>
          <span className="mr-2 font-semibold text-lg">Quốc gia:</span>{" "}
          {userData.national ? userData.national : "Không có"}
        </p>
      </div>
      {/* 
      <br />
      <br />
      <br /> */}

      {/* 
      {Object.keys(groupedData).map((monthTitle) => (
        <div key={monthTitle}>
          <h3 className="text-red-300">{monthTitle}</h3>
          {groupedData[monthTitle].map((item) => (
            <div key={item.orderId}>
              <p>Date Created: {item.dateCreated}</p>
              <p>Order ID: {item.orderId}</p>
              <p>Reason: {item.reason}</p>
              <p>Sum Total: {item.sumTotal}</p>
            </div>
          ))}
        </div>
      ))} */}
    </div>
  );
};

export default ProfileUser;
