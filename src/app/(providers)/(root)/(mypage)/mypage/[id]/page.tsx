'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import React, { useState } from 'react';
import users from './dumy';

const Page: React.FC = () => {
  const { id } = useParams();
  const [startIndex, setStartIndex] = useState(0);
  const cardWidth = 180; // 각 카드의 폭
  const cardMargin = 20; // 각 카드 사이의 간격

  if (!id) {
    return <div>유저를 찾을 수 없습니다.</div>;
  }

  const userId = parseInt(id as string, 10);
  const user = users.find((user) => user.id === userId);

  if (!user) {
    return <div>유저를 찾을 수 없습니다.</div>;
  }

  const handleNext = () => {
    setStartIndex((prevIndex) => Math.min(prevIndex + 1, user.pokemons.length - 3));
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <div className="flex items-center justify-center overflow-hidden bg-gray-100">
      <div className="w-[600px] bg-white p-7">
        <div className="mb-8">
          <div className="bg-white-200 relative flex items-center justify-between shadow-sm rounded-lg border border-gray-300 p-4">
            <div className="relative flex items-center">
              <div className="relative h-24 w-24">
                <Image src={user.profileImage} alt="userImage" layout="fill" className="rounded-full object-cover" />
              </div>
              <div className="ml-5 relative">
                <div className="absolute top-0 left-0 text-lg font-bold">{user.name}</div>
                <div className="mt-6">
                  {user.hashtags.map((hashtag) => (
                    <div key={hashtag.id}>
                      <h4 className="text-xs font-light">#{hashtag.hashtag}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button className="absolute bottom-4 right-4 rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-xs">
              수정
            </button>
          </div>
        </div>
        <h2 className="mb-4 text-2xl font-bold">내 포켓몬</h2>
        <div className="relative flex items-center justify-center">
          <button
            onClick={handlePrev}
            className="absolute left-0 z-10 p-2 bg-gray-200 bg-opacity-50 hover:bg-opacity-75"
          >
            &lt;
          </button>
          <div className="flex justify-center w-[540px]">
            <div
              className="flex justify-center transition-transform duration-300 space-x-3"
              style={{ transform: `translateX(-${startIndex * (cardWidth + cardMargin)}px)` }}
            >
              {user.pokemons.map((mypokemon) => (
                <div
                  key={mypokemon.id}
                  className="min-w-[180px] bg-white-100 transform rounded-lg border border-gray-300 p-4 shadow-sm transition duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4 h-24 w-24">
                      <Image
                        src={mypokemon.image}
                        alt={mypokemon.name}
                        fill
                        className="rounded-full object-cover"
                        sizes="100%"
                      />
                    </div>
                    <h3 className="mb-2 text-sm font-bold">{mypokemon.name}</h3>
                    <button className="rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-xs">상세정보</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleNext}
            className="absolute right-0 z-10 p-2 bg-gray-200 bg-opacity-50 hover:bg-opacity-75"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
