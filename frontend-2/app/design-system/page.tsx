"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Terminal } from 'lucide-react'; // For Alert example

// Helper component for color swatches
const ColorSwatch = ({ name, className, variable }: { name: string; className: string; variable: string }) => (
  <div className="flex flex-col space-y-1.5">
    <div className={`h-10 w-full rounded border border-border ${className}`}></div>
    <div className="px-0.5">
      <div className="font-medium text-xs capitalize">{name}</div>
      <div className="text-muted-foreground text-xs font-mono">{variable}</div>
    </div>
  </div>
);

export default function DesignSystemPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 border-b pb-2">Design System Reference</h1>

      {/* Colors Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Color Palette</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-4">
          <ColorSwatch name="Primary" className="bg-primary text-primary-foreground" variable="--primary" />
          <ColorSwatch name="Secondary" className="bg-secondary text-secondary-foreground" variable="--secondary" />
          <ColorSwatch name="Accent" className="bg-accent text-accent-foreground" variable="--accent" />
          <ColorSwatch name="Destructive" className="bg-destructive text-destructive-foreground" variable="--destructive" />
          <ColorSwatch name="Muted" className="bg-muted text-muted-foreground" variable="--muted" />
          <ColorSwatch name="Background" className="bg-background text-foreground" variable="--background" />
          <ColorSwatch name="Foreground" className="bg-foreground text-background" variable="--foreground" />
          <ColorSwatch name="Border" className="bg-border" variable="--border" />
          <ColorSwatch name="Input" className="bg-input" variable="--input" />
          <ColorSwatch name="Ring" className="bg-ring" variable="--ring" />
          <ColorSwatch name="Card" className="bg-card text-card-foreground" variable="--card" />
          <ColorSwatch name="Popover" className="bg-popover text-popover-foreground" variable="--popover" />
        </div>
      </section>

      <Separator className="my-8" />

      {/* Typography Section */}
      <section className="mb-12 prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-semibold mb-4 not-prose">Typography</h2>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
        <p>
          This is a paragraph of text demonstrating the default body copy style. It should be easily readable and use the primary foreground color against the background. You can check <a href="#">links</a> and <code>inline code</code> snippets as well.
        </p>
        <blockquote>This is a blockquote, useful for highlighting text or quotes.</blockquote>
        <ul>
          <li>Unordered List Item 1</li>
          <li>Unordered List Item 2</li>
        </ul>
        <ol>
          <li>Ordered List Item 1</li>
          <li>Ordered List Item 2</li>
        </ol>
        <pre><code>{`{
  "key": "value",
  "example": "This is a preformatted code block."
}`}</code></pre>
      </section>

      <Separator className="my-8" />

      {/* Components Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Components</h2>

        {/* Buttons */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-4">Buttons</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <Button>Primary (Default)</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>

        {/* Card */}
        <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">Card</h3>
            <Card className="max-w-sm">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is the card content area.</p>
              </CardContent>
              <CardFooter>
                <Button>Card Button</Button>
              </CardFooter>
            </Card>
        </div>

        {/* Forms */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-medium mb-4">Forms</h3>
            <div className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" placeholder="Email" />
              </div>
              <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms and conditions</Label>
              </div>
              <RadioGroup defaultValue="option-one">
                  <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">Option One</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">Option Two</Label>
                  </div>
              </RadioGroup>
              <div className="flex items-center space-x-2">
                  <Switch id="airplane-mode" />
                  <Label htmlFor="airplane-mode">Airplane Mode</Label>
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Other Components */}
          <div>
            <h3 className="text-xl font-medium mb-4">Other Components</h3>
            <div className="space-y-4">
                <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                        This is a standard alert component.
                    </AlertDescription>
                </Alert>
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>
                        This is a destructive alert component.
                    </AlertDescription>
                </Alert>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default Badge</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">Hover Me (Tooltip)</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tooltip Content</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-4">Tabs</h3>
           <Tabs defaultValue="account" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>
              <TabsContent value="account">Make changes to your account here.</TabsContent>
              <TabsContent value="password">Change your password here.</TabsContent>
            </Tabs>
        </div>

      </section>
    </div>
  );
} 