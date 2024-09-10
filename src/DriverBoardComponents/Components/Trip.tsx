'use client'
import React,{useState,useEffect} from 'react'
import {
    MoreHorizontal,
    ArrowUpRight,
    User
  } from "lucide-react"
  import { Badge } from "../../components/ui/badge"
  import { Button } from "../../components/ui/button"
  import Link from 'next/link'
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
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "../../components/ui/dropdown-menu"
  import { collection, doc, deleteDoc, getFirestore, onSnapshot, query, updateDoc, where, serverTimestamp } from 'firebase/firestore';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    TabsContent,
  } from "@/components/ui/tabs"
import { useToast } from '@chakra-ui/react'


interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
}


export default function Trip({DriverTrip}) {
  const [Trips, setTrips]= useState(DriverTrip);
  const [loading,setLoading]= useState(false);
  const [toastVisible, setToastVisible] = useState(false); // Toast visibility state
  const [toastMessage, setToastMessage] = useState(''); // Toast message state
  const [user, setUser] = useState<User | null>(null);
  const toast = useToast();

  {/**Fetch user details */}
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
  

  useEffect(() => {
    if (!user?.id) return; // Wait until the user is authenticated and we have an id

    const db = getFirestore();
    const trucksCollection = collection(db, 'DriverTrips');

    // Create a query to get only the documents where UID matches the user's UID
    const q = query(trucksCollection, where('UID', '==', user?.id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedInsightData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      });
      setTrips(updatedInsightData);
    });

    return () => {
      unsubscribe();
    };
  }, [user?.id]); 

    {/**Delete the document */}
    const handleDelete = async (id) => {
      try {
          const db = getFirestore();
          await deleteDoc(doc(db, 'DriverTrips', id));
          
          setToastMessage('Trip deleted successfully');
          setToastVisible(true);
      
          // Hide toast after 3 seconds
          setTimeout(() => {
            setToastVisible(false);
          }, 3000);

      } catch (error) {
        console.error('Error adding document: ', error);
        setToastMessage('Error deleting trip');
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
    
             {/**Dispatchers Section */}
             <TabsContent value="trips">
             <Toast message={toastMessage} visible={toastVisible} onClose={closeToast} />
                <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>My Trips</CardTitle>
            <CardDescription>
            My recent trips.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/AddTrip">
             New Trip
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
                 
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cargo</TableHead>
                          <TableHead className="hidden sm:table-cell">
                           Date
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">
                           Distance
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                         Duration
                          </TableHead>
                          <TableHead >
                         Trip 
                          </TableHead>
                          <TableHead className="hidden md:table-cell">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Trips?.map((pending)=>(
                        <TableRow className="bg-accent" key={pending.id}>
                          <TableCell>
                            <div className="font-medium">{pending?.Cargo}</div>
                            
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                          {pending?.Date}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                            {pending?.Distance}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                           {pending?.Duration}
                          </TableCell>
                          <TableCell >{pending?.TripName}</TableCell>
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
                          <button
                          onClick={() => handleDelete(pending.id)}
                          >
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                          </button>
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
             {/**End of dispatchers Section */}
    </>
  )
}


export async function getServerSideProps() {
  const db = getFirestore();
  const trucksCollection = collection(db, 'DriverTrips');
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
          DriverTrip: truckData,
      },
  };
}