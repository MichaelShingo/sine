import { ContractResponse } from '@/app/lib/api/validation/contracts';
import { parseDate } from '@/utils/date';

export interface ContractCardProps {
  contract: ContractResponse;
}

export const useContractCard = (props: ContractCardProps) => {
  const { contract } = props;
  const { id, name, deadline, signerName, signedDate, isSent, updatedAt } =
    contract;

  const isSigned = parseDate(signedDate) != null;

  const title = name?.trim() || 'Untitled contract';

  return {
    id,
    name,
    deadline,
    signerName,
    signedDate,
    isSent,
    updatedAt,
    isSigned,
    title,
  };
};
