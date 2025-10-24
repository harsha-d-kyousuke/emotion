
import React from 'react';
import { Star, Link } from 'lucide-react';
import { RESOURCES_DATA } from '../constants';

type Resource = typeof RESOURCES_DATA[0];

export const Resources: React.FC = () => {
  
  const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => {
    const typeColor = resource.type === 'Book' ? 'bg-blue-100 text-blue-800' :
                      resource.type === 'Podcast' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800';
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <img src={resource.image} alt={resource.title} className="w-full h-48 object-cover" />
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">{resource.title}</h3>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeColor} dark:opacity-80`}>{resource.type}</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{resource.author}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-yellow-500">
              <Star size={16} fill="currentColor" className="mr-1" />
              <span className="font-bold text-gray-700 dark:text-gray-300">{resource.rating}</span>
            </div>
            <a href={resource.link} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-sky-600 dark:text-sky-400 hover:underline">
              View
              <Link size={14} className="ml-1" />
            </a>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-4 sm:p-6 md:p-8 h-full overflow-y-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Curated Resources</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        A collection of books, podcasts, and articles to support your wellness journey.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {RESOURCES_DATA.map((resource, index) => (
          <ResourceCard key={index} resource={resource} />
        ))}
      </div>
    </div>
  );
};
