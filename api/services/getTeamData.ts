/* 
https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/13
https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news?team=13
https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/seasons/2025/teams/13/statistics
https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/13/roster
https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/13/schedule
*/

import "server-only";

interface TeamProps {
    id: string;
    displayName?: string;
    logoUrl?: string;    
    recordTotal?: string;
    recordTotalStats?: {
        name: string;
        value: string;
    }[];
    recordHome?: string;
    recordAway?: string;
    venueName?: string;
    venueCity?: string;
    venueState?: string;
    venueImageUrl?: string;
}

export interface GetPlayerDataOptions {
    cacheSeconds?: number;
}

const ESPN_BASE =
    "https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba";

export async function getTeamByName(name: string): Promise<TeamProps> {
    const url = `https://site.api.espn.com/apis/common/v3/search?region=en&lang=es&query=${encodeURIComponent(
        name
    )}&limit=5&type=team`;

    const res = await fetch(url, { cache: "force-cache" }); // Cacheamos esto porque la lista de equipos no cambia frecuentemente

    if (!res.ok) throw new Error("No se pudo cargar la lista de equipos");

    const data = await res.json();

    if (!data) {
        throw new Error(
            `No se encontró ningún equipo con el nombre: "${name}"`
        );
    }

    const teamId = data.items[0].id;

    const responseTeamData = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}?region=en&lang=es`
    );

    if (!responseTeamData.ok) {
        throw new Error(`API Error: ${responseTeamData.status}`);
    }

    const teamData = await responseTeamData.json();

     // console.log("Found team data:", teamData.team.franchise.venue, parseTeamData(teamData));

    return parseTeamData(teamData);
}

const parseTeamData = (data: any): TeamProps => {
    const teamInfo = data.team;
    const record = teamInfo.record.items;
    const venue = teamInfo.franchise.venue;

    const parsedData: TeamProps = {
        id: teamInfo.id,
        displayName: teamInfo.displayName,
        logoUrl: teamInfo.logos && teamInfo.logos.length > 0 ? teamInfo.logos[0].href : undefined,
        recordTotal: record ? record.find((r: any) => r.type === "total")?.summary : undefined,
        recordTotalStats: record ? record[0].stats : undefined,
        recordHome: record ? record.find((r: any) => r.type === "home")?.summary : undefined,
        recordAway: record ? record.find((r: any) => r.type === "road")?.summary : undefined,
        venueName: venue ? venue.fullName : undefined,
        venueImageUrl: venue && venue.images && venue.images.length > 0 ? venue.images[0].href : undefined,
    };

    return parsedData;
}


