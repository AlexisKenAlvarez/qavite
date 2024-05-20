"use client";

import { useState } from "react";
import Image from "next/image";
import { navigations } from "@/lib/constants";
import { ChevronsRight, LogOut } from "lucide-react";

import { cn } from "@qavite/ui";
import { supabase } from "@/supabase/supabaseClient";
import { useRouter } from "next/navigation";

const Nav = () => {
  const [opened, setOpened] = useState(false);
  const router = useRouter()
  return (
    <>
      <nav
        className={cn(
          "fixed top-0 z-50 flex h-full min-h-screen w-72 -translate-x-full flex-col justify-between bg-primary transition-all duration-300 ease-in-out lg:sticky lg:translate-x-0",
          {
            "translate-x-0": opened,
          },
        )}
      >
        <button
          className="absolute bottom-8 right-0 block translate-x-full rounded-br-md rounded-tr-md bg-primary p-2 opacity-70 lg:hidden"
          onClick={() => setOpened((curr) => !curr)}
        >
          <ChevronsRight
            className={cn("transition-all duration-300 ease-in-out", {
              "rotate-180": opened,
            })}
          />
        </button>

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
              <a
                href={nav.link}
                className="text-lg capitalize text-white"
                key={index}
              >
                <li className="hover:bg-green1 flex items-center justify-start px-4 py-3 transition-all duration-300 ease-in-out">
                  <nav.icon
                    className="mr-2 h-6 w-6"
                    fill="white"
                    stroke="white"
                  />

                  {nav.label}
                </li>
              </a>
            ))}
          </ul>
        </div>

        <button className="hover:bg-green1 flex w-full items-center gap-2 px-4 py-5 text-white transition-all duration-300 ease-in-out" onClick={async () => {
          await supabase.auth.signOut()
          router.refresh()
        }}>
          <LogOut />
          <p className="">Logout</p>
        </button>
      </nav>
    </>
  );
};

export default Nav;
