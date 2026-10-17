import React, { useState, useRef } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ContactForm from '../../components/ContactForm';
import Image from 'next/image';
import EncontrarEmpresa from '../../components/EncontrarEmpresa';
import Seo from '../../components/Seo';
import toBrMoney from '@/lib/toBrMoney';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import RecommendedItems from '../../components/RecommendedItems';
import { getListingById, getRecommended, parseId } from '@/lib/listings';
import { absoluteUrl, breadcrumbJsonLd, listingPath, listingSlug, SITE_NAME, SITE_URL } from '@/lib/site';

const truncate = (text, maxLength) => {
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (clean.length <= maxLength) return clean;
    return `${clean.slice(0, maxLength - 1).replace(/\s+\S*$/, '')}…`;
};

const buildDescription = (product) => {
    const { item, tipo } = product;
    const local = [item.bairro, item.cidade, item.estado].filter(Boolean).join(', ');
    const tipoTexto = tipo === 'Empresa' ? 'Empresa à venda' : (item.aluguel ? 'Imóvel para alugar' : 'Imóvel à venda');
    const base = `${tipoTexto}${local ? ` em ${local}` : ''}: ${item.titulo}.`;
    return truncate(item.descricao ? `${base} ${item.descricao}` : `${base} Saiba mais com a MGA Corretora.`, 160);
};

const buildListingJsonLd = (product) => {
    const { item, tipo } = product;
    const url = absoluteUrl(listingPath(item));
    const images = [item.imagem, ...(item.details_images || [])].filter(Boolean);
    const price = Number(item.valor_pretendido);
    const offer = Number.isFinite(price) && price > 0 ? {
        '@type': 'Offer',
        url,
        price: price.toFixed(2),
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock',
        businessFunction: item.aluguel ? 'http://purl.org/goodrelations/v1#LeaseOut' : 'http://purl.org/goodrelations/v1#Sell',
        seller: { '@type': 'RealEstateAgent', '@id': `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    } : undefined;
    const place = {
        '@type': 'Place',
        address: {
            '@type': 'PostalAddress',
            addressLocality: item.cidade || undefined,
            addressRegion: item.estado || undefined,
            streetAddress: item.bairro || undefined,
            addressCountry: 'BR',
        },
    };

    if (tipo === 'Imovel') {
        return {
            '@context': 'https://schema.org',
            '@type': 'RealEstateListing',
            '@id': `${url}#anuncio`,
            name: item.titulo,
            description: item.descricao || undefined,
            url,
            image: images.length ? images : undefined,
            datePosted: item.data_registro || undefined,
            identifier: String(item.id),
            offers: offer,
            about: {
                ...place,
                '@type': 'Accommodation',
                name: item.titulo,
                floorSize: item.area_construida ? { '@type': 'QuantitativeValue', value: Number(item.area_construida), unitCode: 'MTK' } : undefined,
            },
        };
    }

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${url}#anuncio`,
        name: item.titulo,
        description: item.descricao || undefined,
        url,
        image: images.length ? images : undefined,
        sku: String(item.id),
        category: item.categoria ? `Empresa à venda: ${item.categoria}` : 'Empresa à venda',
        offers: offer ? { ...offer, areaServed: place } : undefined,
    };
};

