import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { mockData } from '@/data/mock-data';
import { formatDate } from '@/lib/utils';

interface ClinicalAssessmentsProps {
  patientId: string;
  isEmbedded?: boolean;
}

const assessmentCategories: { [key: string]: string[] } = {
  'strength': ['MicroFET', 'Dynamometer'],
  'rom': ['Goniometer'],
  'balance': ['SitToStand', 'TUG'],
  'spasticity': ['Ashworth'],
  'morphology': ['Ultrasound']
};

const ClinicalAssessments: React.FC<ClinicalAssessmentsProps> = ({ patientId, isEmbedded }) => {
  const patientAssessments = mockData.patients
    .find(p => p.id === patientId)?.assessments || [];

  const groupedAssessments = patientAssessments.reduce((acc, assessment) => {
    const category = Object.keys(assessmentCategories).find(cat => 
      assessmentCategories[cat].includes(assessment.type)
    ) || 'other';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(assessment);
    return acc;
  }, {} as Record<string, typeof patientAssessments>);

  return (
    <TooltipProvider>
      <div className={!isEmbedded ? "p-4 border rounded-lg" : ""}>
        {!isEmbedded && <h3 className="text-lg font-semibold mb-4">Clinical Assessments</h3>}
        <div className="space-y-4">
          {Object.entries(groupedAssessments).map(([category, assessments]) => (
            <div key={category}>
              <h4 className="font-semibold capitalize mb-2">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {assessments.map((assessment) => (
                  <Tooltip key={assessment.id}>
                    <TooltipTrigger>
                      <Badge variant="outline">{assessment.type}</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Date: {formatDate(assessment.date)}</p>
                      <p>Value: {assessment.value}</p>
                      {assessment.notes && <p>Notes: {assessment.notes}</p>}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ClinicalAssessments;