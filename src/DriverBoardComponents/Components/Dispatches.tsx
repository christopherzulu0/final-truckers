'use client'
import React, { useEffect,useState } from 'react'
import {

    ListFilter,
    MoreHorizontal,
    User
  } from "lucide-react"
  import { Button } from "../../components/ui/button"
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../../components/ui/card"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "../../components/ui/dropdown-menu"
  
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../../components/ui/table"
  import {
    TabsContent,
  } from "../../components/ui/tabs"
import { useToast } from '@chakra-ui/react'
import { getFirestore, collection, addDoc, query, where,doc, onSnapshot,updateDoc, serverTimestamp, getDocs } from 'firebase/firestore';

import { app, auth, firestore } from "../../firebase/clientApp";


interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
}


export default function Dispatches({}) {
  const [dispatchers, setDispatchers] = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const [toastVisible, setToastVisible] = useState(false); // Toast visibility state
  const [toastMessage, setToastMessage] = useState(''); // Toast message state
  const [loading,setLoading] = useState(false)

  {/**Get user details */}
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


  const fetchData = async () => {
    const db = getFirestore(app);

    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    try {
      // Query the Dispatchers collection to get all dispatcher documents
      const dispatchersQuery = query(collection(db, 'Dispatchers'));
      const dispatchersSnapshot = await getDocs(dispatchersQuery);
      const allDispatches = [];
      console.log("Dispatchers fetched:", dispatchersSnapshot.docs.length);

      for (const dispatcherDoc of dispatchersSnapshot.docs) {
        console.log("Fetching dispatches for dispatcher ID:", dispatcherDoc.id);

        // Query the Dispatches subcollection where DriverID equals the current user's UID
        const dispatchesQuery = query(
          collection(db, `Dispatchers/${dispatcherDoc.id}/Dispatches`),
          where('DriverID', '==', user?.id)
        );

        const dispatchesSnapshot = await getDocs(dispatchesQuery);
        const dispatches = dispatchesSnapshot.docs.map(dispatchDoc => ({
          id: dispatchDoc.id,
          dispatcherId: dispatcherDoc.id, // Include dispatcherId here
          ...dispatchDoc.data()
        }));

        console.log(`Dispatches for dispatcher ID ${dispatcherDoc.id}:`, dispatches);

        allDispatches.push(...dispatches);
      }

      setDispatchers(allDispatches);
      console.log("All dispatches:", allDispatches);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const updateDispatchStatus = async (dispatcherId, dispatchId, newStatus) => {
    try {
      const db = getFirestore(app);
      const dispatchRef = doc(db, `Dispatchers/${dispatcherId}/Dispatches/${dispatchId}`);
      await updateDoc(dispatchRef, {
        Status: newStatus,
        updatedAt: serverTimestamp(),
      });
      setToastMessage('Dispatch Updated');
          setToastVisible(true);
      
          // Hide toast after 3 seconds
          setTimeout(() => {
            setToastVisible(false);
          }, 3000);

      // Re-fetch the data to update the state
      fetchData();
    } catch (error) {
      console.error('Error adding document: ', error);
      setToastMessage('Error updating dispatch');
      setToastVisible(true);
    }

  };

  
  const Toast = ({ message, visible, onClose }) => {
    if (!visible) return null;
  
    return (
      <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
        <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center">
          <span className="mr-2">✅</span>
          <p>{message}</p>
          <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
            ✕
          </button>
        </div>
      </div>
    );
  };

  const closeToast = () => {
    setToastVisible(false);
  };

  return (
    <>
    
             {/**Drivers Section */}
             <TabsContent value="dispatches">
             <Toast message={toastMessage} visible={toastVisible} onClose={closeToast} />
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>My Jobs List</CardTitle>
                    <CardDescription>
                      Recent, completed,cancelled and approved  jobs.
                    </CardDescription>
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
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {dispatchers?.map((dispatch) => (
                    <TableRow key={dispatch?.id}>
                      <TableCell className="hidden md:table-cell">{dispatch?.LicensePlate}</TableCell>
                      <TableCell>{dispatch?.DriverName}</TableCell>
                      <TableCell className="hidden md:table-cell">{dispatch?.VehicleName}</TableCell>
                      <TableCell className="hidden md:table-cell">{dispatch?.CargoName}</TableCell>
                      <TableCell className="hidden md:table-cell">{dispatch?.Destination}</TableCell>
                      <TableCell className="hidden md:table-cell">{dispatch?.ArrivalTime}</TableCell>
                      <TableCell>{dispatch?.Status}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateDispatchStatus(dispatch.dispatcherId, dispatch.id, "Approved")}>Approve</DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateDispatchStatus(dispatch.dispatcherId, dispatch.id, "Cancelled")}>Cancel</DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateDispatchStatus(dispatch.dispatcherId, dispatch.id, "Completed")}>Complete</DropdownMenuItem>
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

