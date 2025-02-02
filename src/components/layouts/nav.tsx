import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { BsBookmark, BsEgg } from 'react-icons/bs';
import {
  HiOutlineArchive,
  HiOutlineColorSwatch,
  HiOutlineInformationCircle,
  HiOutlineLightBulb,
  HiOutlineMenu,
  HiOutlinePresentationChartLine,
  HiOutlineSwitchHorizontal,
  HiOutlineViewGrid,
  HiOutlineX,
} from 'react-icons/hi';
import { TbCircleLetterG, TbCircleLetterM, TbTopologyStar3 } from 'react-icons/tb';
import { useToggle } from 'react-power-ups';

export default function Nav() {
  const [menuExpanded, toggleExpand] = useToggle();
  const { asPath } = useRouter();

  // Close the menu when the route changes
  useEffect(() => {
    toggleExpand(false);
  }, [asPath, toggleExpand]);

  return (
    <>
      {/* Mobile Navbar */}
      <nav id="_nav" className="py-1 lg:hidden">
        <ul id="_nav-inner" className="py-2">
          <li className="z-10 order-2 flex-1">
            <Link href="/" className="nav-link flex items-center flex-col gap-1">
              <HiOutlineViewGrid className="text-2xl" />
              Pokémons
            </Link>
          </li>
          <li className="order-2 flex-1">
            <Link href="/compare" className="nav-link flex items-center flex-col gap-1">
              <HiOutlineColorSwatch className="text-2xl" />
              Compare
            </Link>
          </li>
          <li className="order-2 flex-1">
            <Link href="/statistics/types" className="nav-link flex items-center flex-col gap-1">
              <HiOutlinePresentationChartLine className="text-2xl" />
              Statistics
            </Link>
          </li>
          <li className="order-2 flex-1">
            <Link href="/my-pokemons" className="nav-link flex items-center flex-col gap-1">
              <BsBookmark className="text-2xl" />
              My Pokémon
            </Link>
          </li>
          <li className="order-2 flex-1 ">
            <button
              type="button"
              className={clsx('nav-link flex items-center flex-col gap-1', menuExpanded && 'text-rose-500')}
              onClick={toggleExpand}
            >
              {menuExpanded ? (
                <HiOutlineX className="text-2xl" />
              ) : (
                <HiOutlineMenu className="text-2xl" />
              )}
              {menuExpanded ? 'Hide Menu' : 'All Menu'}
            </button>
          </li>
        </ul>
      </nav>

      {/* Sidebar */}
      <div
        id="_sidebar"
        className={clsx(
          'p-2 pl-4 lg:block  transition-all max-h-[100vh] overflow-scroll scroll duration-300',
          menuExpanded ? 'block  overflow-y-auto ' : 'hidden'
        )}
      >
        <div className="sticky top-0 mx-auto flex flex-col gap-3 lg:overflow-hidden">
          <ul>
            <section className="order-1 flex-1 pt-4 text-xs font-semibold md:order-2">
              MAIN MENU
            </section>
            <li className="z-10 order-2 flex-1">
              <Link href="/" className="nav-link flex gap-2 p-1 pt-4">
                <HiOutlineViewGrid className="text-2xl" />
                Pokémons
              </Link>
            </li>
            <li className="order-2 flex-1">
              <Link href="/compare" className="nav-link flex gap-2 p-1 pt-4">
                <HiOutlineColorSwatch className="text-2xl" />
                Compare
              </Link>
            </li>
            <li className="order-2 flex-1">
              <Link href="/statistics/types" className="nav-link flex gap-2 p-1 pt-4">
                <HiOutlinePresentationChartLine className="text-2xl" />
                Statistics
              </Link>
            </li>
            <li className="order-2 flex-1">
              <Link href="/my-pokemons" className="nav-link flex gap-2 p-1 pt-4">
                <BsBookmark className="text-2xl" />
                My Pokémon
              </Link>
            </li>

            {/* Additional Menu Sections */}
            <section className="order-1 flex-1 pt-4 text-xs font-semibold md:order-2">
              POKEMON DATA
            </section>
            <li className="order-1 flex-1 md:order-2">
              <Link href="/evolutions" className="nav-link flex gap-2 p-1 pt-4">
                <HiOutlineSwitchHorizontal className="text-2xl" />
                Evolutions
              </Link>
            </li>
            <li className="order-1 flex-1 md:order-2">
              <Link href="/types" className="nav-link flex gap-2 p-1 pt-4">
                <TbTopologyStar3 className="text-2xl" />
                Types
              </Link>
            </li>
            <li className="order-1 flex-1 md:order-2">
              <Link href="/egg-group" className="nav-link flex gap-2 p-1 pt-4">
                <BsEgg className="text-2xl" />
                Egg Group
              </Link>
            </li>

            {/* More menu items */}
            <section className="order-1 flex-1 pt-4 text-xs font-semibold md:order-2">
              FORMS / VARIATIONS
            </section>
            <li className="order-1 flex-1 md:order-2">
              <Link href="/pokemon-variation/gigantamax" className="nav-link flex gap-2 p-1 pt-4">
                <TbCircleLetterG className="text-2xl" />
                Gigantamax for...
              </Link>
            </li>
            <li className="order-1 flex-1 md:order-2">
              <Link href="/pokemon-variation/mega" className="nav-link flex gap-2 p-1 pt-4">
                <TbCircleLetterM className="text-2xl" />
                Mega Evolutions
              </Link>
            </li>

            {/* Fun and Games */}
            <section className="order-1 flex-1 pt-4 text-xs font-semibold md:order-2">
              FUN & GAMES
            </section>
            <li className="order-1 flex-1 md:order-2">
              <Link href="/guess-pokemon" className="nav-link flex gap-2 p-1 pt-4">
                <HiOutlineLightBulb className="text-2xl" />
                Guess a Pokémon
              </Link>
            </li>
            <li className="order-1 flex-1 md:order-2">
              <Link href="/tcg-cards" className="nav-link flex gap-2 p-1 pt-4">
                <HiOutlineInformationCircle className="text-2xl" />
                TCG Cards
              </Link>
            </li>

            {/* Misc */}
            <section className="order-1 flex-1 pt-4 text-xs font-semibold md:order-2">
              MISC.
            </section>
            <li className="order-1 mb-8 flex-1 md:order-2">
              <Link href="/about" className="nav-link mb-20 flex gap-2 p-1 pt-4">
                <HiOutlineInformationCircle className="text-2xl" />
                About
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
