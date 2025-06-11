// src/utils/avatarHelper.ts

export const avatarServices = {
    // DiceBear - Avatars stylisés, parfait pour gaming
    dicebear: {
        avataaars: (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
        personas: (seed: string) => `https://api.dicebear.com/7.x/personas/svg?seed=${seed}`,
        bottts: (seed: string) => `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`, // Robots
        pixelArt: (seed: string) => `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`,
    },

    // UI Avatars - Initiales avec couleurs
    uiAvatars: (name: string, bg?: string) =>
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=100&bold=true${bg ? `&background=${bg}` : '&background=random'}`,

    // Robohash - Robots uniques
    robohash: (seed: string) => `https://robohash.org/${seed}?size=100x100`,

    // Boring Avatars - Style moderne
    boringAvatars: (seed: string, variant = 'beam') =>
        `https://source.boringavatars.com/${variant}/100/${seed}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`,
};

// Générateur d'avatar basé sur le pseudo
export const generateAvatar = (pseudo: string, style: 'gaming' | 'professional' | 'fun' = 'gaming') => {
    const styles = {
        gaming: [
            avatarServices.dicebear.bottts(pseudo),
            avatarServices.dicebear.pixelArt(pseudo),
            avatarServices.robohash(pseudo),
        ],
        professional: [
            avatarServices.dicebear.avataaars(pseudo),
            avatarServices.uiAvatars(pseudo, '6366f1'),
            avatarServices.boringAvatars(pseudo, 'beam'),
        ],
        fun: [
            avatarServices.dicebear.personas(pseudo),
            avatarServices.boringAvatars(pseudo, 'bauhaus'),
            avatarServices.robohash(pseudo),
        ]
    };

    const styleOptions = styles[style];
    const hash = pseudo.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return styleOptions[hash % styleOptions.length];
};

// Données d'exemple avec avatars
export const getFakeUsersWithAvatars = () => [
    {
        id: "1",
        pseudo: "AlphaZ",
        steamId: 76561198000000001,
        userImage: generateAvatar("AlphaZ", "gaming"),
        created_at: "2025-01-15T10:00:00Z",
        updated_at: "2025-06-11T15:30:00Z"
    },
    {
        id: "2",
        pseudo: "GhostX",
        steamId: 76561198000000002,
        userImage: generateAvatar("GhostX", "gaming"),
        created_at: "2025-02-20T14:00:00Z",
        updated_at: "2025-06-11T12:45:00Z"
    },
    {
        id: "3",
        pseudo: "CyberNinja",
        steamId: 76561198000000003,
        userImage: generateAvatar("CyberNinja", "gaming"),
        created_at: "2025-03-10T09:30:00Z",
        updated_at: "2025-06-10T18:20:00Z"
    },
    {
        id: "4",
        pseudo: "ProGamer123",
        steamId: 76561198000000004,
        userImage: generateAvatar("ProGamer123", "professional"),
        created_at: "2025-06-01T16:00:00Z",
        updated_at: "2025-06-01T16:00:00Z"
    },
    {
        id: "5",
        pseudo: "SkillMaster",
        steamId: 76561198000000005,
        userImage: generateAvatar("SkillMaster", "fun"),
        created_at: "2025-06-09T11:30:00Z",
        updated_at: "2025-06-09T11:30:00Z"
    },
    {
        id: "6",
        pseudo: "NeonGamer",
        steamId: 76561198000000006,
        userImage: generateAvatar("NeonGamer", "gaming"),
        created_at: "2025-06-10T20:15:00Z",
        updated_at: "2025-06-10T20:15:00Z"
    }
];

// Pour les situations où on veut un avatar fallback
export const getDefaultAvatar = (pseudo: string) => {
    return avatarServices.uiAvatars(pseudo, '6366f1');
};

// Collection d'avatars Steam-like (si vous voulez plus de réalisme)
export const steamLikeAvatars = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108755-2616b86d3ba1?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face"
];

export const getRandomSteamAvatar = () => {
    return steamLikeAvatars[Math.floor(Math.random() * steamLikeAvatars.length)];
};