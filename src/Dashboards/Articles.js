import React,{ useState, useEffect } from "react";
import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
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

import { useRouter } from "next/navigation"

import {
  Button,
  useToast,

} from "@chakra-ui/react";

import { IoIosClose } from "react-icons/io";
import { app, auth, firestore, storage } from "../firebase/clientApp";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { Timestamp, collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';

export default function Articles({ initialTruckData}) {
    const [article, setArticle] = useState(initialTruckData);
    const [featured, setFeatured] = useState(initialTruckData);
    const [NotFeatured, setNotFeatured] = useState(initialTruckData);
   const toast = useToast();
    const router = useRouter()

    useEffect(() => {
        const db = getFirestore();
        const trucksCollection = collection(db, 'Articles');
        const unsubscribe = onSnapshot(trucksCollection, (snapshot) => {
            const updatedInsightData = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp?.toDate().toISOString() // Ensure timestamp is converted
                };
            });
            setArticle(updatedInsightData);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const db = getFirestore();
        const trucksCollection = collection(db, 'Articles');
        const q = query(trucksCollection, where('Featured', '==', true));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const updatedInsightData = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp?.toDate().toISOString()
                };
            });
            setFeatured(updatedInsightData);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const db = getFirestore();
        const trucksCollection = collection(db, 'Articles');
        const q = query(trucksCollection, where('Featured', '==', false));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const updatedInsightData = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp?.toDate().toISOString()
                };
            });
            setNotFeatured(updatedInsightData);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        try {
            const db = getFirestore();
            await deleteDoc(doc(db, 'Articles', id));
            toast({
                title: 'Article deleted successfully👍',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top',
            });
        } catch (error) {
            toast({
                title: 'Error deleting document',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top',
            });
        }
    };






    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString(); // You can customize this format
    };

  return (
   <>
    <Tabs defaultValue="all">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="all">ALL</TabsTrigger>
                  <TabsTrigger value="drafts">FEATURED</TabsTrigger>
                  <TabsTrigger value="active">NOT FEATURED</TabsTrigger>
                </TabsList>
               
              </div>
              {/**All articles */}
              <TabsContent value="all">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Articles</CardTitle>
                    <CardDescription>
                      Recent articles from your store.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                        <TableHead >Image</TableHead>
                          <TableHead >Title</TableHead>
                          <TableHead className="hidden sm:table-cell">
                           Category
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Status
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Date
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                           Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                      {article?.map((articles) => (
                        <TableRow className="bg-accent" key={articles.id}>
                        <TableCell >
                                                        <Image
                                                            alt="Product image"
                                                            className="aspect-square rounded-md object-cover"
                                                            height="64"
                                                            src={articles?.image0?.downloadURL}
                                                            width="64"
                                                        />
                                                    </TableCell>
                          <TableCell>
                            <div className="font-medium">{articles?.Title}</div>
                            
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                          {articles?.Category}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                              {articles?.Tags}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                          {formatDate(articles.timestamp)}
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
                              <DropdownMenuItem  onClick={() => router.push(`/EditArticles/${articles.id}`)}>Edit</DropdownMenuItem>
                              <button
                              onClick={() => handleDelete(articles.id)}
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
              {/**End of All Articles */}

              {/**Drafts artciles */}
              <TabsContent value="drafts">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Articles</CardTitle>
                    <CardDescription>
                      Recent articles from your store.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                        <TableHead>Image</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead className="hidden sm:table-cell">
                           Category
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Status
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Date
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                           Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                      {featured?.map((drafts) => (
                        <TableRow className="bg-accent" key={drafts.id}>
                        <TableCell >
                                                        <Image
                                                            alt="Product image"
                                                            className="aspect-square rounded-md object-cover"
                                                            height="64"
                                                            src={drafts?.image0?.downloadURL}
                                                            width="64"
                                                        />
                                                    </TableCell>
                          <TableCell>
                            <div className="font-medium">{drafts?.Title}</div>
                            
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                          {drafts?.Category}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                              {drafts?.Tags}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                          {formatDate(drafts.timestamp)}
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
                             
                              <DropdownMenuItem  onClick={() => router.push(`/EditArticles/${drafts.id}`)}>Edit</DropdownMenuItem>
                              <button
                              onClick={() => handleDelete(drafts.id)}
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
              {/**End of drafts articles */}

              {/**Active articles */}
              <TabsContent value="active">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Articles</CardTitle>
                    <CardDescription>
                      Recent articles from your store.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                        <TableHead>Image</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead className="hidden sm:table-cell">
                           Category
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Status
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Date
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                           Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                      {NotFeatured?.map((active) => (
                        <TableRow className="bg-accent" key={active.id}>
                        <TableCell >
                                                        <Image
                                                            alt="Product image"
                                                            className="aspect-square rounded-md object-cover"
                                                            height="64"
                                                            src={active?.image0?.downloadURL}
                                                            width="64"
                                                        />
                                                    </TableCell>
                          <TableCell>
                            <div className="font-medium">{active?.Title}</div>
                            
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                          {active?.Category}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                              {active?.Tags}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                          {formatDate(active.timestamp)}
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
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem  onClick={() => router.push(`/EditArticles/${active.id}`)}>Edit</DropdownMenuItem>
                              <button
                              onClick={() => handleDelete(active.id)}
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
              {/**ENd of Active articles */}
            </Tabs>
   </>
  )
}

export async function getServerSideProps() {
    const db = getFirestore();
    const trucksCollection = collection(db, 'Articles');
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
