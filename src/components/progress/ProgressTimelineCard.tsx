
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ProgressTimelineData {
  date: string;
  charactersStudied: number;
  averageProficiency: number;
}

interface ProgressTimelineCardProps {
  data: ProgressTimelineData[];
  className?: string;
}

const ProgressTimelineCard: React.FC<ProgressTimelineCardProps> = ({
  data,
  className
}) => {
  // Format date for display (e.g., "May 1")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  
  // Process data for chart display
  const chartData = data.map(item => ({
    ...item,
    date: formatDate(item.date),
    proficiency: Math.round(item.averageProficiency)
  }));
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Learning Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval={Math.floor(data.length / 7)}
                />
                <YAxis 
                  yAxisId="left"
                  orientation="left"
                  stroke="#8884d8"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#82ca9d"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'charactersStudied') return [`${value} characters`, 'Characters Studied'];
                    if (name === 'proficiency') return [`${value}%`, 'Avg. Proficiency'];
                    return [value, name];
                  }}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="charactersStudied" 
                  fill="#8884d8" 
                  name="charactersStudied"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  yAxisId="right"
                  dataKey="proficiency" 
                  fill="#82ca9d" 
                  name="proficiency"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No activity data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTimelineCard;
