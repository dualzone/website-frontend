import Image from "next/image";

export default function Sidebar() {
    return (
        <aside
            className="
        group
        w-20 hover:w-64
        bg-gray-700
        border-r border-gray-800
        p-5
        transition-all duration-300
        overflow-hidden
      "
        >
            {/* Menu latéral */}
            <nav className="flex flex-col space-y-2">
                {/* Ex. 1 */}
                <a href="#" className="flex items-center p-3 hover:bg-gray-600 rounded">
                    {/* Icône toujours visible */}
                    <span className="h-5 w-5 min-h-[20px] min-w-[20px]">
                    <Image
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
                <a href="#" className="flex items-center p-3 hover:bg-gray-600 rounded">
          <span className="h-5 w-5 min-h-[20px] min-w-[20px]">
            <Image
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
                <a href="#" className="flex items-center p-3 hover:bg-gray-600 rounded">
          <span className="h-5 w-5 min-h-[20px] min-w-[20px]">
            <Image
                src="/DualZone-Design.svg"
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