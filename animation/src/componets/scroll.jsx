

import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './scroll.css';
   

gsap.registerPlugin(ScrollTrigger);

const Gallery = () => {
  useEffect(() => {
    let iteration = 0; 
    const spacing = 0.1; // spacing of the cards
    const snap = gsap.utils.snap(spacing);
    const cards = gsap.utils.toArray('.cards li');
    const seamlessLoop = buildSeamlessLoop(cards, spacing);
    const scrub = gsap.to(seamlessLoop, {
      totalTime: 0,
      duration: 0.5,
      ease: "power3",
      paused: true,
    });
    
    const trigger = ScrollTrigger.create({
      trigger: ".gallery",
      start: 0,
      end: "+=3000", 
      pin: true,
      onUpdate(self) {
        if (self.progress === 1 && self.direction > 0 && !self.wrapping) {
          wrapForward(self);
        } else if (self.progress < 1e-5 && self.direction < 0 && !self.wrapping) {
          wrapBackward(self);
        } else {
          scrub.vars.totalTime = snap((iteration + self.progress) * seamlessLoop.duration());
          scrub.invalidate().restart();
          self.wrapping = false;
        }
      }
    });

    function wrapForward(trigger) {
      iteration++;
      trigger.wrapping = true;
      trigger.scroll(trigger.start + 1);
    }

    function wrapBackward(trigger) {
      iteration--;
      if (iteration < 0) {
        iteration = cards.length - 1; 
        seamlessLoop.totalTime(seamlessLoop.totalTime() + seamlessLoop.duration());
        scrub.pause();
      }
      trigger.wrapping = true;
      trigger.scroll(trigger.end - 1);
    }

    function scrubTo(totalTime) {
      let progress = (totalTime - seamlessLoop.duration() * iteration) / seamlessLoop.duration();
      if (progress > 1) {
        wrapForward(trigger);
      } else if (progress < 0) {
        wrapBackward(trigger);
      } else {
        trigger.scroll(trigger.start + progress * (trigger.end - trigger.start));
      }
    }

    document.querySelector(".next").addEventListener("click", () => scrubTo(scrub.vars.totalTime + spacing));
    document.querySelector(".prev").addEventListener("click", () => scrubTo(scrub.vars.totalTime - spacing));

    return () => {
      trigger.kill();
      scrub.kill();
    };
  }, []);

  function buildSeamlessLoop(items, spacing) {
    const overlap = Math.ceil(1 / spacing);
    const startTime = items.length * spacing + 0.5;
    const loopTime = (items.length + overlap) * spacing + 1;
    const rawSequence = gsap.timeline({ paused: true });
    const seamlessLoop = gsap.timeline({
      paused: true,
      repeat: -1,
      onRepeat() {
        this._time === this._dur && (this._tTime += this._dur - 0.01);
      }
    });

    gsap.set(items, { xPercent: 400, opacity: 0, scale: 0 });

    for (let i = 0; i < items.length + overlap * 2; i++) {
      const index = i % items.length;
      const item = items[index];
      const time = i * spacing;

      rawSequence.fromTo(item, { scale: 0, opacity: 0 }, {
        scale: 1,
        opacity: 1,
        zIndex: 100,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: "power1.in",
        immediateRender: false
      }, time)
      .fromTo(item, { xPercent: 400 }, { xPercent: -400, duration: 1, ease: "none", immediateRender: false }, time);
      seamlessLoop.add("label" + i, time);
    }

    rawSequence.time(startTime);
    seamlessLoop.to(rawSequence, {
      time: loopTime,
      duration: loopTime - startTime,
      ease: "none"
    }).fromTo(rawSequence, { time: overlap * spacing + 1 }, {
      time: startTime,
      duration: startTime - (overlap * spacing + 1),
      immediateRender: false,
      ease: "none"
    });

    return seamlessLoop;
  }

  // Array of image URLs
  const images = [
    'Rectangle 30.png',
    'Rectangle 32.png',
    'https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/2754200/pexels-photo-2754200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/3070746/pexels-photo-3070746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1670187/pexels-photo-1670187.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/209728/pexels-photo-209728.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    // Add more images as needed...
  ];

  return (
    <div className="gallery">
      <ul className="cards">
        {images.map((src, i) => (
          <li key={i}>
            <img src={src} alt={`Gallery Image ${i + 1}`} style={{ width: '100%', height: '100%', borderRadius: '0.8rem' }} />
          </li>
        ))}
      </ul>
      <div className="actions">
        <button className="prev">Prev</button>
        <button className="next">Next</button>
      </div>
    </div>
  );
};

export default Gallery;
