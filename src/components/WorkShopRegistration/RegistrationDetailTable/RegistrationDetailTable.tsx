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
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RegistrationDetailTable: FC<RegistrationDetailTableProps> = ({
  registrationsData,
}) => {
  const navigate = useNavigate();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Sl. No</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Contact No.</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
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
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigate(`/profile/${participant.id}`);
                }}
              >
                View Profile
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RegistrationDetailTable;
