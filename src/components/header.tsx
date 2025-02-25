"use client";
import Link from "next/link";
import Image from "next/image";
import {useState} from "react";

const HeaderComp = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <header className="w-full bg-gray-700 shadow-md justify-between items-center h-20 pt-1 fixed z-50">
            <div className="text-xl font-bold text-gray-900 mb-0 flex ml-auto mr-5">
                <div>
                    <Link href="/">
                        <span className="cursor-pointer">
                            <Image src="/TypoDZ.svg" alt="Logo Typographique DualZone" className="h-30" width={450} height={1000} />
                        </span>
                    </Link>
                </div>
                <div className="ml-auto mt-3">
                    <button
                    className="bg-gray-800 text-white border-white px-4 py-2 rounded-3xl hover:bg-white hover:border-0 hover:text-gray-800 transition"
                    onClick={() => {setIsOpen(true)}}
                    >
                        Se connecter
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-10">
                    <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-96 relative">
                        <h2 className="text-xl font-bold mb-4">Connexion</h2>
                        <button
                            className="absolute top-2 right-4 text-gray-500 hover:text-gray-700"
                            onClick={() => setIsOpen(false)}
                        >
                            ×
                        </button>
                        {/* Formulaire de connexion ici */}
                        <form className="flex flex-col space-y-4 text-black">
                            <input
                                type="text"
                                placeholder="Pseudo"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            <input
                                type="password"
                                placeholder="Mot de passe"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Se connecter
                            </button>
                        </form>

                        {/* Connexion via Steam */}
                        <div className="mt-4 text-center">
                            <p className="text-gray-400">Ou</p>
                            <Link href="/api/auth/steam"
                               className="mt-2 items-center h-20 bg-gray-80 font-bold text-white px-4 py-1 rounded-lg bg-gray-800 hover:bg-gray-900 transition inline-flex">
                                <a className="justify-center">Se connecter avec</a>
                                <Image src="/steam.svg" alt="Logo steam" className="right-2" height={75} width={75} />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );

};

export default HeaderComp;