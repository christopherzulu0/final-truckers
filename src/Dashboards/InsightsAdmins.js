'use client'

import React, { useState, useEffect } from 'react'
import { Timestamp, collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"

import Insights from './Insights'
import { MdDoNotDisturbOnTotalSilence } from "react-icons/md";
import { RiDraftLine } from "react-icons/ri";
import { VscLayersActive } from "react-icons/vsc";
import { firestore } from '../firebase/clientApp';

export default function InsightsAdmin({initialTruckData}) {
  const [insight, setInsight] = useState(initialTruckData);
  const [drafted, setDrafted] = useState(initialTruckData);
  const [active, setActive] = useState(initialTruckData);

  useEffect(() => {
   
    const trucksCollection = collection(firestore, 'Insights');
    const unsubscribe = onSnapshot(trucksCollection, (snapshot) => {
        const updatedInsightkData = snapshot.docs.map((doc) => {
            const data = doc.data();
           

            return {
                id: doc.id,
                ...data,
               
            };
        });
        setInsight(updatedInsightkData);
    });

    return () => {
        unsubscribe();
    };
}, []);

{/**Drafted */ }
useEffect(() => {
    
    const trucksCollection = collection(firestore, 'Insights');

    // Create a query to get only the documents where Status is 'Drafted'
    const q = query(trucksCollection, where('Status', '==', 'Draft'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
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

{/**ACtive */ }
useEffect(() => {
    
    const trucksCollection = collection(firestore, 'Insights');

    // Create a query to get only the documents where Status is 'Published'
    const q = query(trucksCollection, where('Status', '==', 'Published'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedInsightData = snapshot.docs.map((doc) => {
            const data = doc.data();
           

            return {
                id: doc.id,
                ...data,
                
            };
        });
        setActive(updatedInsightData);
    });

    return () => {
        unsubscribe();
    };
}, []);
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">

          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Insights
              </CardTitle>
              <MdDoNotDisturbOnTotalSilence className="h-4 w-4 text-muted-foreground" />  
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insight?.length}</div>
              {/* <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p> */}
            </CardContent>
          </Card>


          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Drafted
              </CardTitle>
              <RiDraftLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{drafted?.length}</div>
              {/* <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p> */}
            </CardContent>
          </Card>
       
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <VscLayersActive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{active?.length}</div>
              {/* <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p> */}
            </CardContent>
          </Card>
        </div>
        <div >
        {/**Insights */}
           <Insights />
        {/**End of Insights */}
        </div>
      </main>
    </div>
  )
}


export async function getServerSideProps() {
  const db = getFirestore();
  const trucksCollection = collection(db, 'Insights');
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
          initialTruckData: truckData,
      },
  };
}
