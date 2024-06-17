import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LoadingSpinner from '../../components/animations/LoadingSpinner';
import ContactForm from '../../components/ContactForm';
import Image from 'next/image';
import EncontrarEmpresa from '../../components/EncontrarEmpresa';
import toBrMoney from '../api/utils/toBrMoney';
import { useRouter } from 'next/router';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { showErrorToast } from '../../components/animations/toastService';
import RecommendedItems from '../../components/RecommendedItems';

const ProductPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/idSearch?id=${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }
                const data = await response.json();
                setProduct(data);
                setSelectedImage(data.item.imagem);
            } catch (error) {
                console.error('Error fetching product:', error);
                showErrorToast('Erro ao buscar produto');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-grow">
                    <LoadingSpinner isLoading={true} />
                </div>
                <Footer />
            </div>
        );
    }

    if (!product && !loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-grow">
                    <div className='text-center text-3xl font-semibold text-black flex justify-center'>
                        <span className=''>Produto não encontrado</span>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const mapKeyToLabel = (key) => {
        switch (key) {
            case 'titulo':
                return null;
            case 'tempo_de_mercado':
                return 'Tempo de Mercado:';
            case 'funcionarios':
                return 'Funcionários:';
            case 'motivo_da_venda':
                return 'Motivo da Venda:';
            case 'valor_pretendido':
                return null;
            case 'condicoes':
                return 'Condições:';
            case 'descricao':
                return 'Descrição:';
            case 'funcionamento':
                return 'Funcionamento:';
            case 'sobre_imovel':
                return 'Sobre o Imóvel:';
            case 'bairro':
                return 'Bairro:';
            case 'aceita_permuta':
                return 'Aceita Permuta:';
            case 'tem_divida':
                return 'Tem Dívida:';
            case 'estado':
                return 'Estado:';
            case 'cidade':
                return 'Cidade:';
            case 'categoria':
                return 'Categoria:';
            case 'imagem':
                return 'Imagem:';
            case 'details_images':
                return 'Imagens Detalhadas:';
            case 'area_construida':
                return 'Área Construída:';
            case 'area_util':
                return 'Área Útil:';
            case 'aluguel':
                return 'Finalidade:';
            case 'data_registro':
                return null;
            default:
                return key;
        }
    };

    const mapValueToComponent = (key, value) => {
        switch (key) {
            case 'valor_pretendido':
                return toBrMoney(value);
            case 'aceita_permuta':
            case 'tem_divida':
                return value ? 'Sim' : 'Não';
            case 'aluguel':
                return value ? 'Aluguel' : 'Venda';
            case 'area_construida':
                return `${value} m²`;
            case 'area_util':
                return `${value} m²`;
            case 'details_images':
                return null;
            case 'imagem':
                return null;
            case 'descricao':
                return null;
            case 'data_registro':
                return null;
            case 'valor_pretendido':
                return null;
            case 'titulo':
                return null
            default:
                return (value === null || value === undefined || value === 'null') ? 'Não informado' : value;
        }
    };

    const empresaKeys = [
        'titulo',
        'estado',
        'cidade',
        'bairro',
        'categoria',
        'tempo_de_mercado',
        'funcionarios',
        'motivo_da_venda',
        'condicoes',
        'funcionamento',
        'sobre_imovel',
        'aceita_permuta',
        'tem_divida',
        'descricao'
    ];

    const imovelKeys = [
        'titulo',
        'estado',
        'cidade',
        'bairro',
        'aluguel',
        'area_construida',
        'area_util',
        'motivo_da_venda',
        'condicoes',
        'aceita_permuta',
        'tem_divida',
        'descricao'
    ];

    const isImovel = product && 'area_construida' in product.item;

    const orderedKeys = isImovel ? imovelKeys : empresaKeys;

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: product.item.details_images ? product.item.details_images.length + 1 : 1,
        slidesToScroll: 1,
        initialSlide: 0,
        arrows: false,
    };

    return (
        <div className="flex flex-col min-h-screen">
            <title>{product.item.titulo}</title>
            <Header />
            <div className="flex w-full justify-center">
                <div className="sm:w-10/12 w-full">
                    <EncontrarEmpresa />
                </div>
            </div>
            <div className="flex-grow flex m-4">
                <div className="w-full grid grid-cols-12">
                    <div className="w-full grid grid-cols-12 md:my-4 col-span-12 md:col-start-3 md:col-end-11">
                        <div className='col-span-12 md:col-span-6'>
                            <div className="text-4xl font-bold mb-6 col-span-12 text-red-800 ml-6 flex flex-wrap">
                                <h1>{product.item.titulo}</h1>
                            </div>

                            <div className='col-span-12'>
                                <div className='h-auto min-h-80 mb-5 p-2'>
                                    <div className='mb-5 w-full'>
                                        <Image src={selectedImage} alt="Imagem" width={800} height={600} priority />
                                    </div>
                                    {product.item.details_images && product.item.details_images.length > 0 &&
                                        <div className="slider-container">
                                            <Slider {...settings}>
                                                {[product.item.imagem, ...product.item.details_images].map((image, index) => (
                                                    <div key={index} className="thumbnail" onClick={() => handleImageClick(image)}>
                                                        <Image src={image} alt={`Imagem ${index + 1}`} width={160} height={120} />
                                                    </div>
                                                ))}
                                            </Slider>
                                        </div>
                                    }
                                </div>

                                <div className='flex flex-col p-5 shadow-lg rounded-lg mt-4'>
                                    <h1 className='text-xl font-semibold'>Descrição:</h1>
                                    <p>{product.item.descricao}</p>
                                </div>
                            </div>
                        </div>

                        <div className='col-span-0 md:col-span-1'></div>
                        <div className='col-span-12 md:col-span-5 flex flex-col gap-4 shadow-lg p-3 rounded-lg mt-5 md:mt-10 lg:mt-15 xl:mt-20 h-fit'>
                            <div className='flex justify-between p-1 flex-col md:flex-row'>
                                <h1 className="font-semibold text-2xl text-red-800">Valor Pretendido:</h1>
                                <p className="text-xl text-yellow-600">{toBrMoney(product.item.valor_pretendido)}</p>
                            </div>
                            {orderedKeys.map((key, index) => {
                                const value = product.item[key];
                                const label = mapKeyToLabel(key);
                                const component = mapValueToComponent(key, value);

                                // Skip rendering if component is null or undefined
                                if (component == null) {
                                    return null;
                                }

                                return (
                                    <div key={key} className={index % 2 === 0 ? 'bg-gray-200' : ''}>
                                        <div className='flex justify-between p-1'>
                                            <h1 className="font-semibold text-xl">{label}</h1>
                                            <p className="text-lg">{component}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className='col-span-12 p-8'>
                            <p className='text-xs'>
                                *  Maiores detalhes, agendamento de visitas, através de nossos agentes de negócios nos telefones indicados. * Os valores financeiros foram descritos de acordo com informações fornecidas pelos proprietários da empresa, a MGA CORRETORA não realizou até o momento qualquer tipo de consultoria, auditoria ou diligência. Os compradores poderão realizar a etapa de diligência durante o período de compromisso de intenção de compra e venda.
                            </p>
                        </div>

                        <div className='col-span-12 flex justify-center items-center'>
                            <h1 className='text-lg'>Se interessou? Entre em Contato:</h1>
                        </div>

                        <ContactForm />

                        <div className="col-span-12">
                            <div className="flex items-center m-6">
                                <div className="flex-grow h-px bg-red-900 mr-4 rounded-md"></div>
                                <h1 className="text-3xl font-bold text-red-800 p-3">
                                    Relacionados
                                </h1>
                                <div className="flex-grow h-px bg-red-900 mr-4 rounded-md"></div>
                            </div>
                            <RecommendedItems tipo={product.tipo} id={id} />
                        </div>
                        <div className="col-span-3 md:col-start-10"></div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductPage;
