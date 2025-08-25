
export default function Card(params){
    return(
        <div className="flex justify-center items-center bg-gray-300 p-9 h-1 rounded-lg shadow-xl">
            <h1 className="text-2xl font-bold">
                {params.title}
            </h1>
            <p className="text-lg text-center">
                {params.text}
            </p>
        </div>
    );
}