'use client'
import React from "react";
import Image from "next/image"; // Ensure you're importing this
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../../@/components/ui/carousel";

function Slider({ imageList }) {
  console.log("Image List:", imageList);

  return (
    <div className="mt-5">
      {imageList ? (
        <Carousel>
          <CarouselContent>
            {imageList.map((item, index) => (
              <CarouselItem key={index}>
                <Image
                  src={item.url}
                  width={800}
                  height={300}
                  alt={`Listing Image ${index}`}
                  className="rounded-xl w-full object-cover h-[360px] w-full"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <div className="w-full h-[200px] bg-slate-200 animate-pulse"></div>
      )}
    </div>
  );
}

export default Slider;