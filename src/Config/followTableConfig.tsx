import { Typography } from "antd";
import React from "react";
import { PROFILE_CHART_COLOR } from "../Container/Profile/helper";
import TableActionComponent from "../Components/TableActionComponent";
import { capitalize } from "lodash";

export const getFollowColumns = (
  func: any,
  handleFollowUnFollow: any,
  dataList: any
) => {
  return [
    {
      title: capitalize("avatar"),
      dataIndex: "avatar_url",
      key: "avatar_url",
      width: "10%",
      render: (text: any, record: any, index: number) => (
        <img
          src={record.avatar_url}
          alt="No Avatar"
          style={{
            borderRadius: "100%",
            backgroundSize: "contain",
            width: "6rem",
            height: "6rem",
          }}
        />
      ),
    },
    {
      title: capitalize("github Username"),
      dataIndex: "username",
      key: "username",
      render: (text: any, record: any, index: number) => (
        <Typography.Text
          style={{ color: `${PROFILE_CHART_COLOR}`, fontSize: "medium" }}
        >
          {record.username}
        </Typography.Text>
      ),
    },
    {
      title: capitalize("actions"),
      dataIndex: "action",
      key: "action",
      render: (text: any, record: any, index: number) => (
        <TableActionComponent
          record={record}
          func={func}
          handleFollowUnFollow={handleFollowUnFollow}
          dataList={dataList}
        />
      ),
    },
  ];
};
