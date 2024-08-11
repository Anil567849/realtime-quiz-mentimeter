
import Card from "./Card";

interface IleaderboardData {
    points: number;
    name: string,
    profilePicture: string
};

export function LeaderBoard({leaderboardData} : {leaderboardData: IleaderboardData[]}) {
    return (
        <div>
            <h1 className="text-3xl text-center my-4 text-black font-bold">Current Leaderboard</h1>
            <div>
                    {leaderboardData.map((el: any, index: number) => (
                        <div className="flex justify-center" key={index}>
                            <Card
                                sno={index + 1}
                                name={el.name}
                                points={el.points}
                                image={el.profilePicture}
                            />
                        </div>
                    ))}
            </div>
        </div>
    );
}