/***
 * Versão melhorada do backend. 
 * 
 * 1 - externalização da constante oraConnAttribs (pois é usada em todos os serviços);
 * O processo de externalizar é tirar aquela constante de dentro de cada serviço e colocá-la na área "global"
 * 
 * 2 - criação de um tipo estruturado chamado aeronave.
 * 
 * 3 - criação de uma função para validar se os dados da aeronave existem.
 * 
 * 4 - retorno correto do array em JSON para representar as AERONAVES cadastradas. 
 * 
 */
// recursos/modulos necessarios.
import express from "express";
import oracledb from "oracledb";
import cors from "cors";

// aqui vamos importar nossos tipos para organizar melhor (estao em arquivos .ts separados)
import { CustomResponse } from "./CustomResponse";
import { Aeronave } from "./Aeronave";

// criamos um arquivo para conter só a constante de conexão do oracle. com isso deixamos o código mais limpo por aqui
import { oraConnAttribs } from "./OracleConnAtribs";

// conversores para facilitar o trabalho de conversão dos resultados Oracle para vetores de tipos nossos.
import { rowsToAeronaves } from "./Conversores";

// validadores para facilitar o trabalho de validação.
import { aeronaveValida } from "./Validadores";

// preparar o servidor web de backend na porta 3000
const app = express();
const port = 3000;
// preparar o servidor para dialogar no padrao JSON 
app.use(express.json());
app.use(cors());

// Acertando a saída dos registros oracle em array puro javascript.
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// servicos de backend
app.get("/listarAeronaves", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
  let connection;
  try{
    connection = await oracledb.getConnection(oraConnAttribs);

    // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
    // não mais um array dentro de array.
    let resultadoConsulta = await connection.execute(`SELECT * FROM AERONAVES`); 
  
    cr.status = "SUCCESS"; 
    cr.message = "Dados obtidos";
    // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
    cr.payload = (rowsToAeronaves(resultadoConsulta.rows));

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if(connection !== undefined){
      await connection.close();
    }
    res.send(cr);  
  }
});

app.put("/inserirAeronave", async(req,res)=>{
  
  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
  // chega na requisição para um tipo nosso!
  const aero: Aeronave = req.body as Aeronave;
  console.log(aero);

  // antes de prosseguir, vamos validar a aeronave!
  // se não for válida já descartamos.
  let [valida, mensagem] = aeronaveValida(aero);
  if(!valida) {
    // já devolvemos a resposta com o erro e terminamos o serviço.
    cr.message = mensagem;
    res.send(cr);
  } else {
    // continuamos o processo porque passou na validação.
    let connection;
    try{
      const cmdInsertAero = `INSERT INTO AERONAVES 
      (CODIGO, FABRICANTE, MODELO, ANO_FABRICACAO, TOTAL_ASSENTOS, REFERENCIA)
      VALUES
      (SEQ_AERONAVES.NEXTVAL, :1, :2, :3, :4, :5)`
      const dados = [aero.fabricante, aero.modelo, aero.anoFabricacao, aero.totalAssentos, aero.referencia];
  
      connection = await oracledb.getConnection(oraConnAttribs);
      let resInsert = await connection.execute(cmdInsertAero, dados);
      
      // importante: efetuar o commit para gravar no Oracle.
      await connection.commit();
    
      // obter a informação de quantas linhas foram inseridas. 
      // neste caso precisa ser exatamente 1
      const rowsInserted = resInsert.rowsAffected
      if(rowsInserted !== undefined &&  rowsInserted === 1) {
        cr.status = "SUCCESS"; 
        cr.message = "Aeronave inserida.";
      }
  
    }catch(e){
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      //fechar a conexao.
      if(connection!== undefined){
        await connection.close();
      }
      res.send(cr);  
    }  
  }
});

app.delete("/excluirAeronave", async(req,res)=>{
  // excluindo a aeronave pelo código dela:
  const codigo = req.body.codigo as number;
 
  console.log('Codigo recebido: ' + codigo);

  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  // conectando 
  let connection;
  try{
    connection = await oracledb.getConnection(oraConnAttribs);
    const cmdDeleteAero = `DELETE AERONAVES WHERE codigo = :1`
    const dados = [codigo];

    let resDelete = await connection.execute(cmdDeleteAero, dados);
    
    // importante: efetuar o commit para gravar no Oracle.
    await connection.commit();
    
    // obter a informação de quantas linhas foram inseridas. 
    // neste caso precisa ser exatamente 1
    const rowsDeleted = resDelete.rowsAffected
    if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
      cr.status = "SUCCESS"; 
      cr.message = "Aeronave excluída.";
    }else{
      cr.message = "Aeronave não excluída. Verifique se o código informado está correto.";
    }

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    // fechando a conexao
    if(connection!==undefined)
      await connection.close();

    // devolvendo a resposta da requisição.
    res.send(cr);  
  }
});

app.listen(port,()=>{
  console.log("Servidor HTTP funcionando...");
});