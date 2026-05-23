import React from 'react';
import Card from '../ui/Card';

const StatsCard = ({ title, value, icon: Icon, colorClass }) => {
  return (
    <Card className={`relative overflow-hidden ${colorClass} text-white border-0`}>
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
        <div className="p-3 bg-white/20 rounded-lg">
          <Icon size={24} />
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-10">
        <Icon size={100} />
      </div>
    </Card>
  );
};

export default StatsCard;
