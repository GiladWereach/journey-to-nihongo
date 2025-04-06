
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Info, TrendingUp } from 'lucide-react';

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
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Process data for chart display
  const chartData = data.map(item => ({
    ...item,
    formattedDate: formatDate(item.date),
    proficiency: Math.round(item.averageProficiency)
  }));

  // Calculate trend indicators
  const calculateTrend = () => {
    if (chartData.length < 2) return 'neutral';
    
    const recentData = chartData.slice(-7); // Last week
    const startValue = recentData[0]?.proficiency || 0;
    const endValue = recentData[recentData.length - 1]?.proficiency || 0;
    
    if (endValue > startValue) return 'up';
    if (endValue < startValue) return 'down';
    return 'neutral';
  };
  
  const trend = calculateTrend();
  
  // Create custom tooltip for more readable data
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-md text-sm">
          <p className="font-semibold mb-1">{label}</p>
          <div className="flex flex-col gap-1">
            {payload.map((entry: any, index: number) => (
              <div key={`tooltip-${index}`} className="flex items-center gap-2">
                <div className="w-3 h-3" style={{ backgroundColor: entry.color }}></div>
                <span className="text-xs">
                  {entry.name === 'charactersStudied' 
                    ? `Characters: ${entry.value}` 
                    : `Proficiency: ${entry.value}%`}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo" />
            Learning Activity
          </CardTitle>
          
          {chartData.length > 0 && (
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                trend === 'up' ? 'bg-green-100 text-green-800' : 
                trend === 'down' ? 'bg-red-100 text-red-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                {trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Steady'}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="formattedDate" 
                  tick={{ fontSize: 12 }}
                  interval={Math.floor(data.length / 7)}
                />
                <YAxis 
                  yAxisId="left"
                  orientation="left"
                  stroke="#8884d8"
                  tick={{ fontSize: 12 }}
                  label={{ 
                    value: 'Characters', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fontSize: 12 }
                  }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#82ca9d"
                  tick={{ fontSize: 12 }}
                  label={{ 
                    value: 'Proficiency %', 
                    angle: 90, 
                    position: 'insideRight',
                    style: { textAnchor: 'middle', fontSize: 12 }
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  align="center"
                  verticalAlign="bottom"
                  formatter={(value) => {
                    if (value === 'charactersStudied') return 'Characters Studied';
                    if (value === 'proficiency') return 'Avg. Proficiency';
                    return value;
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
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <div className="mb-2">
                <Info className="h-12 w-12 text-gray-300" />
              </div>
              <p className="text-center">No activity data available yet.</p>
              <p className="text-center text-sm">Complete learning sessions to see your progress here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTimelineCard;
