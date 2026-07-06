import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

const ArtistPage = () => {
  const topArtists = [
    { id: 1, name: 'Digital', category: 'Playable', avatar: '/Magasco.jpg' },
    { id: 2, name: 'Loip Vane', category: 'Painter', avatar: '/music.jpg' },
    { id: 3, name: 'Sculptor', category: 'Sculptor', avatar: '/john.jpg' },
    { id: 4, name: 'Benylee', category: 'Playleee', avatar: '/Gene.jpg' },
    { id: 5, name: 'Paints', category: 'Painter', avatar: '/mfy3.jpg' },
    { id: 6, name: 'Frrndos', category: 'Hodwork', avatar: '/Greenlight.jpg' },
    { id: 7, name: 'Hemcer', category: 'Playlee', avatar: '/10.jpg' },
    { id: 8, name: 'Honer', category: 'Romhie', avatar: '/mfy2.jpg' },
    { id: 9, name: 'Apdiss', category: 'Omhtr', avatar: '/music4.jpg' },
    { id: 10, name: 'Fariter', category: 'Howhzer', avatar: '/music5.jpg' },
  ];

  const mostPopularArtists = [
    { id: 11, name: 'John Doe', category: 'Rock', avatar: '/music1.jpg' },
    { id: 12, name: 'Jane Smith', category: 'Pop', avatar: '/pic1.jpg' },
    { id: 13, name: 'Alex', category: 'Hip Hop', avatar: '/Benylee.jpg' },
    { id: 14, name: 'Chris', category: 'Jazz', avatar: '/r2.jpg' },
    { id: 15, name: 'Patty', category: 'Blues', avatar: '/music8.jpg' },
    { id: 16, name: 'Sami', category: 'Classical', avatar: '/10.jpg' },
    { id: 17, name: 'Frank', category: 'Country', avatar: '/music6.jpg' },
    { id: 18, name: 'Lee', category: 'Electronic', avatar: '/music3.jpg' },
    { id: 19, name: 'Kim', category: 'Folk', avatar: '/Gene.jpg' },
    { id: 20, name: 'Jamie', category: 'Reggae', avatar: '/r1.jpg' },
  ];

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white font-inter">
      <Head>
        <title>Artist Page</title>
        <meta name="description" content="Artist page design" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
        <Image
          src="/hero-bg.png"
          alt="Header background"
          layout="fill"
          objectFit="cover"
          className="opacity-50"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E] via-transparent to-transparent flex items-end p-6 md:p-10">
          <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center">
            <div className="text-left md:w-1/2 lg:w-2/5">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">SawaConnect</h1>
              <p className="text-xl md:text-2xl text-red-500 mb-4">GreenLights</p>
              <button className="px-6 py-3  cursor-pointer bg-red-600 hover:bg-red-700 rounded-full text-lg font-semibold transition duration-300">
                Follow
              </button>
            </div>
            <div className="hidden md:block md:w-1/2 lg:w-3/5 relative h-full">
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 md:p-10 ">
        <section>
          <div className="flex justify-between items-center mb-8 cursor-pointer">
            <h2 className="text-3xl font-bold text-red-700">Top Artists</h2>
            <button className="px-4 py-2 bg-red-700  cursor-pointer text-white rounded-full text-sm font-semibold hover:bg-gray-700 transition duration-300">
              See more
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
            {topArtists.map((artist) => (
              <Link href='/dashboard/artistPage'>
              <div
                key={artist.id}
                className="bg-[#2C2C3D] rounded-lg p-4 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-24 h-24 relative mb-4">
                  <Image
                    src={artist.avatar}
                    alt={artist.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full border-2 border-red-500"
                  />
                </div>
                <h3 className="text-lg font-semibold truncate w-full mb-1">{artist.name}</h3>
                <p className="text-sm text-gray-400">{artist.category}</p>
              </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="my-10"></div>

        <section>
          <div className="flex justify-between items-center mb-8 ">
            <h2 className="text-3xl font-bold text-red-700">Most Popular Artists</h2>
            <button className="px-4 py-2 cursor-pointer bg-red-700 text-white rounded-full text-sm font-semibold hover:bg-gray-700 transition duration-300">
              See more
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
            {mostPopularArtists.map((artist) => (
              <Link href='/dashboard/artistPage'>
              <div
                key={artist.id}
                className="bg-[#2C2C3D] rounded-lg p-4 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-24 h-24 relative mb-4">
                  <Image
                    src={artist.avatar}
                    alt={artist.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full border-2 border-red-500"
                  />
                </div>
                <h3 className="text-lg font-semibold truncate w-full mb-1">{artist.name}</h3>
                <p className="text-sm text-gray-400">{artist.category}</p>
              </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ArtistPage;