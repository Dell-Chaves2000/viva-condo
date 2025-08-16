/*const Home = () => {
  return(
  <div className="flex fçex-col items-center justify-center h-screen">
    <h1 className="text-4x1 font-bold"> Olá mundo!!</h1>
    </div>
  );
};

export default Home*/

"use client";

type Morador = {
  primeiroNome: string;
  sobrenome: string;
}

export default function Home() {


function formatarNomeMorador(morador:Morador) {

  return morador.primeiroNome + ' ' + morador.sobrenome
}

const morador = {
  primeiroNome: 'Sandro',
  sobrenome: 'Pereira'
}

function obterSaudacao(morador: null | Morador) {
  if(morador) {
    return <span>Olá, {formatarNomeMorador(morador)}!</span>
  }
  return (<span>Olá, Estranho!!!</span>)
}

return (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-4x1 font-bold">{obterSaudacao(morador)}</h1>
  </div>
)
}
