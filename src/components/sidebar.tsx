import Image from "next/image";

export default function Sidebar() {
    return (
        <aside
            className="
        group
        w-16 hover:w-96
        bg-gray-700
        border-r border-gray-800
        transition-all duration-300
        overflow-hidden
      "
        >
            {/* Menu latéral */}
            <nav className="flex flex-col space-y-1 group transition-all ml-4">

                <a href="#" className="justify-center">
                    <span >
                    <Image className="hidden group-hover:flex pt-5"
                        src="Logo typographique DualZone.svg" // Place le SVG dans /public
                        alt="Logo"
                        width={300}
                        height={300}
                    />
                    </span>
                </a>

                {/* Ex. 1 */}
                <a href="#" className="flex items-center pb-3 pt-3 hover:bg-gray-600 rounded">
                    {/* Icône toujours visible */}
                    <span className="h-5 w-5 min-h-[20px] min-w-[20px]">
                    <Image className="ml-1"
                        src="/DualZone-Play.svg" // Place le SVG dans /public
                        alt="Play"
                        width={20}
                        height={20}
                    />
          </span>
                    <span
                        className="
              ml-2
              text-gray-700
              group-hover:text-white
              group-hover:inline-block
              transition duration-200
            "
                    >
                        Accueil
          </span>
                </a>

                {/* Ex. 2 */}
                <a href="#" className="flex items-center pb-3 pt-3 hover:bg-gray-600 rounded">
          <span className="h-5 w-5 min-h-[20px] min-w-[20px] ml-1">
            <Image className="justify-center"
                src="/Classement-DualZone.svg"
                alt="Settings"
                width={20}
                height={20}
            />
          </span>

                    <span
                        className="
              ml-2
              group-hover:inline-block
              text-gray-700
              group-hover:text-white
              transition duration-200
            "
                    >
            Settings
          </span>
                </a>

                {/* Ex. 3 */}
                <a href="#" className="flex items-center pb-3 pt-3 hover:bg-gray-600 rounded">
          <span className="h-5 w-5 min-h-[20px] min-w-[20px] ml-1">
            <Image className="justify-center"
                src="/User Rank.svg"
                alt="Connexion"
                width={20}
                height={20}
            />
          </span>

                    <span
                        className="
              ml-2
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