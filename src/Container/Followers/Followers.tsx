import { Button, Result } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../antDesign/Spinner";
import { RestData } from "../../classes/RestData";
import CustomTableComponent from "../../Components/CustomTableComponent";
import { getFollowColumns } from "../../Config/followTableConfig";
import { actionCreator } from "../../redux/action/actionCreator";
import { actions } from "../../redux/action/actions";
import {
  getAuthUserFollowingList,
  getFollowersList,
  getFollowListLoading,
  getUser,
} from "../../redux/selector/restApiSelector";
import { LoginReducerKeyTypes, RestApiTypes } from "../../Util/globalConstants";
import Profile from "../Profile/Profile";

interface FollowersProps {
  url?: string;
  type?: string;
  parentUrl?: string;
  showRefresh?: boolean;
}

const Followers: React.FC<FollowersProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const currentUserData: RestData = useSelector(getUser);
  const [searchedValue, setSearchedValue] = useState("");
  const followersList = useSelector(getFollowersList);
  const authFollowingList = useSelector(getAuthUserFollowingList);
  const followListLoadingState = useSelector(getFollowListLoading);
  const dispatch = useDispatch();
  const URL = props.url ? props.url : currentUserData?.followersUrl;

  const dataSource = (followersList || []).map(
    (item: RestData, index: number) => ({
      avatar_url: item.profileImage,
      username: item.username,
      key: index,
    })
  );

  const handleViewProfile = (record: any) => {
    setVisible(true);
    setSearchedValue(record.username);
  };

  const handleFollowUnfollow = useCallback(
    (name: any, type: "follow" | "unfollow") => {
      dispatch(
        actionCreator(actions.RESTAPI_READ, {
          type: type === "follow" ? RestApiTypes.FOLLOW : RestApiTypes.UNFOLLOW,
          name,
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) {
      if (followListLoadingState === false) {
        setLoading(false);
      }
    }
  }, [followListLoadingState, loading]);

  const handleModalClose = () => {
    handleRefresh();
    setVisible(false);
    setSearchedValue("");
    dispatch(
      actionCreator(actions.SET_LOGIN_STATE, {
        [LoginReducerKeyTypes.SEARCHED_USER]: {},
      })
    );
  };

  const _column = useMemo(
    () =>
      getFollowColumns(
        handleViewProfile,
        handleFollowUnfollow,
        authFollowingList || []
      ),
    [authFollowingList, handleFollowUnfollow]
  );

  const handleRefresh = () => {
    setLoading(true);
    dispatch(
      actionCreator(actions.RESTAPI_READ, {
        type: RestApiTypes.FOLLOW_LIST,
        url: props.parentUrl || currentUserData.followingUrl,
        extra: true,
      })
    );
    dispatch(
      actionCreator(actions.RESTAPI_READ, {
        type: RestApiTypes.FOLLOW_LIST,
        url: URL,
      })
    );
  };

  return loading ? (
    <Spinner size="large" tip="Getting Info!" />
  ) : (
    <>
      <Modal
        footer={[
          <Button type="primary" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
        onCancel={handleModalClose}
        centered
        visible={visible}
        destroyOnClose
        style={{ minWidth: "78rem" }}
      >
        <Profile
          search={false}
          propsUserName={searchedValue}
          parentUrl={props.parentUrl || currentUserData.followingUrl}
        />
      </Modal>
      {dataSource.length > 0 ? (
        <CustomTableComponent
          type={props.type || "Followers"}
          columns={_column}
          dataSource={dataSource}
        />
      ) : (
        <Result status="404" title="Nothings In Here :(" />
      )}
    </>
  );
};

export default Followers;
