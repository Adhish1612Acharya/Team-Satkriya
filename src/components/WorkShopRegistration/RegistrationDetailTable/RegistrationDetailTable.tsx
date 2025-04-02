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
            <TableCell>{participant.name}</TableCell>
            <TableCell>{participant.contactNo}</TableCell>
            <TableCell>
              <Badge variant="outline">{participant.role}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RegistrationDetailTable;
