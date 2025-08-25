import React from 'react';

const Carddetails = React.memo(function Carddetails(params) {
    return(
        <div className="w-full h-25 p-2 mx-auto bg-white rounded-lg">
            <h2 className="text-xl font-bold leading-none text-gray-800">{params.title}</h2>
            <h1 className="text-3xl hover:text-yellow-300 cursor-grab flex  justify-center pt-4 font-bold text-gray-700">{params.text}</h1>
        </div>
    );
});

export default Carddetails;