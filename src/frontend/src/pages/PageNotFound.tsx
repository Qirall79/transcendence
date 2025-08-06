import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black">
      <div className="max-w-3xl bg-black border border-gray-800 rounded-lg overflow-hidden shadow-lg">
        {/* Large Image Section */}
        <div className="w-full h-64 md:h-80 relative overflow-hidden">
          <img
            src="/allisonix.jpg"
            alt="Anolis allisoni"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <span className="text-xs bg-black/50 border border-gray-800 px-2 py-1 rounded">
              Anolis allisoni (Cuban Blue Anole)
            </span>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-6xl font-bold text-white">404</h1>
            <div className="h-12 w-px bg-gray-800"></div>
            <div>
              <h2 className="text-xl font-semibold text-white">Page Not Found</h2>
              <p className="text-gray-400">This page has camouflaged itself!</p>
            </div>
          </div>
          
          <p className="text-gray-400 mb-6 text-sm">
            The <span className="text-gray-300">Anolis allisoni</span> is known for its ability to
            blend into its surroundings - just like the page you're looking for!
          </p>
          
          {/* Buttons */}
          <div className="flex gap-4">
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-black border border-gray-800 hover:border-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-black border border-gray-800 hover:border-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;