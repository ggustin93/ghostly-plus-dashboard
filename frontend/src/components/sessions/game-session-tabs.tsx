import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { GameSession } from '@/types/session';
import { Clock, Activity, Dumbbell, Award, Zap, ChevronsLeftRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import MetricCard from '@/components/sessions/metric-card';

interface EMGDataPoint {
  time: number;
  leftQuadriceps: number;
  rightQuadriceps: number;
}

declare module '@/types/session' {
  interface EMGMetrics {
    longContractionsLeft?: number;
    longContractionsRight?: number;
    shortContractionsLeft?: number;
    shortContractionsRight?: number;
  }
}

interface GameSessionTabsProps {
  selectedGameSession: GameSession;
  emgTimeSeriesData: EMGDataPoint[];
  mvcPercentage: number;
  symmetryScore: number;
}

export default function GameSessionTabs({
  selectedGameSession,
  emgTimeSeriesData,
  mvcPercentage,
  symmetryScore,
}: GameSessionTabsProps) {
  return (
    <Tabs defaultValue="analysis" className="space-y-4">
      <TabsList>
        <TabsTrigger value="analysis">EMG Analysis</TabsTrigger>
        <TabsTrigger value="performance">Game Performance</TabsTrigger>
        <TabsTrigger value="bfr">BFR Parameters</TabsTrigger>
      </TabsList>

      <TabsContent value="analysis" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="text-base font-medium">Muscle Activation</CardTitle>
              <CardDescription>
                Time series EMG data for {selectedGameSession.muscleGroups.join(' & ')}
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
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="leftQuadriceps"
                      name="Left Quadriceps"
                      stroke="hsl(var(--chart-1))"
                      dot={false}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="rightQuadriceps"
                      name="Right Quadriceps"
                      stroke="hsl(var(--chart-2))"
                      dot={false}
                      strokeWidth={2}
                    />
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
                    <Progress value={mvcPercentage} className="h-3" />
                  </div>
                  <div className="text-2xl font-bold">{mvcPercentage.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">of target MVC</p>
                </div>
              </CardContent>
            </Card>

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
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="RMS"
            value={selectedGameSession.metrics?.rms || 0}
            unit="mV"
            description="Root Mean Square"
            icon={<Activity className="h-4 w-4" />}
          />
          <MetricCard
            title="MAV"
            value={selectedGameSession.metrics?.mav || 0}
            unit="mV"
            description="Mean Absolute Value"
            icon={<Activity className="h-4 w-4" />}
          />
          <MetricCard
            title="Fatigue Index"
            value={selectedGameSession.metrics?.fatigueIndex || 0}
            unit=""
            description="Dimitrov's index"
            icon={<Activity className="h-4 w-4" />}
          />
          <MetricCard
            title="Force Estimation"
            value={selectedGameSession.metrics?.forceEstimation || 0}
            unit="N"
            description="Estimated muscle force"
            icon={<Activity className="h-4 w-4" />}
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Contraction Counts</CardTitle>
            <CardDescription>Number of long and short muscle contractions.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Long (L)"
              value={selectedGameSession.metrics?.longContractionsLeft || 0}
              unit="count"
              description="Left Muscle"
              isInteger
              icon={<ChevronsLeftRight className="h-4 w-4" />}
            />
            <MetricCard
              title="Long (R)"
              value={selectedGameSession.metrics?.longContractionsRight || 0}
              unit="count"
              description="Right Muscle"
              isInteger
              icon={<ChevronsLeftRight className="h-4 w-4" />}
            />
            <MetricCard
              title="Short (L)"
              value={selectedGameSession.metrics?.shortContractionsLeft || 0}
              unit="count"
              description="Left Muscle"
              isInteger
              icon={<Zap className="h-4 w-4" />}
            />
            <MetricCard
              title="Short (R)"
              value={selectedGameSession.metrics?.shortContractionsRight || 0}
              unit="count"
              description="Right Muscle"
              isInteger
              icon={<Zap className="h-4 w-4" />}
            />
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
                      <Tooltip formatter={(value: number, name: string) => [`${value} pts`, name]} />
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