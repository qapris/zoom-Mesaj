import React, { useContext, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Preview } from "@100mslive/sdk-components";
import { AppContext } from "../store/AppContext";
import getToken from "../utlis/index";

const PreviewScreen = () => {
  const history = useHistory();
  const context = useContext(AppContext);
  const { loginInfo, setLoginInfo, setMaxTileCount } = context;
  const { roomId: urlRoomId } = useParams();

    const join = ({audioMuted, videoMuted}) => {
        getToken(loginInfo.username, loginInfo.role, loginInfo.roomId, loginInfo.endpoint)
            .then((token) => {
                setLoginInfo({ token , audioMuted, videoMuted});
                history.push(`/meeting/${loginInfo.roomId}`);
            })
            .catch((error) => {
                console.log("Token API Error", error);
                alert("Unable to generate token");
            });
    };

  const onChange = ({selectedVideoInput, selectedAudioInput, selectedAudioOutput, maxTileCount}) => {
    console.debug("app: Selected Video Input", selectedVideoInput);
    console.debug("app: Selected Audio Input", selectedVideoInput);
    console.debug("app: Selected Audio Output", selectedAudioOutput);
    setLoginInfo({selectedVideoInput, selectedAudioInput, selectedAudioOutput});
    setMaxTileCount(maxTileCount);
  }

  const goBack = () => {
    history.push(`/${loginInfo.roomId || urlRoomId || ""}`);
  };

  useEffect(() => {
    if (loginInfo.username === "")
      history.push(`/${loginInfo.roomId || urlRoomId || ""}`);
    // eslint-disable-next-line
  }, [loginInfo.username]);

  return loginInfo.username ? (
    <div>
      <div className="flex justify-center items-center">
        <Preview
          name={loginInfo.username}
          joinOnClick={join}
          goBackOnClick={goBack}
          messageOnClose={goBack}
          onChange={onChange}
        />
      </div>
    </div>
  ) : null;
};

export default PreviewScreen;