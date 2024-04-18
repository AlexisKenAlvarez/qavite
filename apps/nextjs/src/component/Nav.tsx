"use client";

import Image from "next/image";
import { navigations } from "@/lib/constants";
import { LogOut } from "lucide-react";

const Nav = () => {
  return (
    <div className="h-full min-h-screen w-72 bg-primary flex flex-col justify-between">
      <div className="">
        <Image
          alt="Logo"
          width={200}
          height={200}
          src="/whitelogo.webp"
          className="mx-auto mt-4 w-24"
        />
        <ul className="space-y-2">
          {navigations.map((nav, index) => (
            <li
              key={index}
              className="hover:bg-green1 flex items-center justify-start px-4 py-3 transition-all duration-300 ease-in-out"
            >
              <nav.icon className="mr-2 h-6 w-6" fill="white" stroke="white" />
              <a href={nav.link} className="text-lg capitalize text-white">
                {nav.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <button className="hover:bg-green1 flex items-center gap-2 text-white transition-all duration-300 ease-in-out w-full px-4 py-5">
        <LogOut />
        <p className="">Logout</p>
      </button>
    </div>
  );
};

export default Nav;
