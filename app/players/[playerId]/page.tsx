import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { ArrowLeft } from "lucide-react";
import { getPlayerIdByName } from "@/api/services/getPlayerData";
import { Player } from "@/components/Player";
import { getShortName } from "@/lib/utils";

type PlayerData = {
    displayName?: string;
    age?: number;
    position?: {
        displayName?: string;
    };
    // add other properties as needed
};

export default async function playerPage({
    params,
}: {
    params: { playerId: string };
}) {
    const { playerId } = await params
    const playerShortName = getShortName('player', playerId);
    const playerData = await getPlayerIdByName(playerShortName);

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
            <MainNav />
            <div className="container mx-auto px-4 py-8">
                <Link
                    href="#"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
                >
                    <ArrowLeft size={20} />
                    Volver a partidos
                </Link>
                <Player playerData={playerData} />
            </div>
        </main>
    );
}
