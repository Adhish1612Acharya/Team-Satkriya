import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FC } from "react";
import RegistrationDetailTableProps from "./RegistrationDetailTable.types";
import { Badge } from "@/components/ui/badge";
import { Handshake, Heart, Building, Leaf, PawPrint } from "lucide-react";

const RegistrationDetailTable: FC<RegistrationDetailTableProps> = ({
  registrationsData,
}) => {
  return (
    // <Table>
    //   <TableHeader className="sticky top-0 bg-background z-10">
    //     <TableRow>
    //       <TableHead>
    //         Sl. No
    //       </TableHead>
    //       <TableHead>Name</TableHead>
    //       <TableHead>Contact No.</TableHead>
    //       <TableHead>Role</TableHead>
    //     </TableRow>
    //   </TableHeader>
    //   <TableBody>
    //     {registrationsData.map((participant, index) => (
    //       <TableRow key={participant.id}>
    //         <TableCell className="font-medium">{index + 1}</TableCell>
    //         <TableCell>
    //           {" "}
    //           {participant.role === "doctor" && "Dr. "}
    //           {participant.name}
    //         </TableCell>
    //         <TableCell>{participant.contactNo}</TableCell>
    //         <TableCell>
    //           <Badge variant="outline">
    //             {" "}
    //             {participant.role === "doctor" && (
    //               <>
    //                 <PawPrint size={14} className="text-teal-500" />
    //                 Veterinary Doctor
    //               </>
    //             )}
    //             {participant.role === "ngo" && (
    //               <>
    //                 <Handshake size={14} className="text-purple-500" />
    //                 NGO
    //               </>
    //             )}
    //             {participant.role === "volunteer" && (
    //               <>
    //                 <Heart size={14} className="text-red-500" />
    //                 Volunteer
    //               </>
    //             )}
    //             {participant.role === "researchInstitution" && (
    //               <>
    //                 <Building size={14} className="text-green-500" />
    //                 Research Institution
    //               </>
    //             )}
    //             {participant.role === "farmer" && (
    //               <>
    //                 <Leaf size={14} className="text-brown-500" />
    //                 Farmer
    //               </>
    //             )}
    //           </Badge>
    //         </TableCell>
    //       </TableRow>
    //     ))}
    //   </TableBody>
    // </Table>

    <div className="relative overflow-hidden rounded-lg border">
     

      {/* Scrollable Body Section */}
      <div className="overflow-auto max-h-[500px]">
        {" "}
        {/* Adjust height as needed */}
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead>Sl. No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact No.</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto max-h-[500px]">
            {registrationsData.map((participant, index) => (
              <TableRow key={participant.id}>
                <TableCell className="font-medium sticky left-0 bg-background z-10">
                  {index + 1}
                </TableCell>
                <TableCell>
                  {participant.role === "doctor" && "Dr. "}
                  {participant.name}
                </TableCell>
                <TableCell>{participant.contactNo}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {participant.role === "doctor" && (
                      <>
                        <PawPrint size={14} className="text-teal-500" />
                        <span>Veterinary Doctor</span>
                      </>
                    )}
                    {participant.role === "ngo" && (
                      <>
                        <Handshake size={14} className="text-purple-500" />
                        <span>NGO</span>
                      </>
                    )}
                    {participant.role === "volunteer" && (
                      <>
                        <Heart size={14} className="text-red-500" />
                        <span>Volunteer</span>
                      </>
                    )}
                    {participant.role === "researchInstitution" && (
                      <>
                        <Building size={14} className="text-green-500" />
                        <span>Research Institution</span>
                      </>
                    )}
                    {participant.role === "farmer" && (
                      <>
                        <Leaf size={14} className="text-amber-700" />
                        <span>Farmer</span>
                      </>
                    )}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RegistrationDetailTable;
