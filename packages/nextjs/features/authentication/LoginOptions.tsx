import React from "react";
import { GithubFilled } from "@ant-design/icons";
import { Button } from "antd";
import { signIn } from "next-auth/react";

const LoginOptions: React.FC<{ isRegister?: boolean }> = ({ isRegister = false }) => {
  const text = isRegister ? "Register With " : "Login With ";
  return (
    <div className="flex flex-col gap-4 justify-center h-72">
      {/* <DBLogin isRegister={isRegister} /> */}
      <Button onClick={() => signIn("github")} type="primary" className="bg-[#5E5ADB]" icon={<GithubFilled rev={{}} />}>
        {text}
        Github{" "}
      </Button>

      {/* <Button
        onClick={() => signIn("twitter")}
        type="primary"
        className="bg-[#5E5ADB]"
        icon={<TwitterOutlined rev={{}} />}
      >
        {" "}
        X{" "}
      </Button> */}
    </div>
  );
};

export default LoginOptions;
