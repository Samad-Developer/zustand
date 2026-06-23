"use client";

import { useHuman } from "@/store/middleware";
import { useAgeStore, useXStore } from "@/store/useUpdaterFunction";
import { setXY } from "@/store/useUpdaterFunction";
import { useEffect } from "react";

export default function RerenderComp1() {
  // const { age, setAge } = useAgeStore((state) => state);
  const age = useHuman((state) => state.age)
  const name = useHuman((state) => state.name)
  const ageUpdate = useHuman((state) => state.ageUpdate)

  const handleAgeIncrement = () => {
    // setAge((currentAge) => currentAge + 1);
  };

  const x = useXStore((state) => state.X);
  const y = useXStore((state) => state.Y);
  

useEffect(() => {
const postionStore = useXStore.subscribe(({ X, Y}) => {
  console.log("New Postion From Subscribe Woow ", X, Y)
})
}, [])


 

  return (
    // <div className="flex-col gap-2 items-center justify-center">
    //   <h1 className="text-center mb-5">Your Current Age Is : {age}</h1>

    //   <div className="flex flex-col gap-2 items-center justify-center">
    //     <button
    //       onClick={() => {
    //         handleAgeIncrement();
    //         handleAgeIncrement();
    //         handleAgeIncrement();
    //       }}
    //       className="bg-black py-3 px-6 rounded-md text-white"
    //     >
    //       Increment Age By 3 Years
    //     </button>

    //     <button
    //       onClick={() => {
    //         handleAgeIncrement();
    //       }}
    //       className="bg-black py-3 px-6 rounded-md text-white"
    //     >
    //       Increment Age By 1 Years
    //     </button>
    //   </div>
    // </div>
    //  <div
    //   onPointerMove={(e) => {
    //     setXY({
    //       X: e.clientX,
    //       Y: e.clientY
    //     })
    //     console.log(e.clientX, e.clientY)
    //   }}
    //   style={{
    //     position: 'relative',
    //     width: '100vw',
    //     height: '100vh',
    //   }}
    // >
    //   <div
    //     style={{
    //       position: 'absolute',
    //       backgroundColor: 'red',
    //       borderRadius: '50%',
    //       transform: `translate(${x}px, ${y}px)`,
    //       left: 10,
    //       top: -110,
    //       width: 20,
    //       height: 20,
    //     }}
    //   />
    // </div>

    <div className="flex flex-col gap-5 w-full items-center justify-center">
      <h1>Name: {name}</h1>
      <h1>Age: {age}</h1>

      <button className="px-6 py-3 rounded-md bg-orange-500 text-white" onClick={() => ageUpdate(5)}>
        Update Age By 5 Years
      </button>
    </div>
  );
}
