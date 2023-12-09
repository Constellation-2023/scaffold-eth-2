import React, { useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScheduleOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { MetaHeader } from "~~/components/MetaHeader";

interface IProps {
  alternativeAction: {
    text: string;
    link: string;
    promptText: string;
  };
  children: React.ReactNode;
  heading: string;
}

const AuthLayout = ({ alternativeAction, children, heading }: IProps) => {
  const { data: session } = useSession();

  const { push } = useRouter();
  useLayoutEffect(() => {
    if (!!session === true) {
      push("/");
    }
  }, [push, session]);
  return (
    <>
      <MetaHeader />
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        {/* image n animation */}
        <div className="bg-white hidden lg:flex shadow-lg">
          {/* asa */}
          <div
            className={`fixed lg:w-2/4 top-0 bg-gradient-to-t bg-contain bg-no-repeat  to-blue-800 from-[#5E5ADB] left-0 z-20 h-screen shadow-lg bg-top flex flex-col gap-4 items-center justify-end pt-12  pb-6`}
          >
            <div className="w-2/4">
              <Image
                height={400}
                width={400}
                src="/assets/blocks.png"
                alt="result compilation"
                className=" object-contain"
              />
            </div>
            <div className="h-72" />
            <div className=" text-sky-900 mt-4">
              <p className="font-bold text-lg uppercase text-white text-center mb-0">Bankexpert</p>

              <span className="font-light text-xs  text-[#18f3ff] italic">A Decentralized Cross Chain Application</span>
            </div>
          </div>
        </div>
        {/* register school form */}
        <div className="flex flex-col gap-4 items-center pt-8">
          {/* heading */}
          <div className="flex flex-col items-center">
            <ScheduleOutlined size={400} className="text-2xl" rev={{}} />
            <h4 className="text-2xl"> {heading}</h4>
            <p>
              {alternativeAction.promptText}{" "}
              <Link className="text-[#5E5ADB] hover:text-underline" href={alternativeAction.link}>
                {alternativeAction.text}
              </Link>
            </p>
          </div>
          {/* form */}
          <div className="w-3/5">{children}</div>

          <div className="h-72" />
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
