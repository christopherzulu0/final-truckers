'use client'
import React, { useState, useEffect } from 'react'
import { Timestamp, collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import Image from "next/image"
import Link from "next/link"
import {
    File,
    Home,
    LineChart,
    ListFilter,
    MoreHorizontal,
    Package,
    Package2,
    PanelLeft,
    PlusCircle,
    Search,
    Settings,
    ShoppingCart,
    Users2,
} from "lucide-react"

import { Badge } from "../components/ui/badge"

import { Button } from "../components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../components/ui/tabs"

import { useRouter } from "next/navigation"
import { useToast } from '@chakra-ui/react';
import { firestore } from '../firebase/clientApp';


export default function Insights({ initialTruckData }) {
    const [insight, setInsight] = useState(initialTruckData);
    const [drafted, setDrafted] = useState(initialTruckData);
    const [active, setActive] = useState(initialTruckData);
   const toast = useToast();
    const router = useRouter()

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

    {/**Delete the document */}
    const handleDelete = async (id) => {
        try {
            const db = getFirestore();
            await deleteDoc(doc(firestore, 'Insights', id));
            console.log(`Document with ID ${id} deleted successfully`);
            toast({
                title: 'Insight deleted successfully👍',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top',
              });
        } catch (error) {
            console.error("Error deleting document: ", error);
            toast({
                title: 'Error deleting document',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top',
              });
        }
    };
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 ">

            <div className="flex flex-col sm:gap-4 sm:py-4 " style={{ marginLeft: "-0.7rem" }}>

                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:-py-0  md:gap-8 ">
                    <Tabs defaultValue="all">
                        <div className="flex items-center">
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="active">Active</TabsTrigger>
                                <TabsTrigger value="draft">Draft</TabsTrigger>

                            </TabsList>
                            <div className="ml-auto flex items-center gap-2">
                            
                                <Button size="sm" variant="outline" className="h-8 gap-1">
                                    <File className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Export
                                    </span>
                                </Button>
                                <Link href='/InsightUploads'>
                                    <Button size="sm" className="h-8 gap-1">
                                        <PlusCircle className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                            Add Insight
                                        </span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <TabsContent value="all">
                            <Card x-chunk="dashboard-06-chunk-0">
                                <CardHeader>
                                    <CardTitle>Insights</CardTitle>
                                    <CardDescription>
                                        Manage your Insights here.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="hidden w-[100px] sm:table-cell">
                                                    <span className="sr-only">Image</span>
                                                </TableHead>
                                                <TableHead>Title</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Author
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Total Views
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Incident Location
                                                </TableHead>
                                                <TableHead>
                                                    <span className="sr-only">Actions</span>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {insight?.map((talks) => (
                                                <TableRow key={talks.id}>
                                                    <TableCell >
                                                        <Image
                                                            alt="Product image"
                                                            className="aspect-square rounded-md object-cover"
                                                            height="64"
                                                            src={talks?.image0?.downloadURL}
                                                            width="64"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {talks?.Title}
                                                    </TableCell>
                                                    <TableCell className="hidden sm:table-cell">
                                                        <Badge variant="outline">{talks?.Status}</Badge>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        {talks?.Author}
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        {talks?.views}
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        {talks?.Location}
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    aria-haspopup="true"
                                                                    size="icon"
                                                                    variant="ghost"
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                    <span className="sr-only">Toggle menu</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                
                                                                <DropdownMenuItem  onClick={() => router.push(`/EditInsight/${talks.id}`)}>Edit</DropdownMenuItem>
                                                                <button
                                                                onClick={() => handleDelete(talks.id)}
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

                        {/**Drafted Table */}
                        <TabsContent value="draft">
                            <Card x-chunk="dashboard-06-chunk-0">
                                <CardHeader>
                                    <CardTitle>Insights</CardTitle>
                                    <CardDescription>
                                        Manage your Insights here.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="hidden w-[100px] sm:table-cell">
                                                    <span className="sr-only">Image</span>
                                                </TableHead>
                                                <TableHead>Title</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Author
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Total Views
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Incident Location
                                                </TableHead>
                                                <TableHead>
                                                    <span className="sr-only">Actions</span>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {drafted?.map((talks) => (
                                                <TableRow key={talks.id}>
                                                    <TableCell >
                                                        <Image
                                                            alt="Product image"
                                                            className="aspect-square rounded-md object-cover"
                                                            height="64"
                                                            src={talks?.image0?.downloadURL}
                                                            width="64"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {talks?.Title}
                                                    </TableCell>
                                                    <TableCell className="hidden sm:table-cell">
                                                        <Badge variant="outline">{talks?.Status}</Badge>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        {talks?.Author}
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        {talks?.views}
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        {talks?.Location}
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    aria-haspopup="true"
                                                                    size="icon"
                                                                    variant="ghost"
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                    <span className="sr-only">Toggle menu</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                                <DropdownMenuItem>Delete</DropdownMenuItem>
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



                        {/**Active */}
                        <TabsContent value="active">
                            <Card x-chunk="dashboard-06-chunk-0">
                                <CardHeader>
                                    <CardTitle>Insights</CardTitle>
                                    <CardDescription>
                                        Manage your Insights here.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="hidden w-[100px] sm:table-cell">
                                                    <span className="sr-only">Image</span>
                                                </TableHead>
                                                <TableHead>Title</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Author
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Total Views
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Incident Location
                                                </TableHead>
                                                <TableHead>
                                                    <span className="sr-only">Actions</span>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {active?.map((talks) => (
                                                <TableRow key={talks.id}>
                                                    <TableCell >
                                                        <Image
                                                            alt="Product image"
                                                            className="aspect-square rounded-md object-cover"
                                                            height="64"
                                                            src={talks?.image0?.downloadURL}
                                                            width="64"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {talks?.Title}
                                                    </TableCell>
                                                    <TableCell className="hidden sm:table-cell">
                                                        <Badge variant="outline">{talks?.Status}</Badge>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        {talks?.Author}
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        {talks?.views}
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        {talks?.Location}
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    aria-haspopup="true"
                                                                    size="icon"
                                                                    variant="ghost"
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                    <span className="sr-only">Toggle menu</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                                <DropdownMenuItem>Delete</DropdownMenuItem>
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
                    </Tabs>
                </main>
            </div>
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

