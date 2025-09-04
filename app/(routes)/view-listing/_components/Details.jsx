import { Bath, BedDouble, CarFront, Drill, MapPin, Home } from 'lucide-react';
import React from 'react';
import { Button } from '../../../../components/ui/button';
import { Share2 } from 'lucide-react'; // Changed to Share2 icon for correct import
import GoogleMapSection from '../../../_components/GoogleMapSection';
import AgentDetail from './AgentDetails'

function Details({ listingDetail }) {
  return listingDetail && (
    <div className='my-6 px-4 md:px-10 flex gap-4 flex-col'>

      {/* Price & Address */}
      <div className='flex justify-between items-start flex-wrap gap-3'>
        <div>
          <h2 className='font-bold text-3xl text-gray-900'>${listingDetail?.price}</h2>
          <p className='text-gray-500 text-base flex items-center gap-2'>
            <MapPin className="w-4 h-4" />
            {listingDetail?.address}
          </p>
        </div>
        <Button className="bg-[#7f57f1] text-white hover:bg-[#6d47d8] flex gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>

      <hr className='my-2 border-gray-300' />

      {/* Key Features */}
      <div className='mt-4 flex flex-col gap-3'>
        <h2 className='font-bold text-2xl text-gray-900'>Key Features</h2>

        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          <div className='flex items-center justify-center gap-2 bg-purple-100 text-[#7f57f1] rounded-xl py-2 px-3 font-medium'>
            <Home className="w-5 h-5" />
            {listingDetail?.propertyType}
          </div>
          <div className='flex items-center justify-center gap-2 bg-purple-100 text-[#7f57f1] rounded-xl py-2 px-3 font-medium'>
            <Drill className="w-5 h-5" />
            Built in {listingDetail?.builtIn}
          </div>
          <div className='flex items-center justify-center gap-2 bg-purple-100 text-[#7f57f1] rounded-xl py-2 px-3 font-medium'>
            <BedDouble className="w-5 h-5" />
            {listingDetail?.bedroom} Bed
          </div>
          <div className='flex items-center justify-center gap-2 bg-purple-100 text-[#7f57f1] rounded-xl py-2 px-3 font-medium'>
            <Bath className="w-5 h-5" />
            {listingDetail?.bathroom || listingDetail?.bedroom} Bath
          </div>
          <div className='flex items-center justify-center gap-2 bg-purple-100 text-[#7f57f1] rounded-xl py-2 px-3 font-medium'>
            <CarFront className="w-5 h-5" />
            {listingDetail?.parking} Parking
          </div>
          <div className='flex items-center justify-center gap-2 bg-purple-100 text-[#7f57f1] rounded-xl py-2 px-3 font-medium'>
            <Drill className="w-5 h-5" />
            {listingDetail?.area} sqft
          </div>
        </div>
      </div>

      {/* What's Special */}
      <div className='mt-6'>
        <h2 className='font-bold text-2xl text-gray-900'>What's Special</h2>
        <p className='text-gray-600 leading-7 mt-2'>
          {listingDetail?.description || "No special description provided."}
        </p>
      </div>

      {/* Placeholder for Map */}
      <div className='mt-6'>
        <h2 className='font-bold text-2xl text-gray-900'>Find On Map</h2>
        <GoogleMapSection
        coordinates={listingDetail.coordinates}
        listing={[listingDetail]}
        />
      </div>
      
            
      <div>
        <h2 className='font-bold text-2x'>Contact Agent</h2>
        <AgentDetail listingDetail={listingDetail}/>
      </div>
    </div>
  );
}

export default Details;