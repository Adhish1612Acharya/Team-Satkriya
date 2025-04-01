"use client"

import { useState } from "react"
import { Calendar, Clock, Info, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data for workshop details
const workshopData = {
  title: "Advanced Web Development Workshop",
  date: "April 15, 2025",
  startTime: "10:00 AM",
  endTime: "4:00 PM",
  location: "Tech Innovation Center, Room 302",
  description:
    "Join us for an immersive workshop on modern web development techniques. This hands-on session will cover the latest frameworks, best practices, and optimization strategies to help you build better web applications. Suitable for intermediate to advanced developers looking to enhance their skills.",
  totalRegistrations: 24,
  maxCapacity: 30,
}

// Mock data for registrations
const registrationsData = [
  { id: 1, name: "John Doe", contactNo: "+1 (555) 123-4567", role: "Developer" },
  { id: 2, name: "Jane Smith", contactNo: "+1 (555) 987-6543", role: "Designer" },
  { id: 3, name: "Robert Johnson", contactNo: "+1 (555) 234-5678", role: "Project Manager" },
  { id: 4, name: "Emily Davis", contactNo: "+1 (555) 345-6789", role: "Student" },
  { id: 5, name: "Michael Wilson", contactNo: "+1 (555) 456-7890", role: "Developer" },
  { id: 6, name: "Sarah Brown", contactNo: "+1 (555) 567-8901", role: "Designer" },
  { id: 7, name: "David Miller", contactNo: "+1 (555) 678-9012", role: "Developer" },
  { id: 8, name: "Jennifer Taylor", contactNo: "+1 (555) 789-0123", role: "Student" },
  { id: 1, name: "John Doe", contactNo: "+1 (555) 123-4567", role: "Developer" },
  { id: 2, name: "Jane Smith", contactNo: "+1 (555) 987-6543", role: "Designer" },
  { id: 3, name: "Robert Johnson", contactNo: "+1 (555) 234-5678", role: "Project Manager" },
  { id: 4, name: "Emily Davis", contactNo: "+1 (555) 345-6789", role: "Student" },
  { id: 5, name: "Michael Wilson", contactNo: "+1 (555) 456-7890", role: "Developer" },
  { id: 6, name: "Sarah Brown", contactNo: "+1 (555) 567-8901", role: "Designer" },
  { id: 7, name: "David Miller", contactNo: "+1 (555) 678-9012", role: "Developer" },
  { id: 8, name: "Jennifer Taylor", contactNo: "+1 (555) 789-0123", role: "Student" },
]

// // Profile component for the sheet
// const Profile = ({ participant }) => (
//   <div className="space-y-4">
//     <div className="flex items-center gap-4">
//       <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
//         <Users className="h-8 w-8 text-primary" />
//       </div>
//       <div>
//         <h3 className="text-xl font-semibold">{participant.name}</h3>
//         <p className="text-muted-foreground">{participant.role}</p>
//       </div>
//     </div>

//     <div className="grid gap-2">
//       <div className="flex items-center gap-2">
//         <Badge variant="outline" className="w-20">
//           Contact
//         </Badge>
//         <span>{participant.contactNo}</span>
//       </div>
//       <div className="flex items-center gap-2">
//         <Badge variant="outline" className="w-20">
//           Role
//         </Badge>
//         <span>{participant.role}</span>
//       </div>
//       <div className="flex items-center gap-2">
//         <Badge variant="outline" className="w-20">
//           ID
//         </Badge>
//         <span>WS-2025-{participant.id.toString().padStart(4, "0")}</span>
//       </div>
//     </div>

//     <div className="pt-4 border-t">
//       <h4 className="font-medium mb-2">Workshop Attendance History</h4>
//       <ul className="space-y-2">
//         <li className="text-sm">
//           <span className="text-muted-foreground">Jan 2025:</span> Introduction to React
//         </li>
//         <li className="text-sm">
//           <span className="text-muted-foreground">Nov 2024:</span> UI/UX Design Principles
//         </li>
//       </ul>
//     </div>
//   </div>
// )

export default function WorkshopRegistrationPage() {
  const [selectedParticipant, setSelectedParticipant] = useState(null)

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Workshop Details Card */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl md:text-3xl">{workshopData.title}</CardTitle>
              <CardDescription className="mt-2">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{workshopData.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {workshopData.startTime} - {workshopData.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{workshopData.location}</span>
                  </div>
                </div>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                <Users className="h-4 w-4 inline mr-1" />
                <span>
                  {workshopData.totalRegistrations}/{workshopData.maxCapacity}
                </span>
              </div>
              <Badge variant={workshopData.totalRegistrations < workshopData.maxCapacity ? "success" : "destructive"}>
                {workshopData.totalRegistrations < workshopData.maxCapacity ? "Open" : "Full"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-[3fr_1fr] gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{workshopData.description}</p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-medium">Quick Info</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span>Materials provided</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span>Certificate included</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span>Lunch break: 12:30 PM</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Registrations</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Total: {registrationsData.length}</span>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Sl. No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Contact No.</TableHead>
                <TableHead className="hidden sm:table-cell">Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrationsData.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">{participant.id}</TableCell>
                  <TableCell>{participant.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{participant.contactNo}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline">{participant.role}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {/* <Sheet>
                      <SheetTrigger asChild> */}
                        <Button variant="outline" size="sm" >
                          View Profile
                        </Button>
                      {/* </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Participant Profile</SheetTitle>
                          <SheetDescription>View detailed information about this participant.</SheetDescription>
                        </SheetHeader>
                        {selectedParticipant && <Profile participant={selectedParticipant} />}
                      </SheetContent>
                    </Sheet> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

