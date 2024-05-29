import Header from '../components/Header';
import Footer from '../components/Footer';

function Contato() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header></Header>
            <main className="flex-grow">
                <div className="flex justify-center p-5">
                    <div>
                        Ponta Grossa
                    </div>
                    <a target="_blank" href="tel:42 99909-4741">
                        <span>42 99909-4741</span>
                    </a>
                    <p> Ligue e agende a sua visita! </p>
                    <p>
                        Rua Sete de Setembro, 800 Conj. 401 | Sala 1 - 4° andar - Executivo Center
                    </p>
                </div>
            </main>
            <Footer></Footer>
        </div>
    )
}

export default Contato;