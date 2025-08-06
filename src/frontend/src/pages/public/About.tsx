import { 
  Code2,
  Gamepad2, 
  Trophy, 
  Users,
  Github,
  Mail,
  ExternalLink
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import PublicLayout from '@/components/layouts/PublicLayout';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Zakaria Elhajoui',
      role: 'Full Stack & UI/UX Developer',
      github: 'https://github.com/zelhajou',
      email: 'zelhajou@gmail.com',
    },
    {
      name: 'Name 2',
      role: 'Backend Developer',
      github: 'https://github.com/member2',
      email: 'member2@student.42.fr',
    },
    {
      name: 'Name 3',
      role: 'Frontend Developer',
      github: 'https://github.com/member3',
      email: 'member3@student.42.fr',
    },
    {
      name: 'Name 4',
      role: 'Backend Developer',
      github: 'https://github.com/member4',
      email: 'member4@student.42.fr',
    },
  ];

  return (
    <PublicLayout>
      <div>
        <section className="py-20 px-6 border-b border-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Logo size={80} />
              <div>
                <h1 className="text-4xl font-bold mb-4 text-white">About P0000NG</h1>
                <p className="text-gray-400">
                  A gaming platform built by 1337 School developers. 
                  Focused on competitive gameplay and community.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="border border-gray-800 p-6 rounded-lg hover:border-gray-700 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <Code2 className="w-6 h-6 text-gray-400" />
                  <h3 className="text-lg font-bold text-white">42 Project</h3>
                </div>
                <p className="text-gray-400">
                  Built for 42 School curriculum.
                </p>
              </div>

              <div className="border border-gray-800 p-6 rounded-lg hover:border-gray-700 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <Gamepad2 className="w-6 h-6 text-gray-400" />
                  <h3 className="text-lg font-bold text-white">Gaming Platform</h3>
                </div>
                <p className="text-gray-400">
                  Modern games. Competitive features.
                </p>
              </div>

              <div className="border border-gray-800 p-6 rounded-lg hover:border-gray-700 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <Trophy className="w-6 h-6 text-gray-400" />
                  <h3 className="text-lg font-bold text-white">Competitive Play</h3>
                </div>
                <p className="text-gray-400">
                  Tournaments. Leaderboards. Global competition.
                </p>
              </div>

              <div className="border border-gray-800 p-6 rounded-lg hover:border-gray-700 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <Users className="w-6 h-6 text-gray-400" />
                  <h3 className="text-lg font-bold text-white">Community</h3>
                </div>
                <p className="text-gray-400">
                  Connect. Compete. Community.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 border-t border-b border-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3 flex justify-center">
                <div className="border border-gray-800 p-8 rounded-lg text-6xl text-center text-white">
                  1337
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-4 text-white">Built at 1337 School</h2>
                <p className="text-gray-400 mb-4">
                  Built at 1337 School — where coding meets innovation. 
                  A project-based learning challenge.
                </p>
                <a
                  href="https://42.fr/en/homepage/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
                >
                  Learn more about 42 School
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-10 text-center text-white">Meet Our Team</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div 
                  key={index} 
                  className="border border-gray-800 p-6 rounded-lg hover:border-gray-700 transition-all duration-300"
                >
                  <h3 className="text-lg font-bold mb-1 text-white">{member.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{member.role}</p>
                  
                  <div className="flex gap-3">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
                      >
                        <Github className="w-4 h-4 text-gray-400" />
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="p-2 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
                      >
                        <Mail className="w-4 h-4 text-gray-400" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default AboutPage;