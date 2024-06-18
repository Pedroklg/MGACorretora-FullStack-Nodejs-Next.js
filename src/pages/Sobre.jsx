import Footer from "../components/Footer"
import Header from "../components/Header"

function Sobre() {
    return (
        <div>
            <Header />
            <div className="flex justify-center pb-8">
                <div className="md:w-3/6 w-11/12 flex flex-col justify-center items-start p-4">
                    <div className="p-5 text-4xl text-red-800">
                        <h1>Institucional</h1>
                    </div>
                    <div class="w-full border-t-2 border-red-800"></div>
                    <h2 className="text-2xl text-red-800 p-2">Missão</h2>
                    <p className="text-lg p-1">Contribuir de forma profissional e ética com pessoas que desejam realizar o sonho de vender ou comprar empresas e imóveis ou que precisam de assessoria profissional na administração patrimonial.</p>
                    <div class="w-full border-t border-red-800 opacity-20"></div>
                    <h2 className="text-2xl text-red-800 p-2">Visão</h2>
                    <p className="text-lg p-1">Ser a maior e melhor empresa do sul do Brasil no ramo de intermediação de compra e venda de empresas e atividades do ramo imobiliário.</p>
                    <div class="w-full border-t border-red-800 opacity-20"></div>
                    <h2 className="text-2xl text-red-800 p-2">Valores</h2>
                    <p className="text-lg p-1">Sigilo e ética sobre informações fornecidas por clientes, divulgando-as nos momentos oportunos e caso se faça necessário. Respeito pelas decisões tomadas pelos clientes a qualquer etapa das negociações.</p>
                    <p className="text-lg p-1">Incentivo ao desenvolvimento e crescimento profissional de seus colaboradores e parceiros. Comportamento ético e moral perante a sociedade, clientes colaboradores.</p>
                    <div class="w-full border-t border-red-800 opacity-20"></div>
                    <h2 className="text-2xl text-red-800 p-2">Serviços Prestados</h2>
                    <ul className="list-disc ml-10 text-lg">
                        <li>Intermediação na Compra e Venda de Empresas.</li>
                        <li>Intermediação na Compra e Venda de Imóveis.</li>
                        <li>Administração de Aluguel.</li>
                        <li>Formação de Carteira de investidores para grandes projetos.</li>
                        <li>Consultoria Empresarial.</li>
                    </ul>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Sobre
