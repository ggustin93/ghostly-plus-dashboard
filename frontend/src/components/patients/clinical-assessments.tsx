import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ClinicalAssessmentsProps {
  patientId: string; // Will be used to fetch real data
  isEmbedded?: boolean;
}

// Base categories and measures definition
const rawAssessmentCategories = [
  { 
    title: "Muscle Strength", 
    measures: ["MicroFET (e.g., Quadriceps)"],
    details: "Assessed using handheld dynamometry." 
  },
  {
    title: "Muscle Morphology", 
    measures: ["Ultrasound (e.g., Quadriceps - Rectus Femoris, Vastus Lateralis): Cross-sectional area, muscle thickness, pennation angle, fascicle length, echo intensity"],
    details: "Assessed using ultrasound imaging."
  },
  {
    title: "Body Composition", 
    measures: ["Segmental Bio-impedance (e.g., Quadscan 4000): Muscle mass, phase angle"],
    details: "Assessed using bio-impedance analysis."
  },
  {
    title: "Functional Tests", 
    measures: ["30s Sit-to-Stand", "Timed Up and Go (TUG)", "Short Physical Performance Battery (SPPB)", "6-minute Walking Test (6MWT)", "Chair Stand Test (CST)"],
    details: "Standardized functional mobility and endurance tests."
  },
  {
    title: "Cognitive Status", 
    measures: ["Mini-Mental State Examination (MMSE)"],
    details: "Assessed using MMSE."
  },
  {
    title: "Quality of Life", 
    measures: ["EQ-5D-5L", "PROMIS Global Health", "Global Perceived Effect (GPE)"],
    details: "Patient-reported outcome measures."
  },
  {
    title: "Physical Activity", 
    measures: ["Accelerometry data"],
    details: "Objective measurement of physical activity levels."
  },
  {
    title: "Adverse Events", 
    measures: ["Log of any adverse events"],
    details: "Documentation of any adverse events during the trial."
  },
  {
    title: "Adherence and Engagement",
    measures: ["Session completion rates", "Game interaction data", "Patient-reported experience"],
    details: "Tracking patient adherence to the GHOSTLY+ intervention and engagement levels."
  },
  {
    title: "Immobilization & Hospital Stay",
    measures: ["Duration of immobilization", "Length of hospital stay"],
    details: "Key contextual data points."
  }
];

// Color palette for badges
const categoryColorPalette = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500',
  'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500',
  'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
  'bg-pink-500', 'bg-rose-500'
];

const getCategoryStyle = (categoryTitle: string) => {
  let hash = 0;
  for (let i = 0; i < categoryTitle.length; i++) {
    const char = categoryTitle.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; 
  }
  const colorClass = categoryColorPalette[Math.abs(hash) % categoryColorPalette.length];
  return `${colorClass} text-white hover:${colorClass}`;
};

interface FlatMeasure {
  id: string;
  category: string;
  measure: string;
  categoryDetails: string;
  categoryStyle: string;
}

// Mock data for a few selected measures - only needs date
const mockPatientAssessments: { [measureId: string]: { date: string } } = {
  'muscle-strength_0': { date: '2024-07-15' },
  'cognitive-status_0': { date: '2024-07-10' },
  'quality-of-life_0': { date: '2024-07-15' },
  'functional-tests_1': { date: '2024-07-12' },
};

// Flattened structure for table rows
const allFlattenedMeasures: FlatMeasure[] = rawAssessmentCategories.flatMap((category, _catIndex) => 
  category.measures.map((measure, measureIndex) => ({
    id: `${category.title.toLowerCase().replace(/\s+/g, '-')}_${measureIndex}`,
    category: category.title,
    measure: measure,
    categoryDetails: category.details,
    categoryStyle: getCategoryStyle(category.title),
  }))
);

// Filter to get only measures that have mock data
const measuresWithMockData = allFlattenedMeasures.filter(measure => 
  Object.keys(mockPatientAssessments).includes(measure.id)
);

const ClinicalAssessments: React.FC<ClinicalAssessmentsProps> = ({ patientId: _patientId, isEmbedded }) => {
  return (
    <TooltipProvider>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-left">Measure</TableHead>
              <TableHead className="text-right whitespace-nowrap">Last Assessed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {measuresWithMockData.map((item) => {
              const assessmentData = mockPatientAssessments[item.id]; // Data will always exist here due to the filter
              const displayDate = assessmentData ? new Date(assessmentData.date).toLocaleDateString() : "N/A";

              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className={item.categoryStyle}>{item.category}</Badge>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="max-w-xs text-sm">{item.categoryDetails}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="font-medium text-left text-sm py-2.5">{item.measure}</TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm py-2.5">{displayDate}</TableCell>
                </TableRow>
              );
            })}
            {measuresWithMockData.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                  No assessment data available. (Mock data keys might not match generated IDs if this shows)
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {isEmbedded && measuresWithMockData.length > 0 && (
         <div className="text-xs text-muted-foreground pt-3 text-center">
            Note: Showing examples. Detailed data entry and historical views are in the dedicated Assessments section.
          </div>
      )}
    </TooltipProvider>
  );
};

export default ClinicalAssessments;