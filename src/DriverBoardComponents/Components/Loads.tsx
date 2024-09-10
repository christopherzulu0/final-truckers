'use client'
import React, { useEffect, useState } from 'react';
import { ArrowUpRight, MoreHorizontal, User } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
    TabsContent
  } from "../../components/ui/tabs"
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../../components/ui/table"

import { collection, doc, getFirestore, onSnapshot, query, updateDoc, where, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';
import { useToast } from '@chakra-ui/react';


interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
}

export default function Loads({ Writers }) {
  const [drafted, setDrafted] = useState(Writers);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const toast = useToast();

  {/**Get user Details */}
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
    if (!user?.id) {
      console.error('User ID is not available');
      return;
    }

    const db = getFirestore();
    const writersCollection = collection(db, 'TruckLoad');
    const q = query(writersCollection, where('UID', '==', user?.id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedInsightData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      });
      setDrafted(updatedInsightData);
    }, (error) => {
      console.error('Error fetching data:', error);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

 

  return (
    <>
      <TabsContent value="loads">
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>My Truck Loads</CardTitle>
            <CardDescription>
            List of truck loads l have transported.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/LoadUpload">
             New Load
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Load</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Chains
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Straps
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                   Weight
                  </TableHead>
                
                </TableRow>
              </TableHeader>
              <TableBody>
                {drafted?.map((pending) => (
                  <TableRow className="bg-accent" key={pending.id}>
                    <TableCell>
                      <div className="font-medium">{pending?.Load}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {pending?.Chains}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                    
                        {pending?.Straps}
                     
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {pending?.Weight}
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

