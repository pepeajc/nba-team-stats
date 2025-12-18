import { ScoreboardProps } from "@/components/ScoreBoard/types";
import { Game } from "@/components/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type EventWithShortName = {
    shortName?: string;
    [key: string]: unknown;
};

type DataWithEvents = {
    events?: EventWithShortName[];
    [key: string]: unknown;
};

export function getByShortName<T extends EventWithShortName>(
    shortName: string,
    data: DataWithEvents
): T | undefined {
    if (!data || !Array.isArray(data.events)) return undefined;
    return (data.events as T[]).find((ev) => ev.shortName === shortName);
}

export function getSlugName(
    type: "game" | "player" | "team",
    name: string
): string {
    const decoded = decodeURIComponent(name || "").trim();

    if (type === "game" || type === "team") {
        // "CHI @ CHA" -> "chi_vs_cha"
        const normalized = decoded.replace(/\s*@\s*/g, " vs ");
        return normalized.replace(/\s+/g, "_").toLowerCase();
    }

    // type === 'player'
    // Preserve roman numerals (I,V,X,L,C,D,M) in uppercase, lowercase other words
    const romanRe = /^[IVXLCDM]+$/;
    const tokens = decoded
        .split(/\s+/)
        .map((t) => (romanRe.test(t) ? t : t.toLowerCase()));
    return tokens.join("_");
}

export function getShortName(
    type: "game" | "player" | "team",
    slug: string
): string {
    const cleaned = (slug || "").trim();

    if (type === "game" || type === "team") {
        // "chi_vs_cha" -> "CHI @ CHA"
        const parts = cleaned.split(/_vs_/i).map((p) => p.toUpperCase());
        if (parts.length === 2) return `${parts[0]} @ ${parts[1]}`;
        // Fallback: try splitting by spaces/underscores
        const alt = cleaned.replace(/_/g, " ").split(/\s+vs\s+/i);
        if (alt.length === 2)
            return `${alt[0].toUpperCase()} @ ${alt[1].toUpperCase()}`;
        return cleaned.toUpperCase();
    }

    // type === 'player'
    // "ronald_holland_II" -> "Ronald Holland II"
    const romanRe = /^[IVXLCDM]+$/;
    const words = cleaned.split(/_/).map((w) => {
        const upper = w.toUpperCase();
        if (romanRe.test(upper)) return upper;
        const lower = w.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    });
    return words.join(" ");
}

export function formatESPNGames(events: any[]): Game[] {
    return events
        .map((event) => {
            const competition =
                event.competitions?.[0] || event.boxscore?.teams;
            if (!competition) return null;

            const homeTeam = competition.competitors?.find(
                (c: any) => c.homeAway === "home"
            );
            const awayTeam = competition.competitors?.find(
                (c: any) => c.homeAway === "away"
            );

            if (!homeTeam || !awayTeam) return null;

            const status = event.status?.type?.name || "scheduled";
            let gameStatus = 1;
            let gameStatusText = "Scheduled";

            if (status.includes("live") || status.includes("in_progress")) {
                gameStatus = 2;
                gameStatusText = "In Progress";
            } else if (
                status.includes("final") ||
                status.includes("completed")
            ) {
                gameStatus = 3;
                gameStatusText = "Final";
            }

            return {
                gameId: event.id,
                gameETag: `"${event.id}"`,
                gameStatus,
                gameStatusText,
                period: competition.status?.period || 0,
                gameClock: competition.status?.displayClock || "0:00",
                gameTimeUTC: event.date || new Date().toISOString(),
                regulationPeriods: 4,
                seriesGameNumber: "1",
                seriesText: "",
                shortName: event.shortName || "",
                homeTeam: {
                    teamId: homeTeam.team?.id,
                    teamName: homeTeam.team?.name || "",
                    teamTricode: homeTeam.team?.abbreviation || "",
                    wins: homeTeam.records?.[0]?.wins || 0,
                    losses: homeTeam.records?.[0]?.losses || 0,
                    score: Number.parseInt(homeTeam.score || "0"),
                },
                awayTeam: {
                    teamId: awayTeam.team?.id,
                    teamName: awayTeam.team?.name || "",
                    teamTricode: awayTeam.team?.abbreviation || "",
                    wins: awayTeam.records?.[0]?.wins || 0,
                    losses: awayTeam.records?.[0]?.losses || 0,
                    score: Number.parseInt(awayTeam.score || "0"),
                },
            };
        })
        .filter((game): game is Game => game !== null);
}

export function getJSONField(obj: any, field: string): any {
    if (obj && typeof obj === "object") {
        if (field in obj) return obj[field];

        for (const key in obj) {
            const result = getJSONField(obj[key], field);
            if (result !== undefined) return result;
        }
    }
}

export function formatESPNScores(events: any[]): ScoreboardProps[] {
    return events
        .map((event) => {
            console.log("[v0] Formatting event:", event);

            const competition = event.boxscore?.players;
            if (!competition) return null;

            const homeTeam =
                competition[
                    event.boxscore?.teams.find(
                        (c: any) => c.homeAway === "home"
                    ).displayOrder - 1
                ];
            const awayTeam =
                competition[
                    event.boxscore?.teams.find(
                        (c: any) => c.homeAway === "away"
                    ).displayOrder - 1
                ];

            if (!homeTeam || !awayTeam) return null;

            return {
                gameId: getJSONField(event.header, "id"),
                gameTimeUTC:
                    getJSONField(event.meta, "firstPlayWallClock") ||
                    new Date().toISOString(),
                shortName:
                    homeTeam.team?.displayName +
                    " vs " +
                    awayTeam.team?.displayName,
                homeTeam: {
                    teamId: homeTeam.team.id,
                    teamName: homeTeam.team?.displayName || "",
                    teamTricode: homeTeam.team?.abbreviation || "",
                    score: Number.parseInt(
                        homeTeam.statistics[0].totals[1] || "0"
                    ),
                    logo: homeTeam.team?.logo || "",
                },
                awayTeam: {
                    teamId: getJSONField(awayTeam.team, "id"),
                    teamName: awayTeam.team?.displayName || "",
                    teamTricode: awayTeam.team?.abbreviation || "",
                    score: Number.parseInt(
                        awayTeam.statistics[0].totals[1] || "0"
                    ),
                    logo: awayTeam.team?.logo || "",
                },
            };
        })
        .filter((game): game is ScoreboardProps => game !== null);
}
