"use client";

import { getSlugName } from "@/lib/utils";
import { useRouter } from "next/navigation";

type PageType = "game" | "player" | "team";

interface NavigateOptions {
  type: PageType;
  id: string;
  slug?: string;
}

export function useRouteStorage() {
  const router = useRouter();

  const setStorageForType = (type: PageType, id: string) => {
    try {
      const key = type === "player" ? "player_id" : type === "game" ? "game_id" : "team_id";
      localStorage.setItem(key, id);
    } catch (e) {
      // noop: localStorage might be unavailable (SSR or privacy mode)
    }
  };

  const goToPlayer = (playerId: string, slug: string) => {
    setStorageForType("player", playerId);
    console.log('Navigating to player with slug:', slug);
    router.push(`/players/${getSlugName('player', slug)}`);
  };

  const goToGame = (gameId: string, slug: string) => {
    setStorageForType("game", gameId);
    router.push(`/games/${getSlugName('game', slug)}`);
  };

  const navigate = ({ type, id, slug }: NavigateOptions) => {
    setStorageForType(type, id);
    if (type === "player" && slug) {
      router.push(`/players/${slug}`);
    } else if (type === "game") {
      router.push(`/games/${id}`);
    } else if (type === "team" && slug) {
      router.push(`/teams/${slug}`);
    }
  };

  return { goToPlayer, goToGame, navigate };
}
