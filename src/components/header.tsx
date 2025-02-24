import Link from "next/link";
import Image from "next/image";

const HeaderComp = () => {
    return (
        <header className="w-full bg-gray-700 shadow-md justify-between h-20 pt-1 fixed">
            <div className="text-xl font-bold text-gray-900 mb-0">
                <Link href="/">
                    <span className="cursor-pointer">
                        <Image src="/TypoDZ.svg" alt="Logo Typographique DualZone" className="h-30" width={400} height={1000} />
                    </span>
                </Link>
            </div>
        </header>
    );

};

export default HeaderComp;