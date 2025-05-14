import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { TFunction } from 'i18next';

// Define the form schema directly here or import it if it's shared and complex enough
const formSchema = z.object({
  patientId: z.string({
    required_error: "Patient selection is required",
  }),
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

export type TreatmentFormValues = z.infer<typeof formSchema>;

interface MuscleTarget {
  id: string;
  label: string;
}

interface TreatmentFormFieldsProps {
  form: UseFormReturn<TreatmentFormValues>;
  onSubmit?: (values: TreatmentFormValues) => void;
  muscleTargetsList: MuscleTarget[];
  t: TFunction;
  isEmbedded?: boolean; // To control elements like the final save button's container styling
}

const TreatmentFormFields = ({ form, muscleTargetsList, t, isEmbedded = false }: TreatmentFormFieldsProps) => {
  const useBloodFlowRestriction = form.watch('useBloodFlowRestriction');

  return (
    <Tabs defaultValue="gameConfig" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="gameConfig">{t('treatment.config.tabs.basic')}</TabsTrigger>
        <TabsTrigger value="muscleBfr">{t('treatment.config.tabs.advanced')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="gameConfig" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('treatment.config.tabs.basic')}</CardTitle>
            <CardDescription>
              {t('treatment.config.basicDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('treatment.config.form.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('treatment.config.form.namePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gameType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('treatment.config.form.gameType')}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('treatment.config.form.gameTypePlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="maze">{t('treatment.config.games.maze')}</SelectItem>
                        <SelectItem value="space">{t('treatment.config.games.space')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t('treatment.config.form.gameTypeDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('treatment.config.form.difficulty')} - {field.value}</FormLabel>
                  <FormControl>
                    <Slider defaultValue={[field.value]} onValueChange={(value) => field.onChange(value[0])} max={10} step={1} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('treatment.config.form.duration')} - {field.value} {t('common.minutes')}</FormLabel>
                    <FormControl>
                      <Slider defaultValue={[field.value]} onValueChange={(value) => field.onChange(value[0])} max={60} step={5} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="restInterval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('treatment.config.form.restInterval')} - {field.value} {t('common.seconds')}</FormLabel>
                    <FormControl>
                      <Slider defaultValue={[field.value]} onValueChange={(value) => field.onChange(value[0])} max={120} step={10} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="muscleBfr" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('treatment.config.tabs.advanced')}</CardTitle>
            <CardDescription>
              {t('treatment.config.advancedDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="maxIntensity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('treatment.config.form.maxIntensity')} - {field.value}% MVC</FormLabel>
                  <FormControl>
                    <Slider defaultValue={[field.value]} onValueChange={(value) => field.onChange(value[0])} max={100} step={5} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="muscleTargets"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">{t('treatment.config.form.muscleGroups')}</FormLabel>
                    <FormDescription>
                      {t('treatment.config.form.muscleGroupsDescription')}
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {muscleTargetsList.map((muscle) => (
                      <FormField
                        key={muscle.id}
                        control={form.control}
                        name="muscleTargets"
                        render={({ field: innerField }) => {
                          return (
                            <FormItem
                              key={muscle.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={innerField.value?.includes(muscle.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? innerField.onChange([...(innerField.value || []), muscle.id])
                                      : innerField.onChange(
                                          (innerField.value || []).filter(
                                            (value: string) => value !== muscle.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {muscle.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="useBloodFlowRestriction"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t('treatment.config.form.bfr')}
                    </FormLabel>
                    <FormDescription>
                      {t('treatment.config.form.bfrDescription')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {useBloodFlowRestriction && (
              <FormField
                control={form.control}
                name="bfrPressure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('treatment.config.form.bfrPressure')}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 120 mmHg" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || undefined)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {!isEmbedded && (
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" /> {t('common.save')}
          </Button>
        </div>
      )}
    </Tabs>
  );
};

export default TreatmentFormFields; 