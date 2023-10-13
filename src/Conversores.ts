// Neste arquivo conversores, vamos sempre converter uma 
// resposta de consulta do Oracle para um tipo que desejarmos
// portanto o intuito desse arquivo typescript é reunir funções
// que convertam de "linha do oracle" para um array javascript onde
// cada elemento represente um elemento de um tipo. 

import { Aeronave } from "./Campos";
import { Aeroporto } from "./Campos";
import { Trecho } from "./Campos";
import { Voo } from "./Campos";
import { Dados } from "./Campos";


export function rowsToAeronaves(oracleRows: unknown[] | undefined) : Array<Aeronave> {
  // vamos converter um array any (resultados do oracle)
  // em um array de Aeronave
  let aeronaves: Array<Aeronave> = [];
  let aeronave;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      aeronave = {
        codigo: registro.CODIGO,
        fabricante: registro.FABRICANTE,
        modelo: registro.MODELO,
        anoFabricacao: registro.ANO_FABRICACAO,
        totalAssentos: registro.TOTAL_ASSENTOS,
        referencia: registro.REFERENCIA,
      } as Aeronave;

      // inserindo o novo Array convertido.
      aeronaves.push(aeronave);
    })
  }
  return aeronaves;
}

export function rowsToDados(oracleRows: unknown[] | undefined) : Array<Dados>{
  // vamos converter um array any (resultados do oracle)
  // em um array de Aeronave
  let dados: Array<Dados> = [];
  let dado;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      dado = {
        codigo: registro.CODIGO,
        data: registro.DATA_VOO,
        trecho: registro.NOME,
        hrSaida: registro.HR_SAIDA,
        hrChegada: registro.HR_CHEGADA,
        origem: registro.ORIGEM,
        destino: registro.DESTINO,
      } as Dados;

      // inserindo o novo Array convertido.
      dados.push(dado);
    })
  }
  return dados;
}