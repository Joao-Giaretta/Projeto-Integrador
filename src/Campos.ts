// vamos definir um tipo chamado Aeronave. 
// vai representar para nós a estrutura de dados do que é uma aeronave.
// para usarmos esse tipo em qualquer outro código devemos exportá-lo usando a palavra
// export, veja: 

export type Aeronave = {
    codigo?: number, 
    fabricante?: string, 
    modelo?: string,
    anoFabricacao?: number, 
    totalAssentos?: number,
    referencia?: string
  }

export type Aeroporto = {
    codigo?: number, 
    nome?: string, 
    sigla?: string,
    cidade?: string, 
  }

export type Cidade = {
    codigo?: number,
    nome?: string,
    uf?: string,
    pais?: string,
}

export type Trecho = {
  codigo?: number,
  nome?: string,
  origem?: number,
  destino?: number,
  aeronave?: number,
}

export type Voo =  {
  codigo?: number,
  dataVoo?: string,
  hrChegada?: string,
  hrSaida?: string,
  valor?: number,
  trecho: number,
}

export type Assento = {
  codigo?: number,
  aeronave?: number,
  voo?: number,
}

export type Dados = {
  codigo?: number,
  data?: string,
  trecho?: string,
  hrSaida?: string,
  hrChegada?: string,
  origem?: string,
  destino?: string,
}