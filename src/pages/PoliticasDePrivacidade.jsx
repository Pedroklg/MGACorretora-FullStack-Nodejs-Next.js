import Footer from "../components/Footer";
import Header from "../components/Header";
import Link from 'next/link';

function PoliticasDePrivacidade() {
    return (
        <div>
            <Header />
            <div className="flex justify-center pb-8">
                <div className="md:w-3/6 w-11/12 flex flex-col justify-center items-start p-4">
                    <div className="p-5 text-4xl text-red-800">
                        <h1>Políticas de Privacidade</h1>
                    </div>
                    <div className="w-full border-t-2 border-red-800"></div>
                    <p className="text-lg p-2">
                        A MGA Corretora esta comprometida em proteger a sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos, e compartilhamos suas informações pessoais quando você utiliza nosso site.
                    </p>
                    <div className="w-full border-t border-red-800 opacity-20"></div>
                    <h2 className="text-2xl text-red-800 p-2">Dados Coletados</h2>
                    <p className="text-lg p-2">
                        <strong>Informações Fornecidas Voluntariamente</strong><br />
                        Coletamos informações pessoais que você nos fornece voluntariamente quando preenche o formulário de cadastro. Essas informações incluem:
                    </p>
                    <ul className="list-disc ml-10 text-lg">
                        <li>Nome Completo</li>
                        <li>Tipo de Empresa ou Imóvel</li>
                        <li>Celular</li>
                        <li>Email</li>
                        <li>Tipo de Empresa</li>
                        <li>Estado</li>
                        <li>Cidade</li>
                        <li>Bairro</li>
                        <li>Número</li>
                        <li>Endereço</li>
                        <li>Telefone da Empresa</li>
                        <li>Complemento</li>
                        <li>Descrição</li>
                        <li>Informações Adicionais</li>
                    </ul>
                    <div className="w-full border-t border-red-800 opacity-20"></div>
                    <h2 className="text-2xl text-red-800 p-2">Uso das Informações</h2>
                    <p className="text-lg p-2">
                        Usamos as informações coletadas para:
                    </p>
                    <ul className="list-disc ml-10 text-lg">
                        <li>Entrar em contato com você em resposta ao seu cadastro.</li>
                        <li>Enviar informações e atualizações relevantes sobre nossos serviços.</li>
                        <li>Melhorar nossos serviços e atendimento ao cliente.</li>
                    </ul>
                    <div className="w-full border-t border-red-800 opacity-20"></div>
                    <h2 className="text-2xl text-red-800 p-2">Compartilhamento de Informações</h2>
                    <p className="text-lg p-2">
                        Não compartilhamos, vendemos ou trocamos suas informações pessoais com terceiros, exceto conforme descrito abaixo:
                    </p>
                    <ul className="list-disc ml-10 text-lg">
                        <li>
                            <strong>Provedores de Serviços:</strong> Podemos compartilhar suas informações com provedores de serviços que nos auxiliam na operação do nosso site e na prestação de serviços a você. Esses provedores de serviços estão obrigados a manter suas informações confidenciais e seguras.
                        </li>
                    </ul>
                    <div className="w-full border-t border-red-800 opacity-20"></div>
                    <h2 className="text-2xl text-red-800 p-2">Segurança das Informações</h2>
                    <p className="text-lg p-2">
                        Implementamos uma variedade de medidas de segurança para proteger suas informações pessoais. Utilizamos métodos seguros de transmissão de dados e armazenamento de informações para proteger contra acesso não autorizado, alteração, divulgação ou destruição de suas informações pessoais.
                    </p>
                    <div className="w-full border-t border-red-800 opacity-20"></div>
                    <h2 className="text-2xl text-red-800 p-2">Seus Direitos</h2>
                    <p className="text-lg p-2">
                        Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Se desejar exercer esses direitos, por favor, entre em contato conosco através das informações de contato fornecidas abaixo.
                    </p>
                    <div className="w-full border-t border-red-800 opacity-20"></div>
                    <h2 className="text-2xl text-red-800 p-2">Alterações a Esta Política de Privacidade</h2>
                    <p className="text-lg p-2">
                        Podemos atualizar esta Política de Privacidade periodicamente. Qualquer alteração será publicada nesta página, e a data de revisão será atualizada. Recomendamos que você revise esta política regularmente para estar ciente de quaisquer mudanças.
                    </p>
                    <div className="w-full border-t border-red-800 opacity-20"></div>
                    <h2 className="text-2xl text-red-800 p-2">Contato</h2>
                    <p className="text-lg p-2">
                        Se você tiver qualquer dúvida ou preocupação sobre esta Política de Privacidade ou sobre nossas práticas de privacidade, por favor, entre em contato conosco:
                        <Link href="/Contato" className="text-red-800 text-xl hover:cursor-pointer hover:text-gray-950 duration-150">
                            Entrar em contato
                        </Link>
                    </p>
                    <p className="text-md p-2">
                        Data da Última Atualização: 16/06/2024
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default PoliticasDePrivacidade;