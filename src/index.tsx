import ReactDOM from "react-dom";
import React from "react";
import axios from "axios";
import "./index.css";

const url = "https://takashiii-hq.com/api/v1/account_activations";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Activate = (): JSX.Element => {
  const [activated, setActivated] = React.useState<string>(
    "利用規約に同意してアカウントを有効にします"
  );
  const [messageClass, setMessageClass] = React.useState<string>("button");
  const [promise, setPromise] = React.useState<string>("");

  const params = new URLSearchParams(window.location.search);
  const activation = () => {
    setActivated("アクティベート中");
    const body = {
      value: {
        email: params.get("email"),
        token: params.get("token"),
      },
    };

    axios
      .put(url, body)
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          setMessageClass("success");
          return setActivated(
            "有効化されました。このページは閉じて構いません。"
          );
        }
        setMessageClass("failed");
        setActivated(response.data.message);
      })
      .catch((e) => {
        setMessageClass("error");
        setActivated("エラーが発生しました");
        console.error(e);
      });
  };

  // 多分ここで無限ループが起きてる
  // render -> axious -> render -> axious
  // 解決にはマウント時に1回だけ通信を行うようにuseMemoとかを使うと良いかも
  axios
    .get("https://takashiii-hq.com/promise.txt")
    .then((response) => {
      setPromise(
        response.data
          .toString()
          .split("n")
          .map((str: string) => {
            return <p className="text">{str}</p>;
          })
      );
    })
    .catch(() => {
      setPromise("利用規約にアクセスできませんでした");
    });

  return (
    <div className="box">
      <h3 className="title">ようこそ、{params.get("email")}さん</h3>
      <p className="oyomikudasai">
        アカウントを有効にするには利用規約をお読みください
      </p>
      <div className="textbox">{promise}</div>
      <div className="button-box">
        <button
          className={messageClass}
          disabled={activated !== "利用規約に同意してアカウントを有効にします"}
          onClick={activation}
        >
          {activated}
        </button>
      </div>
    </div>
  );
};

ReactDOM.render(<Activate />, document.getElementById("root"));
