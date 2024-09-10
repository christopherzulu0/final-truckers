"use client"

import React, { useEffect, useState } from 'react';
import { MoreHorizontal, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { collection, doc, getFirestore, onSnapshot, query, updateDoc, where, serverTimestamp } from 'firebase/firestore';

import Link from 'next/link';
import { useToast } from '@chakra-ui/react';
import { firestore } from '@/firebase/clientApp';



interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
}

export default function WriterApprove({ Writers }) {
  const [drafted, setDrafted] = useState(Writers);
  const [toastVisible, setToastVisible] = useState(false); // Toast visibility state
  const [toastMessage, setToastMessage] = useState(''); // Toast message state
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const toast = useToast();


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


  useEffect(() => {
    
    const writersCollection = collection(firestore, 'Writers');

    const unsubscribe = onSnapshot(writersCollection, (snapshot) => {
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
  
    const docRef = doc(firestore, 'Writers', id);

    try {
      await updateDoc(docRef, {
        Status: status,
        Approved: user?.displayName,
        ApprovedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating document: ", error);
      setToastMessage('Error Approving a request');
      setToastVisible(true);
  } finally {
    setLoading(false);
    setToastMessage(`Request has been ${status}.`);
      setToastVisible(true);
  
      // Hide toast after 3 seconds
      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
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
      <TabsContent value="writers">
      <Toast message={toastMessage} visible={toastVisible} onClose={closeToast} />
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Writers Approval List</CardTitle>
            <CardDescription>
              Recent writers approvals added on the list.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Writer Name</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Experience
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Status
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Sample
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
                          View Sample
                        </Badge>
                      </Link>
                    </TableCell>
                    <TableCell>{pending?.Approved}</TableCell>
                    <TableCell>
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
    </>
  );
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
      Writers: truckData,
    },
  };
}
