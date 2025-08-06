import { ArrowRight } from "lucide-react";
import PublicLayout from "@/components/layouts/PublicLayout";

const LandingPage = () => {
  return (
    <PublicLayout>
      <div className="flex flex-col md:flex-row h-full">
        <div className="md:w-1/2 flex items-center justify-center p-8 relative border-r border-gray-800">
          <div className="max-w-md text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Elevate Your
              <span className="block text-white">Gaming Experience</span>
            </h1>
            <p className='text-gray-400 mb-8'>
              Join the ultimate platform with competitive tournaments, real-time
              matches, and advanced matchmaking.
            </p>
            <a
              href='/auth/register'
              className='inline-flex items-center gap-2 px-8 py-3 bg-black border border-gray-800 hover:border-gray-700 text-white rounded-lg transition-colors'
            >
              Start Your Journey
              <ArrowRight className='w-4 h-4' />
            </a>
          </div>
        </div>

        <div className='md:w-1/2 flex items-center justify-center p-8'>
          <div className='max-w-md'>
            <div className='flex justify-center mb-8'>
              <div className='text-8xl'>🏓</div>
            </div>
            <h2 className='text-3xl font-bold mb-6 text-center text-white'>
              PING PONG
            </h2>
            <p className='text-gray-400 mb-8 text-center'>
              Experience real-time multiplayer with physics-based gameplay.
              Challenge players from around the world.
            </p>
            <div className='flex justify-between gap-4'>
              <a
                href='/offline'
                className='flex-1 bg-black border border-gray-800 p-4 hover:border-gray-700 rounded-lg transition-colors flex flex-col items-center'
              >
                <div className='text-2xl mb-2'>🎮</div>
                <div className='text-sm text-gray-400'>LOCAL</div>
              </a>
              <a
                href='/dashboard/games/ping_pong'
                className='flex-1 bg-black border border-gray-800 p-4 hover:border-gray-700 rounded-lg transition-colors flex flex-col items-center'
              >
                <div className='text-2xl mb-2'>🌐</div>
                <div className='text-sm text-gray-400'>ONLINE</div>
              </a>
              <a
                href='/dashboard/games/ping_pong'
                className='flex-1 bg-black border border-gray-800 p-4 hover:border-gray-700 rounded-lg transition-colors flex flex-col items-center'
              >
                <div className='text-2xl mb-2'>🏆</div>
                <div className='text-sm text-gray-400'>TOURNAMENTS</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default LandingPage;
