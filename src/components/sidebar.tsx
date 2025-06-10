"use client";
import Image from "next/image";
import Link from "next/link";
import {useAuth} from "@/context/authcontext";

export default function Sidebar() {
    const {isConnected} = useAuth();
    return (
        <aside
            className="
        group
        w-16 hover:w-64
        bg-gray-700
        border-r border-gray-800
        transition-all duration-300
        overflow-hidden
        min-h-screen md:min-h-screen lg:min-h-screen
        fixed
        top-0
        pt-20
        h-screen
        z-10
      "
        >
            {/* Menu latéral */}
            <nav className="flex flex-col h-full group transition-all">
                <Link href="/" className="flex items-center pb-3 pt-3 hover:bg-gray-600 rounded mt-1.5 mb-1.5">
                    {/* Icône toujours visible */}
                    <span className="h-5 w-5 min-h-[25px] min-w-[25px] ml-4">
                    <Image className="justify-center"
                           src="/DualZone-Play.svg" // Place le SVG dans /public
                           alt="Play"
                           width={25}
                           height={25}
                    />
          </span>
                    <span
                        className="
              text-gray-700
              group-hover:text-white
              group-hover:inline-block
              transition duration-200
              ml-4
            "
                    >
                        Jouer
          </span>
                </Link>

                {/* Ex. 2 */}
                <Link href={isConnected ? "/dashboard" : "/"} className="flex items-center pb-3 pt-3 hover:bg-gray-600 rounded mt-1.5 mb-1.5">
          <span className="h-5 w-5 min-h-[25px] min-w-[25px] ml-4">
            <Image className="justify-center"
                   src="/Classement-DualZone.svg"
                   alt="Settings"
                   width={25}
                   height={25}
            />
          </span>

                    <span
                        className="
              group-hover:inline-block
              text-gray-700
              group-hover:text-white
              transition duration-200
              ml-4
            "
                    >
            Dashboard
          </span>
                </Link>

                {/* Ex. 3 */}
                <Link href={isConnected ? "/profil" : "/"} className="flex items-center pb-3 pt-3 hover:bg-gray-600 rounded mt-1.5 mb-1.5">
          <span className="h-5 w-5 min-h-[25px] min-w-[25px] ml-4">
            <Image className="justify-center"
                   src="/User Rank.svg"
                   alt="Connexion"
                   width={25}
                   height={25}
            />
          </span>

                    <span
                        className="
              ml-4
              group-hover:inline-block
              text-gray-700
              group-hover:text-white
              transition duration-200
            "
                    >
            Profil
          </span>

                </Link>

                { isConnected &&
                    (
                <Link href={isConnected ? "/friends" : "/"} className="flex items-center hover:bg-gray-600 pb-3 pt-3 rounded mt-auto mb-10">
                    <span className="h-5 w-5 min-h-[25px] ml-4">
                        <Image className="justify-center min-h-[25px] min-w-[25px] h-5 w-5"
                               src="/Friends.png"
                               alt="Friends"
                               width={25}
                               height={25}
                        /></span>

                            <span className="
                        ml-6
                        group-hover:inline-block
                        text-gray-700
                        group-hover:text-white
                        transition duration-200
                        whitespace-nowrap
              ">
                            Amis connecté: 3
                            </span>

          </Link>
                    )}
            </nav>
        </aside>
    );
}