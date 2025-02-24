import Image from "next/image";

export default function Sidebar() {
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
        top-20
      "
        >
            {/* Menu latéral */}
            <nav className="flex flex-col group transition-all space-y-3">
                <a href="#" className="flex items-center pb-3 pt-3 hover:bg-gray-600 rounded">
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
                        Accueil
          </span>
                </a>

                {/* Ex. 2 */}
                <a href="#" className="flex items-center pb-3 pt-3 hover:bg-gray-600 rounded">
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
            Settings
          </span>
                </a>

                {/* Ex. 3 */}
                <a href="#" className="flex items-center pb-3 pt-3 hover:bg-gray-600 rounded">
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
            Connexion
          </span>
                </a>
            </nav>
        </aside>
    );
}