"use client";
import { useRouter } from "next/navigation";
import { useAuth} from "@/context/authcontext";


export default function Home() {
    const { isConnected } = useAuth();
    const router = useRouter();

    const handleStartMatch = (mode: "1v1" | "2v2") => {
      console.log("Mode sélectionné :", mode);
      router.push("/matchmaking");
    };

    return (
        <div className="flex h-full w-full ml-6 mt-10">
            <main className="flex-grow bg-gray-900 text-white p-8 h-full">
                <div className="p-4 text-white h-full mb-5">
                    {isConnected ? (
                        <>
                            <p className="text-lg font-bold flex">
                                ✅ Connecté ! Bienvenue xX_D4rk-_-K1ll3r_Xx!
                            </p>
                            <div className="mt-6 flex gap-4 w-full h-[90%]">
                              <button
                                onClick={() => handleStartMatch("1v1")}
                                className="relative overflow-hidden bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-2xl flex-1 group z-0"
                              >
                                <span
                                  className="absolute inset-0 bg-cover bg-center blur-sm grayscale group-hover:blur-0 group-hover:grayscale-0 scale-110 group-hover:scale-105  brightness-75 group-hover:brightness-100 transform transition-all duration-500 z-[-10] mask-image-[radial-gradient(ellipse_at_center,_rgba(0,0,0,1)_0%,_rgba(0,0,0,0.5)_70%,_transparent_100%)]"
                                  style={{ backgroundImage: "url('/1v1image.png')" }}
                                />
                                <span className="relative z-10 group-hover:opacity-0 transition-opacity duration-300 text-6xl uppercase tracking-wide drop-shadow-[0_0_8px_rgba(0,0,0,0.25)]">
                                  Match 1v1
                                </span>
                              </button>
                              <button
                                onClick={() => handleStartMatch("2v2")}
                                className="relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl flex-1 group z-0"
                              >
                                <span
                                  className="absolute inset-0 bg-cover bg-center blur-sm grayscale group-hover:blur-0 group-hover:grayscale-0 scale-110 group-hover:scale-105 group-hover:-translate-x-3 brightness-75 group-hover:brightness-100 transform transition-all duration-500 z-[-10] mask-image-[radial-gradient(ellipse_at_center,_rgba(0,0,0,1)_0%,_rgba(0,0,0,0.5)_70%,_transparent_100%)]"
                                  style={{ backgroundImage: "url('/2v2image.png')" }}
                                />
                                <span className="relative z-10 group-hover:opacity-0 transition-opacity duration-300 text-6xl uppercase tracking-wide drop-shadow-[0_0_8px_rgba(0,0,0,0.25)]">
                                  Match 2v2
                                </span>
                              </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-red-400">❌ Non connecté.</p>
                    )}
                </div>
            </main>
        </div>
    );
}
