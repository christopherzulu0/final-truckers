
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import WriterApprove from "./Components/WriterApprove"
import DriverApprove from "./Components/DriverApprove"
import DispatcherApprove from "./Components/DispatcherApprove"
import Cards from "./Components/Cards"

export default function ApprovalList() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
  
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-2">
              <Card
                className="sm:col-span-2" x-chunk="dashboard-05-chunk-0"
              >
                <CardHeader className="pb-3">
                  <CardTitle>Approval Management</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Manage all your approvals from here..
                  </CardDescription>
                </CardHeader>
                {/* <CardFooter>
                  <Button>Create New Order</Button>
                </CardFooter> */}
              </Card>
             <Cards/>
           
            </div>
            <Tabs defaultValue="writers">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="writers">Writers List</TabsTrigger>
                  <TabsTrigger value="drivers">Drivers List</TabsTrigger>
                  <TabsTrigger value="dispatchers">Dispatchers List</TabsTrigger>
                </TabsList>
               
              </div>
          <WriterApprove/>
          <DriverApprove/>
          <DispatcherApprove/>
            </Tabs>
          </div>
         
        </main>
      </div>
    </div>
  )
}
