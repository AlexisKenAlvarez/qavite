import Image from "next/image";
import { api } from "@/trpc/server";

const page = async ({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) => {
  const token = searchParams?.token as string;
  const auth_id = searchParams?.auth_id as string;

  try {
    await api.auth.verifyUser({
      auth_id,
      token,
    });

    return (
      <div className="grid h-screen w-full place-content-center text-center">
        <Image
          src="/logo.webp"
          width="500"
          height="500"
          className="mx-auto h-20 w-20"
          alt="Logo"
        />
        <h1 className=" mt-5 text-2xl font-bold">EMAIL HAS BEEN VERIFIED</h1>
        <p className="">Your email has been verified.</p>
      </div>
    );
  } catch (error) {
    console.log(error);
    return (
      <div className="grid h-screen w-full place-content-center text-center">
        <Image
          src="/logo.webp"
          width="500"
          height="500"
          className="mx-auto h-20 w-20"
          alt="Logo"
        />
        <h1 className=" mt-5 text-2xl font-bold">Your verification link has been expired.</h1>
      </div>
    );
  }
};

export default page;
