'use client';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { ContractResponse } from '@/app/lib/api/validation/contracts';
import { formatDateOnly, formatDateTime, parseDate } from '@/utils/date';
import { FC } from 'react';

export interface ContractCardProps {
  contract: ContractResponse;
}

export const ContractCard: FC<ContractCardProps> = ({ contract }) => {
  const { name, deadline, signerName, signedDate, isSent, updatedAt } =
    contract;

  const isSigned = parseDate(signedDate) != null;

  const title = name?.trim() || 'Untitled contract';

  return (
    <Card
      variant="outlined"
      className="w-[min(100%,300px)] shrink-0 rounded-lg"
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div>
            <Typography variant="h6" component="h2" className="font-semibold">
              {title}
            </Typography>
          </div>

          <div className="flex flex-row flex-wrap items-center gap-x-2 gap-y-1">
            <EditCalendarOutlinedIcon
              fontSize="small"
              color="action"
              aria-hidden
            />
            <Typography variant="body2" color="text.secondary">
              Last edited
            </Typography>
            <Typography variant="body2" component="span">
              {formatDateTime(updatedAt)}
            </Typography>
          </div>

          <div className="flex flex-row items-center gap-2">
            <EventOutlinedIcon fontSize="small" color="action" aria-hidden />
            <Typography variant="body2" color="text.secondary">
              Deadline
            </Typography>
            <Typography variant="body2" component="span">
              {formatDateOnly(deadline)}
            </Typography>
          </div>

          <div className="flex flex-row items-center gap-2">
            <PersonOutlineIcon fontSize="small" color="action" aria-hidden />
            <Typography variant="body2" color="text.secondary">
              Signer
            </Typography>
            <Typography variant="body2" component="span">
              {signerName?.trim() || '—'}
            </Typography>
          </div>

          <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex flex-row items-center gap-1.5">
              <Tooltip
                title={isSigned ? 'Signed' : 'Not signed'}
                placement="top"
              >
                <span
                  className={`inline-flex items-center ${
                    isSigned ? 'text-green-600' : 'text-neutral-400'
                  }`}
                  aria-label={isSigned ? 'Signed' : 'Not signed'}
                >
                  {isSigned ? (
                    <CheckCircleOutlineIcon fontSize="small" />
                  ) : (
                    <RadioButtonUncheckedIcon fontSize="small" />
                  )}
                </span>
              </Tooltip>
              <Typography variant="body2" color="text.secondary">
                {isSigned ? 'Signed' : 'Not signed'}
              </Typography>
            </div>

            <div className="flex flex-row items-center gap-1.5">
              <Tooltip title={isSent ? 'Sent' : 'Not sent'} placement="top">
                <span
                  className={`inline-flex items-center ${
                    isSent ? 'text-blue-600' : 'text-neutral-400'
                  }`}
                  aria-label={isSent ? 'Sent' : 'Not sent'}
                >
                  {isSent ? (
                    <SendOutlinedIcon fontSize="small" />
                  ) : (
                    <DraftsOutlinedIcon fontSize="small" />
                  )}
                </span>
              </Tooltip>
              <Typography variant="body2" color="text.secondary">
                {isSent ? 'Sent' : 'Draft'}
              </Typography>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
