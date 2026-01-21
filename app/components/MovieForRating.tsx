

import React from 'react';
import Reviews from './Reviews';
import Image from 'next/image';


const MovieForRating = () => {
    return (
        <div className="p-4 rounded shadow max-w-md bg-secondary">
            <Image src={"/movie_posters_DEV/the_martian.jpg"} alt='Movie Poster' width={500} height= {200} className='rounded shadow'/>
            <div className='text-center mt-4'>
                <h2 className="text-4xl font-bold mb-2">The Martian</h2>
                
                <div className='flex justify-center'>
                    <p className='text-2xl'>2015 2h24min</p>
                </div>
                <p className='text-2xl'>Sci-Fi Survival Adventure Drama</p>
            </div>
            <div className='ms-6 me-6'>
                <Reviews IMDBRating="8.0/10" RottenTomatoesRating="92%" MetacriticRating="80"/>
            </div>
        </div>
    );
};

export default MovieForRating;