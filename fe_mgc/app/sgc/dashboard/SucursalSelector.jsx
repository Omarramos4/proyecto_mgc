import React from 'react';

const SucursalSelector = React.memo(function SucursalSelector({ selectedSucursal, setSelectedSucursal }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <label className="flex items-center cursor-pointer">
        <input
          type="radio"
          name="sucursal"
          value="1"
          checked={selectedSucursal === '1'}
          onChange={(e) => setSelectedSucursal(e.target.value)}
          className="mr-2 text-blue-600"
        />
        <span className="text-sm font-medium text-gray-700">H.M. Central</span>
      </label>
      <label className="flex items-center cursor-pointer">
        <input
          type="radio"
          name="sucursal"
          value="2"
          checked={selectedSucursal === '2'}
          onChange={(e) => setSelectedSucursal(e.target.value)}
          className="mr-2 text-blue-600"
        />
        <span className="text-sm font-medium text-gray-700">H.M. Regional</span>
      </label>
    </div>
  );
});

export default SucursalSelector;
