import Image from 'next/image';
import Slider from 'react-slick';

export default function Banner() {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
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
                        layout="responsive"
                        width={1000}
                        height={500}
                    />
                </div>
                <div className="w-full flex justify-center items-center">
                    <Image
                        className="rounded-sm"
                        src="/Banner_2.png"
                        alt="banner"
                        layout="responsive"
                        width={1000}
                        height={500}
                    />
                </div>
            </Slider>
        </div>
    );
}
