'use client';
//Estilos
import "../../globals.css";

//Componentes
import Header from '../../../componentes/Header';
import FloatingActionButton from '../../../componentes/FloatingActionButton';



export default function inicio() {


  return (
    <div className="w-full flex flex-col">

      <Header title="Inicio" />
      <FloatingActionButton />
      

    </div>
  )
}