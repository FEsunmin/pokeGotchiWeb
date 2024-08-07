'use client';
import Button from '@/components/Button';
import { useUserStore } from '@/store/userStore';
import { Pokemon } from '@/types/pokemonType';
import Image from 'next/image';
import Link from 'next/link';
import { BiCoinStack } from 'react-icons/bi';

const PokeCard = ({ pokemon }: { pokemon: Pokemon }) => {
  const { ownedPokemons } = useUserStore();

  const pokemonGif = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemon.id}.gif`;

  const isOwned = ownedPokemons?.includes(pokemon.id);

  return (
    <div className="mx-1 my-1 flex flex-col rounded-md border border-gray-300 p-3 shadow-lg hover:scale-105">
      <div className="align-center flex justify-end text-xl">
        <BiCoinStack className="my-auto text-yellow-400" />
        50
      </div>
      <div className="align-center mx-auto flex h-[100px] w-[100px] justify-center">
        <Image src={pokemonGif} alt={'pokemon_img'} unoptimized width={100} height={100} />
      </div>
      <p className="m-2 text-xl">{pokemon.korean_name}</p>
      <Link href={`/shopDetail/${pokemon.id}`}>
        <Button intent={isOwned ? 'red' : 'green'} size="sm" className="mx-auto">
          {isOwned ? 'Own' : 'Get'}
        </Button>
      </Link>
    </div>
  );
};

export default PokeCard;
