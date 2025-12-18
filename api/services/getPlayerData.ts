import { getJSONField } from "@/lib/utils";
import "server-only";

export interface GetPlayerDataOptions {
    cacheSeconds?: number;
}

const ESPN_BASE =
    "https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba";

export async function getPlayerIdByName(name: string): Promise<PlayerProps> {
    const url = `https://site.api.espn.com/apis/common/v3/search?region=us&lang=en&query=${encodeURIComponent(
        name
    )}&limit=5&type=player`;

    const res = await fetch(url, { cache: "force-cache" }); // Cacheamos esto porque la lista de jugadores no cambia cada minuto

    if (!res.ok) throw new Error("No se pudo cargar la lista de jugadores");

    const data = await res.json();
    const athletes = data.items || [];

    const foundPlayer = athletes.find((athlete: { league: string }) =>
        athlete.league.toLowerCase().includes("nba")
    );

    if (!foundPlayer) {
        throw new Error(
            `No se encontró ningún jugador con el nombre: "${name}"`
        );
    }

    const formatedData: PlayerProps = {
        id: foundPlayer.id,
        teamId: getJSONField(foundPlayer.teamRelationships, "id"),
        teamName: getJSONField(foundPlayer.teamRelationships, "displayName"),
        displayName: foundPlayer.displayName,
        shortName: foundPlayer.shortName,
        jerseyNumber: foundPlayer.jersey,
    };

    return getPlayerData(formatedData);
}

interface PlayerProps {
    id: string;
    teamId?: string;
    teamName?: string;
    displayName?: string;
    shortName?: string;
    jerseyNumber?: string;
    age?: number;
    position?: string;
    weight?: string;
    displayHeight?: string;
    height?: string;
    birthDate?: string;
    nationality?: string;
    debutYear?: string;
    draftYear?: string;
    experience?: string;
    imageUrl?: string;
    // add other properties as needed
}

async function getPlayerData(
    playerdata: PlayerProps,
    cacheSeconds: number = 3600
): Promise<PlayerProps> {
    const url = `${ESPN_BASE}/athletes/${encodeURIComponent(
        playerdata.id
    )}?lang=es`;

    const options: RequestInit & { next?: { revalidate?: number } } =
        cacheSeconds && cacheSeconds > 0
            ? { next: { revalidate: cacheSeconds } }
            : { cache: "no-store" };

    const res = await fetch(url, options);

    if (!res.ok) {
        throw new Error(
            `API Error ${res.status}: no se pudo obtener el jugador ${playerdata.displayName}`
        );
    }

    const data = await res.json();

    playerdata.age = data.age;
    playerdata.position = getPositionName(getJSONField(data, "position")?.displayName, data.height);
    playerdata.weight = data.displayWeight;
    playerdata.displayHeight = data.displayHeight;
    playerdata.height = data.height;
    playerdata.birthDate = data.dateOfBirth;
    playerdata.nationality = getJSONField(data, "country");
    playerdata.debutYear = data.debutYear;
    playerdata.draftYear = getJSONField(data.draft?.displayName, "draft")?.year;
    playerdata.experience = data.experience?.years;
    playerdata.imageUrl = getJSONField(data, "headshot")?.href;

    console.log("Detailed player data:", playerdata.height);

    return playerdata;
}


const getPositionName = (positionName: string, height: string): string => {
    if (positionName === 'Centro') return 'Pívot';

    if (positionName === 'Atacante') {
        const heightInInches = parseInt(height);
        if (heightInInches >= 80) return 'Ala Pívot';
        else return 'Alero';
    }

    return positionName;
}
