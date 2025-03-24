import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // Firebase configuration
import { Skeleton } from "@mui/material";

const Workshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const getWorkshops = async () => {
      try {
        const data = await fetchAllWorkshops();
        setWorkshops(data);
      } catch (error) {
        console.error(error);
      }
    };
  
    getWorkshops();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Workshops & Webinars</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
              <Skeleton variant="rectangular" width="100%" height={200} />
              <div className="p-4">
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="100%" height={60} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((workshop) => (
            <div
              key={workshop.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {workshop.thumbnail ? (
                  <img
                    src={workshop.thumbnail}
                    alt={workshop.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">No Thumbnail</span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{workshop.title}</h2>
                <p className="text-gray-600 mb-4">{workshop.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span className="mr-2">📅</span>
                  <span>
                    {workshop.dateFrom} - {workshop.dateTo}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">📍</span>
                  <span>
                    {workshop.mode === "online" ? (
                      <a
                        href={workshop.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Join Online
                      </a>
                    ) : (
                      workshop.location
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkshopsPage;