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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Sl. No</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Contact No.</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registrationsData.map((participant, index) => (
          <TableRow key={participant.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>
              {" "}
              {participant.role === "doctor" && "Dr. "}
              {participant.name}
            </TableCell>
            <TableCell>{participant.contactNo}</TableCell>
            <TableCell>
              <Badge variant="outline">
                {" "}
                {participant.role === "doctor" && (
                  <>
                    <PawPrint size={14} className="text-teal-500" />
                    Veterinary Doctor
                  </>
                )}
                {participant.role === "ngo" && (
                  <>
                    <Handshake size={14} className="text-purple-500" />
                    NGO
                  </>
                )}
                {participant.role === "volunteer" && (
                  <>
                    <Heart size={14} className="text-red-500" />
                    Volunteer
                  </>
                )}
                {participant.role === "researchInstitution" && (
                  <>
                    <Building size={14} className="text-green-500" />
                    Research Institution
                  </>
                )}
                {participant.role === "farmer" && (
                  <>
                    <Leaf size={14} className="text-brown-500" />
                    Farmer
                  </>
                )}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RegistrationDetailTable;
