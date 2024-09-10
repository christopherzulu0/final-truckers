'use client'

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, query, where, onSnapshot, serverTimestamp, getDocs } from 'firebase/firestore';

import { Button } from '../../components/ui/button';
import { Center } from '@chakra-ui/react';
import { Spinner } from 'flowbite-react';
import { auth, firestore } from "../../firebase/clientApp";
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
}

export default function Page() {
  const [Dispatchers, setDispatchers] = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const [toastVisible, setToastVisible] = useState(false); // Toast visibility state
  const [toastMessage, setToastMessage] = useState(''); // Toast message state
  const [isAuthorized, setIsAuthorized] = useState(false); // State to track authorization
  const [drivers, setDrivers] = useState([]);
  const [DriverName, setDriverName] = useState("");
  const [Email, setEmail] = useState("");
  const [ArrivalTime, setArrivalTime] = useState("");
  const [CargoName, setCargoName] = useState("");
  const [Destination, setDestination] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [AssignedArea, setAssignedArea] = useState("");
  const [LicensePlate,setLicensePlate]=useState("");
  const [loading, setLoading] = useState(false);
  const [VehicleName,setVehicleName] =useState('')
  const [Company,setCompany] =useState('')
  const [Role,setRole] =useState('')
  const [ID,setID] =useState('')
 
  const router = useRouter();

  useEffect(() => {
   
    const db = getFirestore();
    const driversRef = collection(db, 'Drivers');
    const q = query(driversRef, where('Status', '==', 'Approved'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const driversData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDrivers(driversData);
    });

    return () => unsubscribe(); 
  }, []);


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



  const handleDriverChange = (e) => {
    const selectedDriverName = e.target.value;
    setDriverName(selectedDriverName);

    const selectedDriver = drivers.find(driver => driver.Name === selectedDriverName);
    if (selectedDriver) {
      setEmail(selectedDriver.Email || "");
      setPhoneNumber(selectedDriver.Contact || "");
      setAssignedArea(selectedDriver.AssignedArea || "");
      setArrivalTime(selectedDriver.ArrivalTime || "");
      setDestination(selectedDriver.Destination || "");
      setCargoName(selectedDriver.CargoName || "");
      setLicensePlate(selectedDriver.LicensePlate || "");
      setVehicleName(selectedDriver.VehicleName || "");
      setRole(selectedDriver.Role || "");
      setCompany(selectedDriver.Company || "");
      setID(selectedDriver.UID || "");
    } else {
      setEmail("");
      setPhoneNumber("");
      setAssignedArea("");
      setArrivalTime("");
      setDestination("");
      setCargoName("");
      setLicensePlate("");
      setVehicleName("");
      setRole("");
      setCompany("");
      setID("");
    }
  };

  const sendPost = async () => {
    if (loading) return;
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    setLoading(true);

    try {
      const db = getFirestore();
      const dispatchersRef = collection(db, 'Dispatchers');
      const q = query(dispatchersRef, where('UID', '==', user?.id));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.error("No matching dispatcher found");
        setLoading(false);
        return;
      }

      const dispatcherDoc = snapshot.docs[0];
      const dispatcherId = dispatcherDoc.id;

      await addDoc(
        collection(
          firestore,
          'Dispatchers', dispatcherId, 'Dispatches'
        ),
        {
          DriverID:ID,
          DriverName: DriverName,
          Email: Email,
          ArrivalTime: ArrivalTime,
          Destination: Destination,
          CargoName: CargoName,
          PhoneNumber: PhoneNumber,
          AssignedArea: AssignedArea,
          LicensePlate:LicensePlate,
          VehicleName:VehicleName,
          Role:Role,
          Company:Company,
          Status: 'Pending',
          timestamp: serverTimestamp(),
        }
      );

    
      setDriverName("");
      setEmail("");
      setArrivalTime("");
      setDestination("");
      setCargoName("");
      setPhoneNumber("");
      setAssignedArea("");
      router.push('/DispatcherAdmin');
    } catch (error) {
      console.error('Error adding document: ', error);
      setToastMessage('Error Assigning Route');
      setToastVisible(true);
    } finally {
      setLoading(false);
      setToastMessage(`Dispatch Assigned to ${DriverName}.`);
      setToastVisible(true);
  
      // Hide toast after 3 seconds
      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
    }
    }
  };


  
  useEffect(() => {
    if (!user?.id) {
      console.error('User ID is not available');
      return;
    }

    const db = getFirestore();
    const writersCollection = collection(db, 'Dispatchers');
    const q = query(writersCollection,where('UID', '==', user?.id),where('Status','==','Approved'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedInsightData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      });

      setDispatchers(updatedInsightData);

      
      setIsAuthorized(updatedInsightData.length > 0); 
    }, (error) => {
      console.error('Error fetching data:', error);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  if (!user) {
    return<Center height="100vh">
    <button
      disabled
      type="button"
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
    >
      <svg
        aria-hidden="true"
        role="status"
        className="inline w-4 h-4 mr-3 text-white animate-spin"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="#E5E7EB"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentColor"
        />
      </svg>
      Checking Dispatcher Info ...
    </button>
  </Center>; 
  }

  if (!isAuthorized) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="relative p-4 w-full max-w-md h-full md:h-auto mx-auto">
          <div className="relative p-6 text-center bg-white rounded-lg shadow-lg dark:bg-gray-800 sm:p-8">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Not Authorized</h3>
            <p className="mb-6 text-gray-500 dark:text-gray-300">
             You are not Authorized to visit this page. Kindly contact Admin for assistance
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <center>
        <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
        <Toast message={toastMessage} visible={toastVisible} onClose={closeToast} />
          {/* Modal content */}
          <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            {/* Modal header */}
            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Dispatcher
              </h3>
           
            </div>
            {/* Modal body */}
            <form action="#">
              <div className="grid gap-4 mb-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Driver Name</label>
                  <select
                    value={DriverName}
                    onChange={handleDriverChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    <option selected="">Driver Name</option>
                    {drivers?.map((driver) => (
                      <option key={driver.id} value={driver?.Name}>{driver?.Name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Dispatcher's email"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone Number
                  </label>
                  <input
                    value={PhoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Dispatcher's phone number"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="area"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Assigned Area
                  </label>
                  <input
                    type="text"
                    value={AssignedArea}
                    onChange={(e) => setAssignedArea(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Assigned area"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="area"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Arrival Time
                  </label>
                  <input
                    type="text"
                    value={ArrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Arrival time"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="area"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Destination
                  </label>
                  <input
                    type="text"
                    value={Destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Destination"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="area"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                   License Plate
                  </label>
                  <input
                    type="text"
                    value={LicensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="License Plate"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="area"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                  Vehicle Name
                  </label>
                  <input
                    type="text"
                    value={VehicleName}
                    onChange={(e) => setVehicleName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Vehicle Name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="area"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                   Driver Type
                  </label>
                  <input
                    type="text"
                    value={Role}
                    onChange={(e) => setRole(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="License Plate"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="area"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                  Company Name
                  </label>
                  <input
                    type="text"
                    value={Company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="License Plate"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="area"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                 Driver ID
                  </label>
                  <input
                    type="text"
                    value={ID}
                    onChange={(e) => setID(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 readonly"
                  
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="area"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Cargo
                  </label>
                  <input
                    type="text"
                    value={CargoName}
                    onChange={(e) => setCargoName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Cargo Name"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 ">
                <Button variant="outline" size="sm">
                  Discard
                </Button>
                {loading ? (
                  <Center><Spinner color="gray.600" size="md" /></Center>
                ) : (
                  <Button
                    onClick={sendPost}
                    type="submit"
                    size="sm">Add Dispatch</Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </center>
    </>
  );
}
