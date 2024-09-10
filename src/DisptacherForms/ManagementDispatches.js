'use client'

import React,{useState,useEffect} from 'react'
import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
  MoreHorizontal,
  User
} from "lucide-react"

import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"

import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { getFirestore, collection, addDoc, query, where, onSnapshot, serverTimestamp, getDocs } from 'firebase/firestore';

import { app, auth, firestore } from "../firebase/clientApp";




export default function ManagementDispatches() {
  const [dispatchers, setDispatchers] = useState([]);
  

  useEffect(() => {
    if (User) {
      console.error('User is not authenticated');
      return;
    }

    const db = getFirestore(app);
    
    const dispatchersQuery = query(
      collection(db, 'Dispatchers'),
      where('UID', '==', User.uid)
    );

    const unsubscribeDispatchers = onSnapshot(dispatchersQuery, async (dispatchersSnapshot) => {
      const dispatcherData = [];
      
      const promises = dispatchersSnapshot.docs.map(async (dispatcherDoc) => {
        const dispatchesQuery = collection(db, `Dispatchers/${dispatcherDoc.id}/Dispatches`);
        const dispatchesSnapshot = await getDocs(dispatchesQuery);
        const dispatches = dispatchesSnapshot.docs.map(dispatchDoc => ({
          id: dispatchDoc.id,
          dispatcherId: dispatcherDoc.id,
          ...dispatchDoc.data()
        }));
        return {
          id: dispatcherDoc.id,
          ...dispatcherDoc.data(),
          dispatches
        };
      });

      try {
        const results = await Promise.all(promises);
        dispatcherData.push(...results);
        setDispatchers(dispatcherData);
      } catch (error) {
        console.error('Error fetching dispatch data:', error);
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribeDispatchers();
  }, [User]);

const countStatuses = (status) => {
    return dispatchers.reduce((count, dispatcher) => {
      return count + dispatcher.dispatches.filter(dispatch => dispatch.Status === status).length;
    }, 0);
  };

  
  const approvedCount = countStatuses('Approved');
  const pendingCount = countStatuses('Pending');
  const completedCount = countStatuses('Completed');
  const cancelledCount = countStatuses('Cancelled');
  
  const totalDispatchers = approvedCount + pendingCount + completedCount + cancelledCount;
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        {/* <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/DriverManagement" className="text-foreground transition-colors hover:text-foreground">
            Driver Management
          </Link>
        </nav> */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          {/* <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link href="/DriverManagement" className="text-foreground transition-colors hover:text-foreground">
                Driver Management
              </Link>
            </nav>
          </SheetContent> */}
        </Sheet>
      
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Dispatchers Today
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDispatchers}</div>
              {/* <p className="text-xs text-muted-foreground">
                +20.1% Today
              </p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Dispatches
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedCount}</div>
              {/* <p className="text-xs text-muted-foreground">
                +180.1%
              </p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Dispatchers</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              {/* <p className="text-xs text-muted-foreground">
                +19% All
              </p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Dispatches</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}</div>
              {/* <p className="text-xs text-muted-foreground">
                +201
              </p> */}
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Dispatch Management</CardTitle>
                <CardDescription>
                  Manage all dispatches here.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/DispatchUpload">
                  New Dispatch
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden md:table-cell">License Plate</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead className="hidden md:table-cell">Vehicle</TableHead>
                    <TableHead className="hidden md:table-cell">Cargo</TableHead>
                    <TableHead className="hidden md:table-cell">Destination</TableHead>
                    <TableHead className="hidden md:table-cell">ETA</TableHead>
                    <TableHead>Status</TableHead>
                    {/* <TableHead className="text-right">Action</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                 {dispatchers.map((dispatcher) =>
                    dispatcher.dispatches.map((dispatch) => (
                      <TableRow key={dispatch.id}>
                        <TableCell className="hidden md:table-cell">{dispatch.LicensePlate}</TableCell>
                        <TableCell>{dispatch.DriverName}</TableCell>
                        <TableCell className="hidden md:table-cell">{dispatch.VehicleName}</TableCell>
                        <TableCell className="hidden md:table-cell">{dispatch.CargoName}</TableCell>
                        <TableCell className="hidden md:table-cell">{dispatch.Destination}</TableCell>
                        <TableCell className="hidden md:table-cell">{dispatch.ArrivalTime}</TableCell>
                        <TableCell>{dispatch.Status}</TableCell>
                        {/* <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell> */}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
