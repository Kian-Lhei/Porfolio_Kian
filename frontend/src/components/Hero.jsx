import { useState, useEffect } from "react";
import Profile from "../assets/Profile.jpg";

export default function Hero () {
    const [typedText, setTypedText] = useState("");
    const fullText = "Bachelor of Science in Information Technology Student.";
    
    useEffect(() => {
        let index = 0;
        let isDeleting = false;
        const timer = setInterval(() => {
            if (!isDeleting) {
                if (index <= fullText.length) {
                    setTypedText(fullText.slice(0, index));
                    index++;
                } else {
                    setTimeout(() => {
                        isDeleting = true;
                    }, 2000);
                }
            } else {
                if (index >= 0) {
                    setTypedText(fullText.slice(0, index));
                    index--;
                } else {
                    isDeleting = false;
                    index = 0;
                }
            }
        }, 50);
        
        return () => clearInterval(timer);
    }, []);
    
    return (
        <section id="home" className="min-h-screen flex items-center justify-center bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 text-center md:text-left">
                            <span className="text-2xl md:text-3xl opacity-70 block">Hi, I'm</span>
                            <span className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl text-black block mt-2">Kian Lhei Pagkaliwagan.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 h-8 text-center md:text-left">
                            {typedText}<span className="animate-pulse">|</span>
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
                            <a
                                href="#projects"
                                className="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
                            >
                                Let's Connect
                            </a>

                            <a 
                                href="#projects"
                                className="inline-block border-2 border-black text-black px-8 py-3 rounded-lg font-medium hover:bg-black hover:text-white transition-all duration-200"
                            >
                                View Work
                            </a>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <img 
                            src={Profile} 
                            alt="Kian Lhei Pagkaliwagan" 
                            className="w-96 h-96 md:w-80 md:h-80 rounded-full border-4 border-black shadow-xl object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}