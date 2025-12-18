import { PlayerProps } from "./types";


export function Player({
    playerData,
}: PlayerProps) {
    //console.log("Player Data:", playerData);

    const { displayName, age, position, displayHeight, nationality, imageUrl, teamName, jerseyNumber } = playerData;

    return (
        <section className="profile-hero">
            <div className="bg-number">{jerseyNumber}</div>
            <div className="container hero-layout">
                
                <div className="player-data">
                    <div className="player-identity">
                        <h1>{displayName}</h1>
                    </div>
                    <div className="player-team-info">
                         {teamName} | #{jerseyNumber}
                    </div>

                    <div className="meta-data-grid">
                        <div className="meta-chip"><i className="fas fa-basketball"></i> {position}</div>
                        <div className="meta-chip"><i className="fas fa-ruler-vertical"></i> {displayHeight}</div>
                        <div className="meta-chip"><i className="fas fa-flag"></i> {nationality}</div>
                        <div className="meta-chip"><i className="fas fa-birthday-cake"></i> {age} Años</div>
                    </div>

                    <button className="btn-follow">Seguir Jugador</button>
                </div>

                <div className="headshot-container">
                    <div className="headshot-frame">
                        <img src={imageUrl} alt={displayName} />
                    </div>
                </div>

            </div>
        </section>
    );
}
