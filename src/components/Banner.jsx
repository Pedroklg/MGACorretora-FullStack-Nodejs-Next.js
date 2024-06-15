import Image from 'next/image';
import Slider from 'react-slick';

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
    };

    return (
        <div className="hidden md:flex h-auto w-full justify-center items-center content-center shadow-xl overflow-hidden">
            <Slider {...settings} className="w-full">
                <div className="w-full flex justify-center items-center">
                    <Image
                        className="rounded-sm"
                        src="/Banner_1.png"
                        alt="banner"
                        width={1170}
                        height={440}
                        quality={100}
                        style={{ width: '100%', height: 'auto' }}
                        priority

                    />
                </div>
                <div className="w-full flex justify-center items-center">
                    <Image
                        className="rounded-sm"
                        src="/Banner_2.png"
                        alt="banner"
                        width={1170}
                        height={440}
                        quality={100}
                        style={{ width: '100%', height: 'auto' }}
                    />
                </div>
            </Slider>
        </div>
    );
}
