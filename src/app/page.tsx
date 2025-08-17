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
};

export default function Home() {
  function formatarNomeMorador(morador: Morador) {
    return morador.primeiroNome + " " + morador.sobrenome;
  }

  const morador = {
    primeiroNome: "Sandro",
    sobrenome: "Pereira",
  };

  function obterSaudacao(morador: null | Morador) {
    if (morador) {
      return (
        <div className="border border-blue bg-blue-500 text-white px-4 py-2 rounded-lg">
          Olá, {formatarNomeMorador(morador)}!
        </div>
      );
    }
    return (
      <div className="border border-blue bg-blue-500 text-white px-4 py-2 rounded-lg">
        Olá, Estranho!!!
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">{obterSaudacao(morador)}</h1>
    </div>
  );
}