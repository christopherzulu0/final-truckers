

import {

  CreditCard,
  DollarSign,
  Users,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"



import PreviousTrips from './PreviousTrips'
export default function DriverBoards() {
    const trips = [
        {
          id: 1,
          avatar: '/avatars/01.png',
          fallback: 'OM',
          item: 'Cement',
          destination: 'Dubai',
          date: '30.08.2024',
          duration: '5 hours',
         
        },
        {
            id: 1,
            avatar: '/avatars/01.png',
            fallback: 'OM',
            item: 'Cement',
            destination: 'Dubai',
            date: '30.08.2024',
            duration: '5 hours',
           
          },
          
        // Add more trip objects as needed
      ];
  return (
    <div className="flex min-h-screen w-full flex-col">
     
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
               Total Deliveries
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">120</div>
              <p className="text-xs text-muted-foreground">
                60%
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
               On-Time Deliveries
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+250</div>
              <p className="text-xs text-muted-foreground">
               50
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8/5.0</div>
              <p className="text-xs text-muted-foreground">
               80% All
              </p>
            </CardContent>
          </Card>
         
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Safety Incidents</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12</div>
              <p className="text-xs text-muted-foreground">
                5% All
              </p>
            </CardContent>
          </Card>

        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <PreviousTrips/>
                </div>
      </main>
    </div>
  )
}