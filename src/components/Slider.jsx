import React from 'react'
import { Carousel } from "flowbite-react";
import BackgroundOne from "../assets/bg-1.jpg"
import BackgroundTwo from "../assets/bg-2.jpeg"
import BackgroundThree from "../assets/bg-3.jpeg"

const Slider = () => {
    return (
        <div className="max-w-7xl mx-auto h-screen">
            <Carousel className="bg-gray-400 cursor-pointer"
                leftControl={<span className="carousel-control-left text-white cursor-pointer">❮</span>}
                rightControl={<span className="carousel-control-right text-white cursor-pointer">❯</span>}>
                <img src={BackgroundOne} alt="bg-1" className="h-full w-full object-cover"/>
                <img src={BackgroundTwo} alt="bg-2" className="h-full w-full object-cover"/>
                <img src={BackgroundThree} alt="bg-3" className="h-full w-full object-cover"/>
            </Carousel>
        </div>  
    )
}

export default Slider