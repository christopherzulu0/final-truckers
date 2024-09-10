"use client"

import React, { useEffect,useState } from 'react'
import {

    File,
    ListFilter,
    MoreHorizontal
  } from "lucide-react"
  import { Badge } from "@/components/ui/badge"
  import { Button } from "@/components/ui/button"
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
  import { Progress } from "@/components/ui/progress"
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import Link from 'next/link'

import { collection, doc, getFirestore, onSnapshot, query, updateDoc, where, serverTimestamp, getDocs } from 'firebase/firestore';
import { useToast } from '@chakra-ui/react'
import { firestore } from '@/firebase/clientApp'


interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
}

export default function DriverApprove({Drivers}) {
    const [drafted, setDrafted] = useState(Drivers);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    {/**Fetching user details */}
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await fetch('/api/user');
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else if (response.status === 401) {
            console.warn('User is not authorized. Session might have expired.');
            // Handle unauthorized case here, e.g., redirect to login
          } else {
            console.error('Failed to fetch user:', response.status);
          }
        } catch (error) {
          console.error('An error occurred while fetching user:', error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchUser();
    }, []); 

    const toast = useToast();
  
    useEffect(() => {
     
      const DriversCollection = collection(firestore, 'Drivers');
  
  
  
      const unsubscribe = onSnapshot(DriversCollection, (snapshot) => {
        const updatedInsightData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          };
        });
        setDrafted(updatedInsightData);
      });
  
      return () => {
        unsubscribe();
      };
    }, []);
  
    const handleApproval = async (id, status) => {
      if (!user) return;  
      setLoading(true);
   
      const docRef = doc(firestore, 'Drivers', id);
  
      try {
        await updateDoc(docRef, {
          Status: status,
          Approved: user?.displayName,
          ApprovedAt: serverTimestamp()
        });
      } catch (error) {
        console.error("Error updating document: ", error);
        toast({
            title: 'Error Approving a request',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top',
          });
      } finally {
        setLoading(false);
        toast({
            title: `Request has been ${status}.`,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top',
          });
          
      }
    };
      

  return (
    <>
    
             {/**Drivers Section */}
             <TabsContent value="drivers">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Drivers Approval List</CardTitle>
                    <CardDescription>
                      Recent drivers approvals added on the list.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Driver Name</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Experience
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Status
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                          CV
                          </TableHead>
                          <TableHead>
                          Approved By
                          </TableHead>
                          <TableHead className="hidden md:table-cell">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                      {drafted?.map((pending) => (
                        <TableRow className="bg-accent" key={pending.id}>
                          <TableCell>
                            <div className="font-medium">{pending?.Name}</div>
                            
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                          {pending?.Experience}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                            {pending?.Status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                          <Link href={`${pending?.Cv}`}>
                          <Badge className="text-xs" variant="secondary">
                          View CV
                          </Badge>
                          </Link>
                          </TableCell>
                          <TableCell >{pending?.Approved}</TableCell>
                          <TableCell >
                          <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                            disabled={loading}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleApproval(pending.id, 'Approved')}
                            disabled={loading}
                          >
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleApproval(pending.id, 'Rejected')}
                            disabled={loading}
                          >
                            Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
             {/**End of drivers section */}
    </>
  )
}

export async function getServerSideProps() {
    const db = getFirestore();
    const trucksCollection = collection(db, 'Writers');
    const trucksSnapshot = await getDocs(trucksCollection);
    const truckData = trucksSnapshot.docs.map((doc) => {
      const data = doc.data();
      const timestamp = data.timestamp.toDate().toISOString();
  
      return {
        id: doc.id,
        ...data,
        timestamp
      };
    });
  
    return {
      props: {
       Drivers: truckData,
      },
    };
  }
  