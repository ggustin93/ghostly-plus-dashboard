import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EMGAnalysisResult, ChannelAnalytics } from '@/lib/api';
import { getEMGWaveformData } from '@/lib/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Download } from 'lucide-react';

interface EMGAnalysisDisplayProps {
  result: EMGAnalysisResult;
  onExport?: () => void;
  onGenerateReport?: () => void;
}

// Sample EMG waveform data for demonstration
// This will be replaced with real data fetched from the API
const generateSampleWaveformData = (channelName: string) => {
  const data = [];
  const totalPoints = 200;
  
  // Generate some random data that resembles EMG signal patterns
  for (let i = 0; i < totalPoints; i++) {
    // Base amplitude
    let amplitude = Math.random() * 0.1;
    
    // Add some contractions
    if ((i > 20 && i < 40) || (i > 80 && i < 100) || (i > 140 && i < 170)) {
      amplitude = Math.random() * 0.8 + 0.2;
    }
    
    data.push({
      time: i * 0.05, // 50ms intervals
      [channelName]: amplitude
    });
  }
  
  return data;
};

export function EMGAnalysisDisplay({ result, onExport, onGenerateReport }: EMGAnalysisDisplayProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [waveformData, setWaveformData] = useState<Record<string, Array<{time: number, amplitude: number}>> | null>(null);
  const [isLoadingWaveforms, setIsLoadingWaveforms] = useState(false);
  const [waveformError, setWaveformError] = useState<string | null>(null);
  
  // Extract result ID from file_id which is a more reliable identifier
  const resultId = result.file_id || result.timestamp?.replace(/[^a-zA-Z0-9]/g, '') || '';
  
  // Fetch waveform data when the user clicks the waveforms tab
  useEffect(() => {
    if (activeTab === 'waveforms' && !waveformData && !isLoadingWaveforms) {
      setIsLoadingWaveforms(true);
      setWaveformError(null);
      
      getEMGWaveformData(resultId)
        .then(data => {
          setWaveformData(data);
          setIsLoadingWaveforms(false);
        })
        .catch(error => {
          console.error('Error fetching waveform data:', error);
          setWaveformError('Failed to load waveform data. Please try again.');
          setIsLoadingWaveforms(false);
        });
    }
  }, [activeTab, resultId, waveformData, isLoadingWaveforms]);
  
  // Transform analytics data for charts
  const prepareChartData = (analytics: Record<string, ChannelAnalytics>, metricKey: keyof ChannelAnalytics) => {
    return Object.entries(analytics).map(([channel, data]) => ({
      channel,
      [metricKey]: data[metricKey]
    }));
  };
  
  const contractionCountData = prepareChartData(result.analytics, 'contraction_count');
  const avgDurationData = prepareChartData(result.analytics, 'avg_duration_ms');
  const maxAmplitudeData = prepareChartData(result.analytics, 'max_amplitude');
  
  // Prepare EMG waveform data for each channel
  const channelNames = Object.keys(result.analytics);
  
  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      // Return the original timestamp if parsing fails
      return timestamp;
    }
  };
  
  // Convert waveform data to format expected by recharts
  const formatWaveformDataForChart = (channelName: string) => {
    if (!waveformData || !waveformData[channelName]) {
      return generateSampleWaveformData(channelName);
    }
    
    return waveformData[channelName].map(point => ({
      time: point.time,
      [channelName]: point.amplitude
    }));
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle>EMG Analysis Results</CardTitle>
            <CardDescription>
              Analysis from {result.metadata.game_name || 'GHOSTLY'} game session
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{formatTimestamp(result.timestamp)}</Badge>
            <Badge>{result.metadata.level ? `Level ${result.metadata.level}` : 'Unknown Level'}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Game metadata summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Player</p>
            <p className="font-medium">{result.metadata.player_name || 'Unknown'}</p>
          </div>
          
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Score</p>
            <p className="font-medium">{result.metadata.score !== undefined ? result.metadata.score : 'N/A'}</p>
          </div>
          
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="font-medium">{result.metadata.duration ? `${result.metadata.duration}s` : 'Unknown'}</p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline" size="sm" onClick={onGenerateReport}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
        
        {/* Tabbed content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="waveforms">Waveforms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Muscle/Channel</TableHead>
                    <TableHead>Contractions</TableHead>
                    <TableHead>Avg. Duration (ms)</TableHead>
                    <TableHead>Max Amplitude</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(result.analytics).map(([channel, data]) => (
                    <TableRow key={channel}>
                      <TableCell className="font-medium">{channel}</TableCell>
                      <TableCell>{data.contraction_count}</TableCell>
                      <TableCell>{data.avg_duration_ms.toFixed(2)}</TableCell>
                      <TableCell>{data.max_amplitude.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Muscle/Channel</TableHead>
                    <TableHead>Total Duration (ms)</TableHead>
                    <TableHead>Min Duration (ms)</TableHead>
                    <TableHead>Max Duration (ms)</TableHead>
                    <TableHead>Avg Amplitude</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(result.analytics).map(([channel, data]) => (
                    <TableRow key={channel}>
                      <TableCell className="font-medium">{channel}</TableCell>
                      <TableCell>{data.total_duration_ms.toFixed(2)}</TableCell>
                      <TableCell>{data.min_duration_ms.toFixed(2)}</TableCell>
                      <TableCell>{data.max_duration_ms.toFixed(2)}</TableCell>
                      <TableCell>{data.avg_amplitude.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="charts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contraction Count by Channel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={contractionCountData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="channel" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="contraction_count" name="Contractions" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Average Duration by Channel (ms)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={avgDurationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="channel" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avg_duration_ms" name="Avg Duration (ms)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Max Amplitude by Channel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={maxAmplitudeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="channel" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="max_amplitude" name="Max Amplitude" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="waveforms" className="space-y-6">
            {isLoadingWaveforms ? (
              <div className="flex justify-center p-12">
                <div className="animate-pulse text-center">
                  <p>Loading waveform data...</p>
                  <div className="mt-2 h-2 w-32 rounded bg-muted"></div>
                </div>
              </div>
            ) : waveformError ? (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-center">
                <p className="text-destructive">{waveformError}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    setWaveformData(null);
                    setWaveformError(null);
                    setActiveTab('waveforms'); // Triggers useEffect to reload
                  }}
                >
                  Retry
                </Button>
              </div>
            ) : (
              channelNames.map((channelName, index) => (
                <Card key={channelName}>
                  <CardHeader>
                    <CardTitle className="text-base">{channelName} EMG Waveform</CardTitle>
                    <CardDescription>
                      {result.analytics[channelName].contraction_count} contractions detected
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formatWaveformDataForChart(channelName)}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis 
                            dataKey="time" 
                            label={{ value: 'Time (seconds)', position: 'insideBottomRight', offset: -10 }} 
                          />
                          <YAxis 
                            label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }} 
                            domain={['auto', 'auto']}
                          />
                          <Tooltip formatter={(value: number | string | boolean | React.ReactText[] | undefined) => 
                            typeof value === 'number' ? value.toFixed(2) : value} />
                          <Line 
                            type="linear" 
                            dataKey={channelName} 
                            stroke={index === 0 ? "#0088FE" : "#FF8042"}
                            dot={false} 
                            strokeWidth={1.5} 
                            name={channelName} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                      <Badge className="mr-2" variant={index === 0 ? "default" : "secondary"}>
                        Avg duration: {result.analytics[channelName].avg_duration_ms.toFixed(1)} ms
                      </Badge>
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        Max amplitude: {result.analytics[channelName].max_amplitude.toFixed(2)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 