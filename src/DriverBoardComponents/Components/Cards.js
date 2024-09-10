'use client'
import React,{useState,useEffect} from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../components/ui/card"


  import { Separator } from "../../components/ui/separator"
  import { Timestamp, collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';

export default function Cards() {
    const [PendingWriters, setPendingWriters] = useState();
    const [PendingDrivers, setPendingDrivers] = useState();
    const [PendingDispatchers, setPendingDispatchers] = useState();

    const [RejectedWriters, setRejectedWriters] = useState();
    const [RejectedDrivers, setRejectedDrivers] = useState();
    const [RejectedDispatchers, setRejectedDispatchers] = useState();
 
   
{/**Pending Approvals */}
useEffect(() => {
    const db = getFirestore();
    const trucksCollection = collection(db, 'Writers');

     // Create a query to get only the documents where Status is 'Drafted'
     const q = query(trucksCollection, where('Status', '==', 'Pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedInsightkData = snapshot.docs.map((doc) => {
            const data = doc.data();
           

            return {
                id: doc.id,
                ...data,
               
            };
        });
        setPendingWriters(updatedInsightkData);
    });

    return () => {
        unsubscribe();
    };
}, []);

{/**Drafted */ }
useEffect(() => {
    const db = getFirestore();
    const trucksCollection = collection(db, 'Drivers');

    // Create a query to get only the documents where Status is 'Drafted'
    const q = query(trucksCollection, where('Status', '==', 'Pending'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedInsightData = snapshot.docs.map((doc) => {
            const data = doc.data();
           

            return {
                id: doc.id,
                ...data,
               
            };
        });
        setPendingDrivers(updatedInsightData);
    });

    return () => {
        unsubscribe();
    };
}, []);

{/**ACtive */ }
useEffect(() => {
    const db = getFirestore();
    const trucksCollection = collection(db, 'Dispatchers');

    // Create a query to get only the documents where Status is 'Published'
    const q = query(trucksCollection, where('Status', '==', 'Pending'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedInsightData = snapshot.docs.map((doc) => {
            const data = doc.data();
           

            return {
                id: doc.id,
                ...data,
                
            };
        });
        setPendingDispatchers(updatedInsightData);
    });

    return () => {
        unsubscribe();
    };
}, []);

{/**End of Pending Approvals */}


{/**Rejected Aprovals */}
useEffect(() => {
    const db = getFirestore();
    const trucksCollection = collection(db, 'Writers');

     // Create a query to get only the documents where Status is 'Drafted'
     const q = query(trucksCollection, where('Status', '==', 'Rejected'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedInsightkData = snapshot.docs.map((doc) => {
            const data = doc.data();
           

            return {
                id: doc.id,
                ...data,
               
            };
        });
        setRejectedWriters(updatedInsightkData);
    });

    return () => {
        unsubscribe();
    };
}, []);

{/**Drafted */ }
useEffect(() => {
    const db = getFirestore();
    const trucksCollection = collection(db, 'Drivers');

    // Create a query to get only the documents where Status is 'Drafted'
    const q = query(trucksCollection, where('Status', '==', 'Rejected'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedInsightData = snapshot.docs.map((doc) => {
            const data = doc.data();
           

            return {
                id: doc.id,
                ...data,
               
            };
        });
        setRejectedDrivers(updatedInsightData);
    });

    return () => {
        unsubscribe();
    };
}, []);

{/**ACtive */ }
useEffect(() => {
    const db = getFirestore();
    const trucksCollection = collection(db, 'Dispatchers');

    // Create a query to get only the documents where Status is 'Published'
    const q = query(trucksCollection, where('Status', '==', 'Rejected'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedInsightData = snapshot.docs.map((doc) => {
            const data = doc.data();
           

            return {
                id: doc.id,
                ...data,
                
            };
        });
        setRejectedDispatchers(updatedInsightData);
    });

    return () => {
        unsubscribe();
    };
}, []);

{/**End Of Rejected Approvals */}
    
    const sumTotal = PendingWriters?.length + PendingDrivers?.length + PendingDispatchers?.length  || 0;
    const rejectedsumTotal = RejectedWriters?.length + RejectedDrivers?.length + RejectedDispatchers?.length  || 0;
    return (
        <>
            <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                    <CardDescription>Pending Approvals</CardDescription>
                    <CardTitle className="text-4xl">{sumTotal}</CardTitle>
                </CardHeader>
    
                <CardFooter className="flex flex-row border-t p-4">
            <div className="flex w-full items-center gap-2">
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-xs text-muted-foreground">Writers</div>
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                 {PendingWriters?.length  || 0}
                  {/* <span className="text-sm font-normal text-muted-foreground">
                   
                  </span> */}
                </div>
              </div>
              <Separator orientation="vertical" className="mx-2 h-10 w-px" />
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-xs text-muted-foreground">Drivers</div>
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                  {PendingDrivers?.length  || 0}
                  {/* <span className="text-sm font-normal text-muted-foreground">
                   
                  </span> */}
                </div>
              </div>
              <Separator orientation="vertical" className="mx-2 h-10 w-px" />
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-xs text-muted-foreground">
                    Dispatchers
                    </div>
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                  {PendingDispatchers?.length || 0}
                  {/* <span className="text-sm font-normal text-muted-foreground">
                   
                  </span> */}
                </div>
              </div>
            </div>
          </CardFooter>
            </Card>

            <Card x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                    <CardDescription>Rejected Approvals</CardDescription>
                    <CardTitle className="text-4xl">{rejectedsumTotal}</CardTitle>
                </CardHeader>

                <CardFooter className="flex flex-row border-t p-4">
            <div className="flex w-full items-center gap-2">
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-xs text-muted-foreground">Writers</div>
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                {RejectedWriters?.length || 0}
                  {/* <span className="text-sm font-normal text-muted-foreground">
                   
                  </span> */}
                </div>
              </div>
              <Separator orientation="vertical" className="mx-2 h-10 w-px" />
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-xs text-muted-foreground">Drivers</div>
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                {RejectedDrivers?.length || 0}
                  {/* <span className="text-sm font-normal text-muted-foreground">
                   
                  </span> */}
                </div>
              </div>
              <Separator orientation="vertical" className="mx-2 h-10 w-px" />
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-xs text-muted-foreground">Dispatchers</div>
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                {RejectedDispatchers?.length || 0}
                  {/* <span className="text-sm font-normal text-muted-foreground">
                   
                  </span> */}
                </div>
              </div>
            </div>
          </CardFooter>
            </Card>
        </>
    )
}
