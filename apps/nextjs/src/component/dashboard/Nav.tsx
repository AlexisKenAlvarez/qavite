import { navigations } from "@/lib/constants";
import Image from "next/image";


const Nav = () => {
  return (
    <div className="w-72 h-full bg-primary min-h-screen">
      <Image alt="Logo" width={200} height={200} src="/whitelogo.webp" className="w-24 mx-auto mt-4" />
      <ul className="space-y-2">
        {navigations.map((nav, index) => (
          <li key={index} className="flex items-center justify-start px-4 py-3 ">
            <nav.icon className="w-6 h-6 mr-2" fill="white" stroke="white"/>
            <a href={nav.link} className="text-white capitalize text-lg">{nav.label}</a>
          </li>
        ))}
      </ul>
      
    </div>
  );
}

export default Nav;