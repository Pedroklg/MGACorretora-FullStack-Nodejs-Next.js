import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Banner() {
    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    return (
        <div className="flex h-auto w-full justify-center items-center content-center overflow-hidden">
            <Slider {...settings} className="w-full">
                <div className="w-full flex justify-center items-center">
                    <div className="w-full">
                        <Image
                            src="/Banner_1.png"
                            alt="banner 1"
                            layout="responsive"
                            width={2000}
                            height={750}
                            quality={100}
                        />
                    </div>
                </div>
                <div className="w-full flex justify-center items-center">
                    <div className="w-full">
                        <Image
                            src="/Banner_2.png"
                            alt="banner 2"
                            layout="responsive"
                            width={2000}
                            height={750}
                            quality={100}
                        />
                    </div>
                </div>
            </Slider>
        </div>
    );
}
