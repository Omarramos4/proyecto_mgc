import React from 'react';

const SucursalSelector = React.memo(function SucursalSelector({ selectedSucursal, setSelectedSucursal }) {

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <label
        className={`flex items-center cursor-pointer rounded-lg px-3 py-2 transition-all duration-300
          ${selectedSucursal === '1'
            ? 'bg-gradient-to-br from-red-500 to-yellow-400 text-white shadow-lg'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
        `}
      >
        <input
          type="radio"
          name="sucursal"
          value="1"
          checked={selectedSucursal === '1'}
          onChange={(e) => setSelectedSucursal(e.target.value)}
          className="mr-2 accent-red-500"
        />
        <span className={`text-sm font-bold transition-colors duration-300 ${selectedSucursal === '1' ? 'text-white' : 'text-gray-700'}`}>H.M. Central</span>
      </label>
      <label
        className={`flex items-center cursor-pointer rounded-lg px-3 py-2 transition-all duration-300
          ${selectedSucursal === '2'
            ? 'bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-lg'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
        `}
      >
        <input
          type="radio"
          name="sucursal"
          value="2"
          checked={selectedSucursal === '2'}
          onChange={(e) => setSelectedSucursal(e.target.value)}
          className="mr-2 accent-blue-600"
        />
        <span className={`text-sm font-bold transition-colors duration-300 ${selectedSucursal === '2' ? 'text-white' : 'text-gray-700'}`}>H.M. Regional</span>
      </label>
    </div>
  );
});

export default SucursalSelector;
