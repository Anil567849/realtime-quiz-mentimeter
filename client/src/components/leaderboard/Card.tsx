import { FaRegUser } from "react-icons/fa";

type props = {
    sno: number;
    name: string;
    points: number;
    image?: string;
};

function Card({ sno, name, points, image }: props) {
    return (
        <div className="flex justify-between items-center w-96 bg-white mb-4 rounded-2xl text-black px-4 bg-black/5">
            <div className="flex gap-4 my-5 w-5/12">
                <p className="text-black font-bold text-md">{sno}.</p>
                <h3 className="text-black font-bold text-md">{name}</h3>
            </div>
            <div>
                <p className="text-black font-bold">{points}</p>
            </div>
            <div>
                <div className="bg-white p-1 rounded-full">
                    {image ? (
                        <img
                            src={image}
                            alt={image}
                            className="w-8 rounded-full"
                        />
                    ) : (
                        <FaRegUser className="text-black text-3xl" />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Card;