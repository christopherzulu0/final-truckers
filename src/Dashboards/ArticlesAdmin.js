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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
// import { Button } from "@/components/ui/button"
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
// import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  Checkbox,
} from "@chakra-ui/react";

import { IoIosClose } from "react-icons/io";
import { app, auth, firestore, storage } from "../firebase/clientApp";

import { Timestamp, collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from "firebase/storage";

import Articles from './Articles'


export function ArticlesAdmin({initialTruckData}) {
  const [article, setArticle] = useState(initialTruckData);
    const [featured, setFeatured] = useState(initialTruckData);
    const [NotFeatured, setNotFeatured] = useState(initialTruckData);
  const router = useRouter();

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
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Articles</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Recent Articles</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
       
       
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card
                className="sm:col-span-2" x-chunk="dashboard-05-chunk-0"
              >
                <CardHeader className="pb-3">
                  <CardTitle>Your Articles</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Introducing Our Dynamic Articles Dashboard for Seamless
                    Management and  Analysis.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
          
               <Button
               onClick={()=>router.push("/AddArticle")}
               >
                Create New Article
               </Button>
              
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardDescription>Total Articles</CardDescription>
                  <CardTitle className="text-4xl">{article?.length}</CardTitle>
                </CardHeader>
                {/* <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +25% from last week
                  </div>
                </CardContent> */}
                <CardFooter>
                  <Progress value={article?.length} aria-label="25% increase" />
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                  <CardDescription>Drafts</CardDescription>
                  <CardTitle className="text-4xl">{NotFeatured?.length}</CardTitle>
                </CardHeader>
                {/* <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +10% from last month
                  </div>
                </CardContent> */}
                <CardFooter>
                  <Progress value={article?.length} aria-label="12% increase" color="red" />
                </CardFooter>
              </Card>
            </div>
           <Articles/>
          </div>
          <div>
           
          </div>
        </main>
      </div>
    </div>
  )
}

export default ArticlesAdmin;