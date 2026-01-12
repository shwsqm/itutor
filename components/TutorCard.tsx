
import React from 'react';
import { Star, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { Tutor } from '../types';

interface TutorCardProps {
  tutor: Tutor;
  onBookClick: (tutor: Tutor) => void;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor, onBookClick }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group h-full">
      <div className="relative overflow-hidden">
        <img 
          src={tutor.image} 
          alt={tutor.name} 
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-slate-900">{tutor.rating}</span>
            <span className="text-xs text-slate-500">({tutor.reviews})</span>
          </div>
        </div>
        <div className="absolute bottom-4 left-4">
           <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
             Featured Expert
           </div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center group-hover:text-indigo-600 transition-colors">
              {tutor.name}
              <CheckCircle className="h-4 w-4 text-blue-500 ml-2" />
            </h3>
            <p className="text-sm font-medium text-indigo-600">{tutor.specialty}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-slate-900">${tutor.hourlyRate}</p>
            <p className="text-xs text-slate-500">per hour</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2 italic">
          "{tutor.bio}"
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tutor.subjects.map(subject => (
            <span key={subject} className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-2 py-1 rounded-md">
              {subject}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center text-slate-500 text-xs">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {tutor.location}
          </div>
          <button 
            onClick={() => onBookClick(tutor)}
            className="flex items-center space-x-1 text-indigo-600 text-sm font-bold hover:text-indigo-700 transition-colors group"
          >
            <span>Book Lesson</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;
