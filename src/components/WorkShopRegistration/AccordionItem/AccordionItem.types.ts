export interface Registrant {
  id: string;
  contactNo: number;
  name: string;
  role: string;
}

interface AccordionItemProps {
  registrantDetail: Registrant | null; 
}

export default AccordionItemProps;
