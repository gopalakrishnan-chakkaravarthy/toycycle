import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ToyBrick, Smile, Leaf, Truck, Sparkles, Warehouse, Wrench, Gift, MapPin } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { getInventoryCountsByStatus, getDonationsByLocation } from './inventory/actions';
import { InventoryJourney } from './inventory/_components/inventory-journey';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ImpactReportGenerator } from './_components/impact-report-generator';
import { getCurrentUser } from '@/lib/auth';
import { DonationsChart } from './inventory/_components/donations-chart';


const stats = {
  toysRedistributed: 12543,
  environmentalImpact: '15 tons of plastic waste diverted from landfills',
  smilesCreated: 10000,
  userDonations: 5,
};

const workflowSteps = [
    {
        icon: <Truck className="h-10 w-10 text-primary" />,
        title: 'Collection',
        description: 'Toys are collected from generous donors through scheduled pickups and drop-off locations.'
    },
    {
        icon: <Sparkles className="h-10 w-10 text-primary" />,
        title: 'Sanitization',
        description: 'Every toy is thoroughly cleaned and sanitized to ensure it is safe and hygienic for the next child.'
    },
    {
        icon: <Warehouse className="h-10 w-10 text-primary" />,
        title: 'Warehouse',
        description: 'Cleaned toys are sorted and cataloged in our warehouse, ready for the next step.'
    },
    {
        icon: <Wrench className="h-10 w-10 text-primary" />,
        title: 'Refurbishing',
        description: 'Our team lovingly repairs and refurbishes toys that need a little extra care.'
    },
    {
        icon: <Gift className="h-10 w-10 text-primary" />,
        title: 'Ready for Reuse',
        description: 'Toys are redistributed to our partner organizations to bring joy to new families.'
    }
]

export default async function Home() {
  const user = await getCurrentUser();
  
  let adminData = null;
  if (user?.role === 'admin') {
      const [inventoryCounts, donationsByLocation] = await Promise.all([
        getInventoryCountsByStatus(),
        getDonationsByLocation()
      ]);
      adminData = { inventoryCounts, donationsByLocation };
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 animate-fade-in">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Your Impact at a Glance</h1>
          <p className="text-muted-foreground">See the difference we're making together.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toys Redistributed</CardTitle>
              <ToyBrick className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.toysRedistributed.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">and counting...</p>
            </CardContent>
          </Card>
          <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Smiles Created</CardTitle>
              <Smile className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">~{stats.smilesCreated.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Joy delivered to children</p>
            </CardContent>
          </Card>
          <Card className="md:col-span-2 lg:col-span-1 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Environmental Impact</CardTitle>
              <Leaf className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.environmentalImpact.split(' ')[0]} tons</div>
              <p className="text-xs text-muted-foreground">of plastic waste diverted</p>
            </CardContent>
          </Card>
        </div>

        {user?.role === 'admin' && adminData && (
          <div className="flex flex-col gap-8">
            {adminData.inventoryCounts.length > 0 && (
                <InventoryJourney counts={adminData.inventoryCounts} />
            )}
            
            {adminData.donationsByLocation.length > 0 && (
                 <Card>
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="text-primary"/>
                        Donations by Location
                    </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DonationsChart data={adminData.donationsByLocation} />
                    </CardContent>
                </Card>
            )}
        </div>
        )}

        <ImpactReportGenerator stats={stats} />

        <section className="space-y-6">
             <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight font-headline">How It Works</h2>
                <p className="text-muted-foreground">The journey of a toy from one child to the next.</p>
            </div>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                {workflowSteps.map((step, index) => (
                    <Card key={index} className="text-center flex flex-col items-center p-6 transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
                       <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                           {step.icon}
                       </div>
                       <h3 className="text-lg font-semibold">{step.title}</h3>
                       <p className="text-sm text-muted-foreground mt-2 flex-grow">{step.description}</p>
                    </Card>
                ))}
            </div>
        </section>
      </div>
    </AppLayout>
  );
}
