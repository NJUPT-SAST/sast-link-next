import type { UserProfileType } from "@/lib/api/types";

export interface MockUser {
  username: string;
  password: string;
  token: string;
  userId: string;
  email: string;
  profile: UserProfileType;
  bindStatus: string[];
}

export const mockUsers: MockUser[] = [
  {
    username: "alice@example.com",
    password: "Password123!",
    token: "mock-token-alice-abc123",
    userId: "user-001",
    email: "alice@example.com",
    profile: {
      nickname: "Alice",
      dep: "软件研发部",
      org: "SAST",
      email: "alice@example.com",
      avatar: "/defaultAvatar.png",
      bio: "Full-stack developer",
      link: ["https://github.com/alice"],
      badge: [
        {
          title: "Contributor",
          description: "Core contributor",
          create_at: "2025-01-15",
        },
      ],
      hide: [],
    },
    bindStatus: ["github", "feishu"],
  },
  {
    username: "bob@example.com",
    password: "SecurePass456!",
    token: "mock-token-bob-def456",
    userId: "user-002",
    email: "bob@example.com",
    profile: {
      nickname: "Bob",
      dep: null,
      org: null,
      email: "bob@example.com",
      avatar: null,
      bio: null,
      link: null,
      badge: null,
      hide: null,
    },
    bindStatus: [],
  },
];

export function findUserByToken(token: string): MockUser | undefined {
  return mockUsers.find((u) => u.token === token);
}

export function findUserByUsername(username: string): MockUser | undefined {
  return mockUsers.find((u) => u.username === username);
}
