import { Link } from 'react-router-dom';
import type { Gig } from '@/entities/gig';
import { Card } from '@/shared/ui';

interface GigCardProps {
  gig: Gig;
}

export function GigCard({ gig }: GigCardProps) {
  return (
    <Link to={`/gigs/${gig.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-gray-900 flex-1">
              {gig.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              gig.is_active === 1 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {gig.is_active === 1 ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {gig.description}
          </p>
          
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">by {gig.freelancer_name}</span>
              {gig.freelancer_rating && (
                <span className="text-xs text-yellow-600">
                  ⭐ {gig.freelancer_rating.toFixed(1)}
                </span>
              )}
            </div>
            
            <div className="text-right">
              <span className="text-lg font-bold text-green-600">
                ${gig.price}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
