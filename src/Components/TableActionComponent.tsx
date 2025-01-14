import { Button, Tooltip } from "antd";
import React, { useState } from "react";
import Icon from "@ant-design/icons";
import { Ri, Md } from "../Config/iconConfig";
import { checkFollowDisable } from "../Config/helper";
import { cloneDeep, debounce } from "lodash";
import { RestData } from "../classes/RestData";

interface TableActionComponentProps {
  record: any;
  dataList: any;
  handleFollowUnFollow: (name: any, type: "follow" | "unfollow") => void;
  func: (record: any) => void;
}

const TableActionComponent: React.FC<TableActionComponentProps> = ({
  record,
  dataList,
  func,
  handleFollowUnFollow,
}) => {
  const [disable, setDisable] = useState<boolean>(
    checkFollowDisable(record.username || "", dataList || [])
  );
  const [authList, setAuthList] = useState<any[]>(dataList || []);
  const debounceFollowUnFollow = debounce(handleFollowUnFollow, 300);

  const handleFollowFeature = (type: "follow" | "unfollow") => {
    let newDataList: any = [];
    if (type === "follow") {
      newDataList = cloneDeep(authList);
      newDataList.push(record);
    } else {
      newDataList = authList.filter(
        (crecord: RestData) => crecord.username !== record.username
      );
    }
    setDisable(checkFollowDisable(record.username || "", newDataList));
    setAuthList(newDataList);
    debounceFollowUnFollow(record.username, type);
  };

  return (
    <div
      style={{
        display: "flex",
        alignContent: "center",
        justifyItems: "center",
      }}
    >
      <Tooltip title="Preview">
        <Button onClick={() => func(record)}>
          <Icon component={Md.MdRemoveRedEye} />
        </Button>
      </Tooltip>
      <Tooltip title="Follow">
        <Button
          onClick={() => handleFollowFeature("follow")}
          disabled={disable}
          style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
        >
          <Icon
            component={Ri.RiUserFollowFill}
            style={{ color: !disable ? "green" : "gray" }}
          />
        </Button>
      </Tooltip>
      <Tooltip title="Un-Follow">
        <Button
          disabled={!disable}
          onClick={() => handleFollowFeature("unfollow")}
        >
          <Icon
            component={Ri.RiUserUnfollowFill}
            style={{ color: disable ? "red" : "gray" }}
          />
        </Button>
      </Tooltip>
    </div>
  );
};

export default TableActionComponent;
