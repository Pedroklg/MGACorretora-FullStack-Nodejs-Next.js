import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toBrMoney from '@/lib/toBrMoney';
import { listingPath } from '@/lib/site';
import { IconMapPin } from '../components/Icons';

const RecommendedItems = ({ tipo, id, items }) => {
    const [fetchedItems, setFetchedItems] = useState([]);
    const recommendedItems = items || fetchedItems;

    useEffect(() => {
        if (items) return;

        const fetchRecommendedItems = async () => {
            try {
                const params = new URLSearchParams({ tipo, id: String(id) });
                const response = await fetch(`/api/recommendedItems?${params.toString()}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch recommended items');
                }
                const data = await response.json();
                setFetchedItems(data);
            } catch (error) {
                console.error('Error fetching recommended items:', error);
            }
        };

        if (tipo && id) {
            fetchRecommendedItems();
        }
    }, [tipo, id, items]);

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recommendedItems.map((item) => (
                    <Link
                        key={item.id}
                        href={listingPath(item)}
                        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:cursor-pointer hover:shadow-xl hover:scale-105 transition duration-300 ease-in-out"
                    >
                        <Image
                            src={item.imagem || '/placeholder.png'}
                            alt={item.titulo}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-6 flex flex-col">
                            <h3 className="text-xl font-bold mb-2">{item.titulo}</h3>
                            <div className="text-gray-700 flex items-center gap-1">
                                <span className='flex items-center text-green-700 mb-0.5'>{IconMapPin}</span>
                                {item.cidade} - {item.estado}
                            </div>
                            <p className="text-green-700 text-sm ml-4">{item.bairro}</p>
                            <p className="text-yellow-600 text-xl font-semibold">{toBrMoney(item.valor_pretendido)}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecommendedItems;
