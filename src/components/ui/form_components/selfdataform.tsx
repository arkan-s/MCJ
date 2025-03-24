'use client'
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useRef, useEffect } from "react";
import { PaginationFormHandler } from "@/components/ui/pagination/pagination";

const usePrevious = <T,>(val: T) => {
    const ref = useRef<undefined | T>(undefined);
    useEffect(() => {
        ref.current = val;
    });
    return ref.current;
}

export default function SelfDataForm() {
    const [activeIndex, setActiveIndex] = useState(0);
    const previousIndex = usePrevious(activeIndex) ?? activeIndex;
    const components = [
    ];
    
    const total_components = components.length;
    

    const direction: Direction = (activeIndex === 0 && previousIndex !== 1) //last to first
        ? 'forward'
        : (previousIndex === 0 && activeIndex !== 1) //first to last
            ? 'back'
            : previousIndex > activeIndex //switch to neighbouring elements
                ? 'back'
                : 'forward';

    type Direction = 'back' | 'forward';
    const variants = {
        initial: (direction: Direction) => ({
            x: direction === 'forward' ? '200%' : '-200%', opacity: 0, transition: { type: "spring", stiffness: 80, damping: 15 }
        }),
        target: {
            x: '0%', opacity: 1, transition: { type: "spring", stiffness: 80, damping: 15 }
        },
        exit: (direction: Direction) => ({
            x: direction === 'forward' ? '-200%' : '200%', opacity: 0, transition: { type: "spring", stiffness: 80, damping: 15 }
        }),
    };

    const backandforthButton = (inp:number)=>{
        if (inp===-1) {
            setActiveIndex(prev => prev === 0 ? components.length - 1 : prev - 1);
        }else if(inp===1){
            setActiveIndex(prev => prev === components.length - 1 ? 0 : prev + 1);
        }
    }

    return (
        <div className="grow flex flex-col px-5 pt-5 w-full md:px-[5%] lg:px-[10%] md:pt-[10%] z-10 overflow-x-hidden">
            <div className="relative grow w-full flex flex-colc"> {/*MENAMPILKAN PERTANYAANNYA*/}
                <AnimatePresence custom={direction}>

                    <motion.div
                        variants={variants}
                        initial="initial"
                        animate="target"
                        exit="exit"
                        custom={direction}
                        key={activeIndex}
                        className="w-full"
                        style={{ position: "absolute", width: "100%" }}
                        >
                        {/* {components[activeIndex].component} */}
                    </motion.div>

                </AnimatePresence>
            </div>
            <div> {/*UNTUK PAGINATION TOMBOLNNYA */}
                <PaginationFormHandler total_pages={total_components} page_number={activeIndex} changing_page={backandforthButton}/>
            </div>
        </div>
    )
}
