'use client';
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react";


export default function QuestionnaireForm () {
    const [faceActive, setFaceActive] = useState<boolean>(true);

    const faceHandler = (val: boolean) => {
        setFaceActive(val);
    }

    return  (
        <>
            <div className={`${faceActive ? "block": "hidden"} grow flex flex-col px-5 py-5 w-full md:px-[5%] md:pt-[5%] md:pb-[2%] z-10 h-[100%] overflow-x-auto overflow-y-auto`}> {/* UNTUK FACENYA TIAP FORM */}
                <h1>
                    TITLE
                </h1>
                <p>
                    Lorem ipsum odor amet, consectetuer adipiscing elit. Nullam porta duis netus metus dui arcu laoreet. Urna dolor convallis urna dapibus a duis parturient vivamus! Conubia sodales in lacus finibus bibendum. Suspendisse iaculis non platea vestibulum massa vivamus justo libero. Commodo bibendum luctus phasellus nibh sociosqu dui. Parturient vivamus nulla aliquet metus nam turpis. Ornare quis luctus nascetur cursus sociosqu efficitur porttitor erat.
                    Tincidunt quis porta nostra maecenas, inceptos a nisl habitasse praesent. Gravida maximus libero eget pretium; a habitant justo sociosqu gravida. Sagittis ridiculus eros donec nunc pellentesque. Euismod elit eleifend odio dictum sociosqu hendrerit. Rhoncus sodales fusce efficitur sapien ex natoque ridiculus interdum. Leo hendrerit tellus lorem sagittis bibendum morbi. Curabitur ultricies nulla platea pharetra interdum.
                    Praesent ligula convallis auctor senectus magnis. Est nostra tempus nisi ridiculus lectus elit tempus lobortis. Orci imperdiet condimentum amet neque metus platea. Augue blandit feugiat sagittis augue; vel felis. Sollicitudin aptent ultrices leo dui vehicula est vel maecenas. Sagittis interdum bibendum, mattis cras magna id molestie erat. Eget lacus nisi finibus placerat nascetur magna ultrices quisque.
                    Adipiscing maecenas ac inceptos litora cras aenean platea mus imperdiet. Primis ex urna proin amet porta; varius curabitur. Adipiscing ac porttitor metus ac torquent enim arcu. Bibendum eros donec egestas ad dapibus facilisi nulla sapien tempor. Sem mollis vitae senectus proin nulla aenean laoreet. Sem nunc ornare taciti; a sem quam vel. Nullam platea dictum fermentum nisl in tincidunt erat. Blandit enim aliquam placerat pretium eget habitant amet tristique. Mollis feugiat quisque lacus finibus; mauris tristique.
                    Sociosqu ullamcorper condimentum vivamus mollis erat fringilla. Dolor odio maximus varius commodo accumsan, litora elementum. Imperdiet class felis ante accumsan leo eu dis lacus faucibus. Suscipit elit sodales suscipit dignissim suscipit at proin nibh. Tincidunt primis cursus dolor nec fames faucibus. Lectus mauris quisque netus pulvinar quis nullam aenean habitant tortor. Quam nibh ligula accumsan maecenas ante. Himenaeos elementum pretium nunc posuere auctor mi faucibus maecenas eu. Dapibus senectus congue scelerisque nascetur pellentesque eget.
                </p>
                <AnimatePresence>
                    <motion.button 
                    onClick={()=>faceHandler(false)} 
                    className={`mt-5 w-full flex justify-center items-center rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white hover:opacity-[90%] active:bg-blue-400 md:text-base`}
                    whileTap={{ scale: 0.55 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                        <p>Enter</p>
                        <svg width="40px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none" className="block ms-1">
                        <path stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M2 10h16m0 0l-7-7m7 7l-7 7"/>
                        </svg>
                    </motion.button>
                </AnimatePresence>
            </div>
            <div className={`${faceActive ? "hidden": "block"} grow flex flex-col px-5 py-5 w-full md:px-[5%] md:pt-[5%] md:pb-[2%] z-10 overflow-x-hidden`}> 
                <div className="flex-col "> {/* Buat AT */}
                    <h1>
                        TITLE SKILL
                    </h1>
                    <p>
                        Lorem ipsum odor amet, consectetuer adipiscing elit. Nullam porta duis netus metus dui arcu laoreet. Urna dolor convallis urna dapibus a duis parturient vivamus! Conubia sodales in lacus finibus bibendum. Suspendisse iaculis non platea vestibulum massa vivamus justo libero. Commodo bibendum luctus phasellus nibh sociosqu dui. Parturient vivamus nulla aliquet metus nam turpis. Ornare quis luctus nascetur cursus sociosqu efficitur porttitor erat.
                    </p>
                    <p>
                        Type Assessment
                    </p>
                </div>
                <div> {/* Buat Questions */}
                    <h1>
                        Title Subskill
                    </h1>
                    <p>
                        desc pertanyaan
                    </p>
                    <div>{/* untuk 1 - 5 pilihan */}

                    </div>
                </div>
            </div>
        </>
    )
}