const ProductPage = ({ product, recommended }) => {
    const id = product.item.id;
    const [selectedImage, setSelectedImage] = useState(product.item.imagem || '');
    const sliderRef = useRef(null);

    const handleImageClick = (image, index) => {
        setSelectedImage(image);
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(index);
        }
    };

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
            case 'id':
                return 'Código:';
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
                return null;
            default:
                return (value === null || value === undefined || value === 'null' || value == '') ? 'Não informado' : value;
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
        'id',
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
        'id',
        'descricao'
    ];

    const isImovel = product.tipo === 'Imovel';

    const orderedKeys = isImovel ? imovelKeys : empresaKeys;

    const settings = {
        dots: product.item.details_images ? (product.item.details_images.length > 6) ? true : false : false,
        infinite: true,
        speed: 500,
        slidesToShow: product.item.details_images ? (product.item.details_images.length < 6 ? product.item.details_images.length + 1 : 6) : 1,
        slidesToScroll: 1,
        initialSlide: 0,
        arrows: false,
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Seo
                title={product.item.titulo}
                description={buildDescription(product)}
                path={listingPath(product.item)}
                image={product.item.imagem || undefined}
                imageAlt={product.item.titulo}
                jsonLd={[
                    buildListingJsonLd(product),
                    breadcrumbJsonLd([
                        { name: 'Início', path: '/' },
                        isImovel ? { name: 'Imóveis', path: '/imoveis' } : { name: 'Empresas', path: '/empresas' },
                        { name: product.item.titulo, path: listingPath(product.item) },
                    ]),
                ]}
            />
            <Header />
            <div className="flex w-full justify-center">
                <div className="sm:w-10/12 w-full">
                    <EncontrarEmpresa />
                </div>
            </div>
            <div className="flex-grow flex m-4">
                <div className="w-full grid grid-cols-12">
                    <div className="w-full grid grid-cols-12 md:my-4 col-span-12 lg:col-start-2 lg:col-end-12 2xl:col-start-3 2xl:col-end-11">
                        <div className='col-span-12 md:col-span-6'>
                            <div className="text-4xl font-bold mb-6 col-span-12 text-red-800 ml-6 flex flex-wrap">
                                <h1>{product.item.titulo}</h1>
                            </div>

                            <div className='col-span-12'>
                                <div className='h-auto min-h-80 mb-5 p-2'>
                                    <div className='mb-5 w-full'>
                                        <Image src={selectedImage ? selectedImage : '/placeholder.png'} alt={product.item.titulo} width={800} height={600} priority />
                                    </div>
                                    {product.item.details_images && product.item.details_images.length > 0 &&
                                        <div className="slider-container">
                                            <Slider ref={sliderRef} {...settings}>
                                                {[product.item.imagem, ...product.item.details_images].filter(Boolean).map((image, index) => (
                                                    <div key={index} className="thumbnail" onClick={() => handleImageClick(image, index)}>
                                                        <Image src={image} alt={`${product.item.titulo} - foto ${index + 1}`} width={160} height={120} />
                                                    </div>
                                                ))}
                                            </Slider>
                                        </div>
                                    }
                                </div>

                                {product.item.comodos && product.item.comodos.length > 0 && (
                                    <div className='col-span-12 md:col-span-6 flex flex-col gap-4 p-3 mt-5 md:mt-8 lg:mt-10 xl:mt-15 h-fit'>
                                        <div className='grid-cols-2 grid'>
                                            {product.item.comodos.map((comodo, index) => (
                                                <div key={index} className='h-full flex col-span-1'>
                                                    <div className='flex flex-grow'>
                                                        <div className='bg-yellow-600 w-1 h-full mr-3'></div>
                                                        <p className="text-lg flex">{comodo.quantidade} {comodo.nome}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className='flex flex-col p-5 shadow-lg rounded-lg mt-4'>
                                    <h2 className='text-xl font-semibold'>Descrição:</h2>
                                    <p>{product.item.descricao}</p>
                                </div>
                            </div>
                        </div>

                        <div className='col-span-0 md:col-span-1'></div>
                        <div className='col-span-12 md:col-span-5 flex flex-col gap-4 p-3 mt-5 md:mt-8 lg:mt-10 xl:mt-15 h-fit'>
                            <div className='flex justify-between p-1 flex-col md:flex-row'>
                                <h2 className="font-semibold text-2xl text-red-800">Valor Pretendido:</h2>
                                <p className="text-3xl text-yellow-600">{toBrMoney(product.item.valor_pretendido)}</p>
                            </div>
                            {orderedKeys.map((key, index) => {
                                const value = product.item[key];
                                const label = mapKeyToLabel(key);
                                const component = mapValueToComponent(key, value);

                                if (component == null) {
                                    return null;
                                }

                                return (
                                    <div key={key}>
                                        <div className='h-px bg-yellow-600'></div>
                                        <div className='flex justify-between p-1'>
                                            <span className="font-semibold text-xl">{label}</span>
                                            <p className="text-lg">{component}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className='col-span-12 p-8'>
                            {product.tipo == "Empresa" ?
                                <p className='text-xs'>
                                    *  Maiores detalhes, agendamento de visitas, através de nossos agentes de negócios nos telefones indicados. * Os valores financeiros foram descritos de acordo com informações fornecidas pelos proprietários da empresa, a MGA CORRETORA não realizou até o momento qualquer tipo de consultoria, auditoria ou diligência. Os compradores poderão realizar a etapa de diligência durante o período de compromisso de intenção de compra e venda.
                                </p>
                                :
                                <p className='text-xs'>
                                    *  Maiores detalhes, agendamento de visitas, através de nossos agentes de negócios nos telefones indicados.
                                </p>
                            }
                        </div>

                        <div className='col-span-12 flex justify-center items-center'>
                            <h2 className='text-lg'>Se interessou? Entre em Contato:</h2>
                        </div>

                        <ContactForm defaultSubject={`Interesse no anúncio ${id} - ${product.item.titulo}`} />

                        <div className="col-span-12">
                            <div className="flex items-center m-6">
                                <div className="flex-grow h-px bg-red-900 mr-4 rounded-md"></div>
                                <h2 className="text-3xl font-bold text-red-800 p-3">
                                    Relacionados
                                </h2>
                                <div className="flex-grow h-px bg-red-900 mr-4 rounded-md"></div>
                            </div>
                            <RecommendedItems tipo={product.tipo} id={id} items={recommended} />
                        </div>
                        <div className="col-span-3 2xl:col-start-10"></div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

// A navegação entre anúncios (ex.: "Relacionados") reaproveita a página no cliente; a key força
// remontar para a foto selecionada e o assunto do formulário não ficarem os do anúncio anterior.
const ProductPageRoute = (props) => <ProductPage key={props.product.item.id} {...props} />;

export default ProductPageRoute;

export async function getServerSideProps({ params, res }) {
    const id = parseId(params.slug);
    if (!id) {
        return { notFound: true };
    }

    let product;
    try {
        product = await getListingById(id);
    } catch (error) {
        console.error('Error loading listing:', error.message);
        throw error;
    }

    if (!product) {
        return { notFound: true };
    }

    // Uma única URL por anúncio: /anuncio/<id>-<titulo>
    const canonicalSlug = listingSlug(product.item);
    if (params.slug !== canonicalSlug) {
        return { redirect: { destination: listingPath(product.item), permanent: true } };
    }

    let recommended = [];
    try {
        recommended = await getRecommended(product.tipo, id);
    } catch (error) {
        console.error('Error loading recommended items:', error.message);
    }

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return { props: { product, recommended } };
}
