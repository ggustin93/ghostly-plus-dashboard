import { useState, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Brain, Save, Play, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { mockData } from '@/data/mock-data';
import TreatmentFormFields, { TreatmentFormValues } from '@/components/treatments/TreatmentFormFields';
import { z } from 'zod';
import { TreatmentPlan, treatmentPlanSchema as importedTreatmentPlanSchema } from '@/types/treatments';

// Schema for the form - this must align with TreatmentFormValues
const pageFormSchema = z.object({
  name: z.string().min(2, { message: 'Treatment name is required' }),
  gameType: z.enum(['maze', 'space']),
  difficulty: z.number().min(1).max(10),
  duration: z.number().min(5).max(60),
  restInterval: z.number().min(10).max(120),
  maxIntensity: z.number().min(30).max(100),
  useBloodFlowRestriction: z.boolean().default(false),
  bfrPressure: z.number().optional(),
  muscleTargets: z.array(z.string()).min(1, { message: 'Select at least one muscle group' }),
  notes: z.string().optional(),
});

// Type for this page's form, excluding patientId
type PageSpecificTreatmentFormValues = Omit<TreatmentFormValues, 'patientId'>;

// Type assertion for gameType to satisfy the enum if it comes from a wider 'string' type
const gameTypes = ['maze', 'space'] as const;
type GameTypeEnum = typeof gameTypes[number];

interface TreatmentConfigPageProps {
  patientId?: string;
  isEmbedded?: boolean;
}

// Helper to map TreatmentPlan to TreatmentFormValues for form initialization
const mapPlanToFormValues = (plan: TreatmentPlan, currentPatientId: string): TreatmentFormValues => {
  return {
    patientId: currentPatientId,
    name: plan.name,
    gameType: plan.gameType as GameTypeEnum,
    difficulty: plan.difficulty,
    duration: plan.duration,
    restInterval: plan.restInterval,
    maxIntensity: plan.maxIntensity,
    useBloodFlowRestriction: plan.useBloodFlowRestriction,
    bfrPressure: plan.bfrPressure,
    muscleTargets: plan.muscleTargets,
    notes: plan.notes,
  };
};

const TreatmentConfigPage = ({ patientId: propPatientId, isEmbedded }: TreatmentConfigPageProps) => {
  const { patientId: routePatientId } = useParams<{ patientId: string }>();
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  const actualPatientId = isEmbedded && propPatientId ? propPatientId : routePatientId;

  const form = useForm<PageSpecificTreatmentFormValues>({
    resolver: zodResolver(pageFormSchema),
  });
  
  useEffect(() => {
    if (!actualPatientId) {
      // Only show toast and navigate if not embedded or if embedded and no propPatientId
      if (!isEmbedded) {
        toast({
          title: t('common.error'),
          description: t('treatment.config.noPatientIdError'),
          variant: 'destructive',
        });
        navigate('/patients');
      } else if (isEmbedded && !propPatientId) {
         toast({
          title: t('common.error'),
          description: t('treatment.config.noPatientIdEmbeddedError', { ns: 'common' }), // Assuming you'll add this translation
          variant: 'destructive',
        });
      }
      setIsLoading(false); // Ensure loading stops even if there's an error
      return;
    }

    const plan = mockData.treatments.find((treat) => treat.patientId === actualPatientId);
    let initialValues: PageSpecificTreatmentFormValues;

    if (plan) {
      const fullFormValues = mapPlanToFormValues(plan as TreatmentPlan, actualPatientId);
      initialValues = fullFormValues;
    } else {
      initialValues = {
        name: 'New Treatment Plan',
        gameType: 'maze',
        difficulty: 3,
        duration: 20,
        restInterval: 30,
        maxIntensity: 70,
        useBloodFlowRestriction: false,
        bfrPressure: undefined,
        muscleTargets: ['biceps', 'deltoid'],
        notes: '',
      };
    }
    form.reset(initialValues);
    setIsLoading(false);
  }, [actualPatientId, navigate, toast, t, form, isEmbedded, propPatientId]);

  const selectedDifficulty = form.watch('difficulty');
  const selectedDuration = form.watch('duration');
  const selectedGameType = form.watch('gameType');
  
  const selectedPatient = actualPatientId ? mockData.patients.find(p => p.id === actualPatientId) : null;
  
  const muscleTargetsList = [
    { id: 'biceps', label: 'Biceps' }, { id: 'triceps', label: 'Triceps' },
    { id: 'deltoid', label: 'Deltoid' }, { id: 'forearm', label: 'Forearm' },
    { id: 'pectoral', label: 'Pectoral' }, { id: 'abdominal', label: 'Abdominal' },
    { id: 'quadriceps', label: 'Quadriceps' }, { id: 'hamstring', label: 'Hamstring' },
  ];
  
  const onSubmitPage = (values: PageSpecificTreatmentFormValues) => {
    if (!actualPatientId) {
      toast({ title: "Error", description: "Patient ID is missing.", variant: "destructive" });
      return;
    }

    const fullValues: TreatmentFormValues = {
      ...values,
      patientId: actualPatientId,
    };
    console.log('Page: Treatment configuration submitted:', fullValues);
    toast({
      title: t('common.save'),
      description: t('treatment.config.saveSuccess'),
    });

    const existingPlanIndex = mockData.treatments.findIndex(
      (plan) => plan.patientId === actualPatientId 
    );

    if (existingPlanIndex > -1) {
      const existingPlan = mockData.treatments[existingPlanIndex];
      const planData: Partial<TreatmentPlan> = {
        name: fullValues.name,
        gameType: fullValues.gameType as GameTypeEnum,
        difficulty: fullValues.difficulty,
        duration: fullValues.duration,
        restInterval: fullValues.restInterval,
        maxIntensity: fullValues.maxIntensity,
        useBloodFlowRestriction: fullValues.useBloodFlowRestriction,
        muscleTargets: fullValues.muscleTargets,
        notes: fullValues.notes,
        updatedAt: new Date().toISOString(),
      };
      if (fullValues.useBloodFlowRestriction && typeof fullValues.bfrPressure === 'number') {
        planData.bfrPressure = fullValues.bfrPressure;
      } else {
        planData.bfrPressure = undefined;
      }
      mockData.treatments[existingPlanIndex] = { ...existingPlan, ...planData } as TreatmentPlan;
    } else {
      const newPlanData: Omit<TreatmentPlan, 'id' | 'createdAt' | 'updatedAt'> = {
        patientId: actualPatientId,
        name: fullValues.name,
        gameType: fullValues.gameType as GameTypeEnum,
        difficulty: fullValues.difficulty,
        duration: fullValues.duration,
        restInterval: fullValues.restInterval,
        maxIntensity: fullValues.maxIntensity,
        useBloodFlowRestriction: fullValues.useBloodFlowRestriction,
        muscleTargets: fullValues.muscleTargets,
        notes: fullValues.notes,
      };
      if (fullValues.useBloodFlowRestriction && typeof fullValues.bfrPressure === 'number') {
        (newPlanData as TreatmentPlan).bfrPressure = fullValues.bfrPressure;
      }

      const newPlan: TreatmentPlan = {
        id: `T${Date.now()}`,
        ...newPlanData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as TreatmentPlan; 
      mockData.treatments.push(newPlan);
    }
    // If embedded, don't navigate away. Navigation should be handled by the parent.
    if (!isEmbedded) {
      navigate(`/patients/${actualPatientId}`);
    }
  };
  
  const handlePreviewToggle = () => {
    setPreviewMode(!previewMode);
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">{t('common.loading')}</div>;
  }
  
  const formForChild: UseFormReturn<TreatmentFormValues> = {
    ...form,
    getValues: () => ({
      ...form.getValues(),
      patientId: actualPatientId || '',
    }),
  } as unknown as UseFormReturn<TreatmentFormValues>;

  // Conditional rendering for back button and page title when embedded
  const showHeader = !isEmbedded;

  return (
    <div className={`space-y-6 ${isEmbedded ? '' : 'py-6'}`}>
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate(`/patients/${actualPatientId}`)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('common.back')}
              </Button>
              <h2 className="text-3xl font-bold tracking-tight">{t('treatment.config.title')}</h2>
            </div>
            <p className="mt-2 text-muted-foreground">
              {t('treatment.config.subtitle')} - {selectedPatient?.name || t('common.unknownPatient')}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handlePreviewToggle}>
              <Play className="mr-2 h-4 w-4" /> 
              {previewMode ? t('treatment.config.actions.exitPreview') : t('treatment.config.actions.preview')}
            </Button>
          </div>
        </div>
      )}
      
      {previewMode && !isEmbedded ? ( // Only show full page preview if not embedded
        <Card>
          <CardHeader>
            <CardTitle>{t('treatment.config.preview.title')}</CardTitle>
            <CardDescription>
              {t('treatment.config.preview.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-[400px] items-center justify-center rounded-md border-2 border-dashed border-muted bg-muted/20">
            <div className="text-center">
              <Brain className="mx-auto h-16 w-16 text-primary/50" />
              <h3 className="mt-4 text-xl font-medium">
                {selectedGameType === 'maze' ? t('treatment.config.games.maze') : 
                 selectedGameType === 'space' ? t('treatment.config.games.space') : 
                 'Unknown Game'}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('treatment.config.preview.details', {
                  difficulty: selectedDifficulty,
                  duration: selectedDuration
                })}
              </p>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={handlePreviewToggle}>{t('treatment.config.actions.exitPreview')}</Button>
          </CardFooter>
        </Card>
      ) : (
        <Form {...formForChild}>
          <form onSubmit={form.handleSubmit(onSubmitPage)} className="space-y-8">
            <TreatmentFormFields form={formForChild} muscleTargetsList={muscleTargetsList} isEmbedded={isEmbedded} t={t} />
            
            {!isEmbedded && ( // Save button only if not embedded
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> {t('common.save')}
                </Button>
              </div>
            )}
          </form>
        </Form>
      )}
    </div>
  );
};

export default TreatmentConfigPage;