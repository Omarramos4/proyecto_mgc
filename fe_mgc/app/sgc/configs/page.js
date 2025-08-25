'use client';
//Estilos
import "../../globals.css";

//Componentes
import Header from '../../../componentes/Header';

import { redirect } from 'next/navigation';
import Cookies from 'js-cookie';

//DATOS
import { useSuspenseQuery } from '@apollo/client';

export default function configs() {


  return (
    <div className="w-full flex flex-col">

      <Header title="Configuraciones del Sistema" />

    </div>
  )
}