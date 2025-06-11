// src/app/friends/page.tsx - Exemple d'utilisation des avatars
"use client";
import Image from "next/image";
import { useAuth } from "@/context/authcontext";
import { useState, useEffect } from "react";
import { generateAvatar, getFakeUsersWithAvatars } from "@/utils/avatarHelper";

type User = {
    id: string;
    pseudo: string;
    steamId: number;
    userImage: string;
    created_at: string;
    updated_at: string;
};

type FriendData = {
    friends: User[];
    friendRequestsSent: User[];
    friendRequestsReceived: User[];
};

export default function FriendsPage() {
    const { user, isConnected, token } = useAuth();
    const [activeTab, setActiveTab] = useState<"friends" | "requests" | "search">("friends");
    const [friendData, setFriendData] = useState<FriendData>({
        friends: [],
        friendRequestsSent: [],
        friendRequestsReceived: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Données fictives avec avatars générés
    useEffect(() => {
        if (isConnected && user) {
            setIsLoading(true);
            setTimeout(() => {
                const fakeUsers = getFakeUsersWithAvatars();

                setFriendData({
                    friends: fakeUsers.slice(0, 3),
                    friendRequestsSent: [fakeUsers[3]],
                    friendRequestsReceived: fakeUsers.slice(4, 6)
                });
                setIsLoading(false);
            }, 800);
        }
    }, [isConnected, user]);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        setIsSearching(true);
        setTimeout(() => {
            const mockResults: User[] = [
                {
                    id: "search1",
                    pseudo: "FlashBang",
                    steamId: 76561198000000007,
                    userImage: generateAvatar("FlashBang", "gaming"),
                    created_at: "2025-04-15T10:00:00Z",
                    updated_at: "2025-06-11T10:00:00Z"
                },
                {
                    id: "search2",
                    pseudo: "StormBreaker",
                    steamId: 76561198000000008,
                    userImage: generateAvatar("StormBreaker", "professional"),
                    created_at: "2025-05-20T15:30:00Z",
                    updated_at: "2025-06-11T08:45:00Z"
                }
            ].filter(user =>
                user.pseudo.toLowerCase().includes(searchTerm.toLowerCase())
            );

            setSearchResults(mockResults);
            setIsSearching(false);
        }, 1000);
    };

    const sendFriendRequest = async (userId: string) => {
        console.log("Envoi de demande d'ami à:", userId);
    };

    const acceptFriendRequest = async (userId: string) => {
        console.log("Accepter demande d'ami de:", userId);
    };

    const refuseFriendRequest = async (userId: string) => {
        console.log("Refuser demande d'ami de:", userId);
    };

    const removeFriend = async (userId: string) => {
        console.log("Supprimer ami:", userId);
    };

    const getOnlineStatus = (lastUpdate: string) => {
        const now = new Date();
        const lastSeen = new Date(lastUpdate);
        const diffMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60));

        if (diffMinutes < 5) return { status: "En ligne", color: "bg-green-500" };
        if (diffMinutes < 30) return { status: "Absent", color: "bg-yellow-500" };
        return { status: "Hors ligne", color: "bg-gray-500" };
    };

    if (!isConnected) {
        return (
            <div className="ml-14 mt-20 p-6 text-white">
                <p>Veuillez vous connecter pour gérer vos amis.</p>
            </div>
        );
    }

    return (
        <main className="ml-14 mt-20 p-6 space-y-6 text-white">
            {/* Header */}
            <header className="text-center space-y-4">
                <h1 className="text-4xl font-bold">👥 Mes Amis</h1>
                <p className="text-gray-400">Gérez vos amis et invitations</p>
            </header>

            {/* Navigation des onglets */}
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                <button
                    onClick={() => setActiveTab("friends")}
                    className={`flex-1 py-3 px-6 rounded-md font-medium transition-all ${
                        activeTab === "friends"
                            ? "bg-green-600 text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                >
                    👥 Amis ({friendData.friends.length})
                </button>
                <button
                    onClick={() => setActiveTab("requests")}
                    className={`flex-1 py-3 px-6 rounded-md font-medium transition-all relative ${
                        activeTab === "requests"
                            ? "bg-green-600 text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                >
                    📬 Demandes
                    {friendData.friendRequestsReceived.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                            {friendData.friendRequestsReceived.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("search")}
                    className={`flex-1 py-3 px-6 rounded-md font-medium transition-all ${
                        activeTab === "search"
                            ? "bg-green-600 text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                >
                    🔍 Rechercher
                </button>
            </div>

            {/* Contenu des onglets */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
                </div>
            ) : (
                <>
                    {/* Onglet Amis */}
                    {activeTab === "friends" && (
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">Liste d'amis</h2>
                            {friendData.friends.length > 0 ? (
                                <div className="grid gap-4">
                                    {friendData.friends.map((friend) => {
                                        const status = getOnlineStatus(friend.updated_at);
                                        return (
                                            <div key={friend.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700 transition-all">
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative">
                                                        <Image
                                                            src={friend.userImage}
                                                            alt={`Avatar de ${friend.pseudo}`}
                                                            width={60}
                                                            height={60}
                                                            className="rounded-full"
                                                            unoptimized
                                                        />
                                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${status.color} rounded-full border-2 border-gray-800`}></div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{friend.pseudo}</h3>
                                                        <p className="text-gray-400 text-sm">{status.status}</p>
                                                        <p className="text-gray-500 text-xs">Steam: {friend.steamId}</p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-all">
                                                        💬 Message
                                                    </button>
                                                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-all">
                                                        🎮 Inviter
                                                    </button>
                                                    <button
                                                        onClick={() => removeFriend(friend.id)}
                                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-all"
                                                    >
                                                        ❌ Supprimer
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400">
                                    <p className="text-xl">Aucun ami pour le moment</p>
                                    <p className="text-sm">Utilisez la recherche pour ajouter des amis !</p>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Autres onglets... (requests et search) */}
                    {/* Le reste du code reste identique, juste les avatars qui changent */}
                </>
            )}
        </main>
    );
}