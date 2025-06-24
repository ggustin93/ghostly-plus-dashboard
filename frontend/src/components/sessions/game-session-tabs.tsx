import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { GameSession } from '@/types/session';
import { Clock, Activity, Dumbbell, Award, Zap, ChevronsLeftRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import MetricCard from '@/components/sessions/metric-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EMGDataPoint {
  time: number;
  leftQuadriceps: number;
  rightQuadriceps: number;
}

interface GameSessionTabsProps {
  selectedGameSession: GameSession;
  emgTimeSeriesData: EMGDataPoint[];
  mvcPercentage: number;
  symmetryScore: number;
  engagementScore?: number;
}

export default function GameSessionTabs({
  selectedGameSession,
  emgTimeSeriesData,
  mvcPercentage,
  symmetryScore,
}: GameSessionTabsProps) {
  const [selectedMuscle, setSelectedMuscle] = useState<'both' | 'left' | 'right'>('both');
  
  // Generate muscle-specific metrics based on the selected muscle
  const getMuscleSpecificMetrics = () => {
    const metrics = selectedGameSession.metrics;
    if (!metrics) return null;
    
    // Default values when both muscles are selected
    let rmsValue = metrics.rms;
    let mavValue = metrics.mav;
    let fatigueValue = metrics.fatigueIndex;
    let forceValue = metrics.forceEstimation || 0;
    
    // Adjust values based on selected muscle (using mock data for demonstration)
    // In a real app, these would come from the API with separate metrics for each muscle
    if (selectedMuscle === 'left') {
      rmsValue = metrics.rms * 0.9;  // Example: left is 90% of combined
      mavValue = metrics.mav * 0.85;
      fatigueValue = metrics.fatigueIndex * 1.1;
      forceValue = (metrics.forceEstimation || 0) * 0.9;
    } else if (selectedMuscle === 'right') {
      rmsValue = metrics.rms * 1.1;  // Example: right is 110% of combined
      mavValue = metrics.mav * 1.15;
      fatigueValue = metrics.fatigueIndex * 0.9;
      forceValue = (metrics.forceEstimation || 0) * 1.1;
    }
    
    return {
      rms: rmsValue,
      mav: mavValue,
      fatigueIndex: fatigueValue,
      forceEstimation: forceValue
    };
  };
  
  const muscleSpecificMetrics = getMuscleSpecificMetrics();
  
  return (
    <Tabs defaultValue="analysis" className="space-y-4">
      <TabsList>
        <TabsTrigger value="analysis">EMG Analysis</TabsTrigger>
        <TabsTrigger value="performance">Game Performance</TabsTrigger>
        <TabsTrigger value="bfr">BFR Parameters</TabsTrigger>
      </TabsList>

      <TabsContent value="analysis" className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">EMG Analysis</h3>
          <Select value={selectedMuscle} onValueChange={(value) => setSelectedMuscle(value as 'both' | 'left' | 'right')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select muscle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="both">Both Quadriceps</SelectItem>
              <SelectItem value="left">Left Quadriceps</SelectItem>
              <SelectItem value="right">Right Quadriceps</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="text-base font-medium">Muscle Activation</CardTitle>
              <CardDescription>
                Time series EMG data for {
                  selectedMuscle === 'both' ? selectedGameSession.muscleGroups.join(' & ') :
                  selectedMuscle === 'left' ? 'Left Quadriceps' : 'Right Quadriceps'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={emgTimeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis
                      domain={[0, 'dataMax + 0.2']}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      label={{ value: 'Activation (mV)', angle: -90, position: 'insideLeft' }}
                    />
                    <RechartsTooltip />
                    <Legend />
                    {(selectedMuscle === 'both' || selectedMuscle === 'left') && (
                      <Line
                        type="monotone"
                        dataKey="leftQuadriceps"
                        name="Left Quadriceps"
                        stroke="hsl(var(--chart-1))"
                        dot={false}
                        strokeWidth={2}
                      />
                    )}
                    {(selectedMuscle === 'both' || selectedMuscle === 'right') && (
                      <Line
                        type="monotone"
                        dataKey="rightQuadriceps"
                        name="Right Quadriceps"
                        stroke="hsl(var(--chart-2))"
                        dot={false}
                        strokeWidth={2}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Peak Contraction</CardTitle>
                <CardDescription>Percentage of Maximum Voluntary Contraction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="w-full mb-2">
                    <Progress value={
                      selectedMuscle === 'left' ? mvcPercentage * 0.9 :
                      selectedMuscle === 'right' ? mvcPercentage * 1.1 :
                      mvcPercentage
                    } className="h-3" />
                  </div>
                  <div className="text-2xl font-bold">{
                    (selectedMuscle === 'left' ? mvcPercentage * 0.9 :
                    selectedMuscle === 'right' ? mvcPercentage * 1.1 :
                    mvcPercentage).toFixed(1)
                  }%</div>
                  <p className="text-xs text-muted-foreground">of target MVC</p>
                </div>
              </CardContent>
            </Card>

            {selectedMuscle === 'both' && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Muscle Symmetry</CardTitle>
                  <CardDescription>Balance between left and right</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="w-full mb-2">
                      <Progress value={symmetryScore} className="h-3" />
                    </div>
                    <div className="text-2xl font-bold">{symmetryScore.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">symmetry score</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {selectedMuscle !== 'both' && (
            <>
              <MetricCard
                title="RMS"
                value={muscleSpecificMetrics?.rms || 0}
                unit="mV"
                description={`Root Mean Square (${selectedMuscle === 'left' ? 'Left' : 'Right'})`}
                icon={<Activity className="h-4 w-4" />}
                avg={selectedGameSession.metrics?.rmsAvg || 0.75}
                std={selectedGameSession.metrics?.rmsStd || 0.12}
                isWIP={true}
              />
              <MetricCard
                title="MAV"
                value={muscleSpecificMetrics?.mav || 0}
                unit="mV"
                description={`Mean Absolute Value (${selectedMuscle === 'left' ? 'Left' : 'Right'})`}
                icon={<Activity className="h-4 w-4" />}
                avg={selectedGameSession.metrics?.mavAvg || 0.65}
                std={selectedGameSession.metrics?.mavStd || 0.09}
                isWIP={true}
              />
              <MetricCard
                title="Fatigue Index"
                value={muscleSpecificMetrics?.fatigueIndex || 0}
                unit=""
                description={`Dimitrov's index (${selectedMuscle === 'left' ? 'Left' : 'Right'})`}
                icon={<Activity className="h-4 w-4" />}
                isWIP={true}
              />
              <MetricCard
                title="Force Estimation"
                value={muscleSpecificMetrics?.forceEstimation || 0}
                unit="N"
                description={`Estimated muscle force (${selectedMuscle === 'left' ? 'Left' : 'Right'})`}
                icon={<Activity className="h-4 w-4" />}
                isWIP={true}
              />
            </>
          )}
          {selectedMuscle === 'both' && (
            <div className="col-span-4 flex justify-center items-center p-4 bg-muted/20 rounded-lg border border-dashed">
              <p className="text-muted-foreground text-sm">Select Left or Right Quadriceps to view muscle-specific metrics</p>
            </div>
          )}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Contraction Counts</CardTitle>
            <CardDescription>Number of long and short muscle contractions.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {(selectedMuscle === 'both' || selectedMuscle === 'left') && (
              <MetricCard
                title="Long (L)"
                value={selectedGameSession.metrics?.longContractionsLeft || 0}
                unit="count"
                description="Left Muscle"
                isInteger
                icon={<ChevronsLeftRight className="h-4 w-4" />}
              />
            )}
            {(selectedMuscle === 'both' || selectedMuscle === 'right') && (
              <MetricCard
                title="Long (R)"
                value={selectedGameSession.metrics?.longContractionsRight || 0}
                unit="count"
                description="Right Muscle"
                isInteger
                icon={<ChevronsLeftRight className="h-4 w-4" />}
              />
            )}
            {(selectedMuscle === 'both' || selectedMuscle === 'left') && (
              <MetricCard
                title="Short (L)"
                value={selectedGameSession.metrics?.shortContractionsLeft || 0}
                unit="count"
                description="Left Muscle"
                isInteger
                icon={<Zap className="h-4 w-4" />}
              />
            )}
            {(selectedMuscle === 'both' || selectedMuscle === 'right') && (
              <MetricCard
                title="Short (R)"
                value={selectedGameSession.metrics?.shortContractionsRight || 0}
                unit="count"
                description="Right Muscle"
                isInteger
                icon={<Zap className="h-4 w-4" />}
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="performance" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center">
                <Award className="h-4 w-4 mr-2" /> Activation Points
              </CardTitle>
              <CardDescription>Total points earned and contraction breakdown for the game session.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex flex-col items-center">
              <div className="h-[250px] w-full flex items-center justify-center mb-3">
                {selectedGameSession.statistics && selectedGameSession.metrics ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Achieved', value: selectedGameSession.statistics.activationPoints || 0 },
                          { name: 'Remaining', value: Math.max(0, (selectedGameSession.parameters.repetitions * 100) - (selectedGameSession.statistics.activationPoints || 0)) }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        innerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell key={`cell-achieved`} fill="hsl(var(--chart-1))" />
                        <Cell key={`cell-remaining`} fill="hsl(var(--muted))" />
                      </Pie>
                      <RechartsTooltip formatter={(value: number, name: string) => [`${value} pts`, name]} />
                      <text
                        x="50%"
                        y="48%"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{ fontSize: '28px', fontWeight: 'bold', fill: 'hsl(var(--foreground))' }}
                      >
                        {selectedGameSession.statistics.activationPoints || 0}
                      </text>
                      <text
                        x="50%"
                        y="60%"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{ fontSize: '12px', fill: 'hsl(var(--muted-foreground))' }}
                      >
                        points
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No performance data available
                  </div>
                )}
              </div>
              {selectedGameSession.metrics && (
                <div className="w-full px-2 sm:px-4">
                  <h4 className="text-sm font-medium mb-3 text-center text-muted-foreground">Contraction Breakdown</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
                    {[
                      { label: "Long (L)", value: selectedGameSession.metrics.longContractionsLeft || 0, icon: <ChevronsLeftRight className="h-4 w-4 text-blue-500" /> },
                      { label: "Long (R)", value: selectedGameSession.metrics.longContractionsRight || 0, icon: <ChevronsLeftRight className="h-4 w-4 text-green-500" /> },
                      { label: "Short (L)", value: selectedGameSession.metrics.shortContractionsLeft || 0, icon: <Zap className="h-4 w-4 text-yellow-500" /> },
                      { label: "Short (R)", value: selectedGameSession.metrics.shortContractionsRight || 0, icon: <Zap className="h-4 w-4 text-purple-500" /> },
                    ].map((item, index) => (
                      <div key={index} className="p-3 rounded-lg border bg-card shadow-sm flex flex-col items-center justify-center">
                        <div className="mb-1">{item.icon}</div>
                        <div className="text-lg font-bold text-foreground">{item.value}</div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-1 space-y-4">
            <MetricCard
              title="Duration"
              value={selectedGameSession.statistics?.duration
                ? selectedGameSession.statistics.duration / 60
                : 0}
              unit="min"
              description="Total gameplay time"
              icon={<Clock className="h-4 w-4" />}
            />
            <MetricCard
              title="Level"
              value={selectedGameSession.statistics?.levelsCompleted || 0}
              unit=""
              description="Game progression"
              icon={<Dumbbell className="h-4 w-4" />}
              isInteger
            />
            <MetricCard
              title="Inactivity Periods"
              value={selectedGameSession.statistics?.inactivityPeriods || 0}
              unit=""
              description="Rest or disengagement"
              icon={<Clock className="h-4 w-4" />}
              isInteger
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Game Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-2">Basic Settings</h3>
                <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">Difficulty Level:</dt>
                  <dd>{selectedGameSession.parameters.difficulty}</dd>
                  <dt className="text-muted-foreground">Target MVC:</dt>
                  <dd>{selectedGameSession.parameters.targetMVC}%</dd>
                  <dt className="text-muted-foreground">Expected Repetitions:</dt>
                  <dd>{selectedGameSession.parameters.repetitions}</dd>
                  <dt className="text-muted-foreground">Avg. Rest Interval:</dt>
                  <dd>{selectedGameSession.parameters.restIntervals} sec</dd>
                </dl>
              </div>
              <div>
                <h3 className="font-medium mb-2">DDA Parameters</h3>
                <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">DDA Enabled:</dt>
                  <dd>{selectedGameSession.parameters.ddaEnabled ? 'Yes' : 'No'}</dd>
                  {selectedGameSession.parameters.ddaParameters && (
                    <>
                      <dt className="text-muted-foreground">Adaptive Contraction:</dt>
                      <dd>{selectedGameSession.parameters.ddaParameters.adaptiveContractionDetection ? 'Yes' : 'No'}</dd>
                      <dt className="text-muted-foreground">Adaptive Progression:</dt>
                      <dd>{selectedGameSession.parameters.ddaParameters.adaptiveLevelProgression ? 'Yes' : 'No'}</dd>
                    </>
                  )}
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="bfr" className="space-y-4">
        {selectedGameSession.bfrParameters ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">BFR Parameters</CardTitle>
                <CardDescription>
                  Blood Flow Restriction settings applied during this session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-4 text-sm">
                  <dt className="text-muted-foreground">Measured AOP:</dt>
                  <dd className="font-medium">{selectedGameSession.bfrParameters.aop} mmHg</dd>
                  <dt className="text-muted-foreground">Target Percentage:</dt>
                  <dd className="font-medium">{selectedGameSession.bfrParameters.targetPercentage}% of AOP</dd>
                  <dt className="text-muted-foreground">Applied Cuff Pressure:</dt>
                  <dd className="font-medium">{selectedGameSession.bfrParameters.cuffPressure} mmHg</dd>
                  <dt className="text-muted-foreground">Set Duration (BFR Active):</dt>
                  <dd className="font-medium">{selectedGameSession.bfrParameters.duration} min</dd>
                  {typeof selectedGameSession.bfrParameters.setNumber === 'number' && typeof selectedGameSession.bfrParameters.totalSets === 'number' && (
                    <>
                      <dt className="text-muted-foreground">Set Number:</dt>
                      <dd className="font-medium">{selectedGameSession.bfrParameters.setNumber} of {selectedGameSession.bfrParameters.totalSets}</dd>
                    </>
                  )}
                  {selectedGameSession.bfrParameters.repetitionsInSet && (
                    <>
                      <dt className="text-muted-foreground">Repetitions in Set:</dt>
                      <dd className="font-medium">{selectedGameSession.bfrParameters.repetitionsInSet} reps</dd>
                    </>
                  )}
                  {selectedGameSession.bfrParameters.restBetweenSets && (
                    <>
                      <dt className="text-muted-foreground">Rest Between Sets:</dt>
                      <dd className="font-medium">{selectedGameSession.bfrParameters.restBetweenSets} sec</dd>
                    </>
                  )}
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Pressure Visualization</CardTitle>
                <CardDescription>
                  Visual representation of BFR pressure relative to AOP
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                {selectedGameSession.bfrParameters ? (
                  <>
                    <div className="relative w-48 h-48 mb-4">
                      <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="10"
                          strokeDasharray={`${2 * Math.PI * 45 * (selectedGameSession.bfrParameters.targetPercentage || 0) / 100} ${2 * Math.PI * 45 * (1 - (selectedGameSession.bfrParameters.targetPercentage || 0) / 100)}`}
                          strokeDashoffset={2 * Math.PI * 45 * 0.25}
                          transform="rotate(-90 50 50)"
                        />
                        <text x="50" y="45" textAnchor="middle" style={{ fontSize: '1.5rem', fontWeight: 'bold', fill: 'hsl(var(--foreground))' }}>
                          {selectedGameSession.bfrParameters.targetPercentage || 0}%
                        </text>
                        <text x="50" y="60" textAnchor="middle" style={{ fontSize: '0.75rem', fill: 'hsl(var(--muted-foreground))' }}>
                          of AOP
                        </text>
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm mb-1">
                        <span className="font-medium">Applied pressure:</span> {selectedGameSession.bfrParameters.cuffPressure} mmHg
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Full occlusion (AOP):</span> {selectedGameSession.bfrParameters.aop} mmHg
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>BFR pressure visualization not available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">BFR Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No BFR parameters were applied during this game session.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
} 