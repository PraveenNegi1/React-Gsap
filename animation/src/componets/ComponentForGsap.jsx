import React, { useEffect } from 'react'; // Ensure useEffect is imported
import { gsap } from 'gsap';

export default function ComponentForGsap() {
    useEffect(() => {
        // Set the initial state of the box before the animation
        gsap.set("#box", { x: 500 }); // Final position (this is where it starts from)

        // Animate from the initial state to its natural position (0, 0)
        gsap.from("#box", {
          
            x: 500, // The position to animate to
        });
    }, []); // Ensure the dependency array is used correctly

    return (
        <div>
            <div id='box' className='w-[300px] h-[300px] bg-red-200'>uibgfv jiwb qwuc</div>
        </div>
    );
}
