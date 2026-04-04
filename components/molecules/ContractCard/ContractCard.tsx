'use client';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { formatDateOnly, formatDateTime } from '@/utils/date';
import { FC } from 'react';
import { ContractCardProps, useContractCard } from './useContractCard';
import Link from 'next/link';
import { urls } from '@/utils/urls';
import CardActionArea from '@mui/material/CardActionArea';

export const ContractCard: FC<ContractCardProps> = (props) => {
  const { deadline, signerName, isSent, updatedAt, isSigned, title, id } =
    useContractCard(props);

  return (
    <Link
      href={urls.contracts.detail(id)}
      className="hover:-translate-y-[5px] translate-y-0 transition-all duration-300 w-[min(100%,300px)] shrink-0 rounded-3xl opacity-100 hover:opacity-80 scale-100 hover:scale-101 animate-card-in hover:cursor-pointer"
    >
      <CardActionArea>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div>
                <Typography
                  variant="h6"
                  component="h2"
                  className="font-semibold"
                >
                  {title}
                </Typography>
              </div>

              <div className="flex flex-row items-center gap-2">
                <Typography variant="body2" color="text.secondary">
                  Signer
                </Typography>
                <Typography variant="body2" component="span">
                  {signerName?.trim() || '—'}
                </Typography>
              </div>

              <div className="flex flex-row flex-wrap items-center gap-x-2 gap-y-1">
                <Typography variant="body2" color="text.secondary">
                  Last edited
                </Typography>
                <Typography variant="body2" component="span">
                  {formatDateTime(updatedAt)}
                </Typography>
              </div>

              <div className="flex flex-row items-center gap-2">
                <Typography variant="body2" color="text.secondary">
                  Deadline
                </Typography>
                <Typography variant="body2" component="span">
                  {formatDateOnly(deadline)}
                </Typography>
              </div>

              <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex flex-row items-center gap-1.5">
                  <span
                    className={`inline-flex items-center ${
                      isSigned ? 'text-success' : 'text-base'
                    }`}
                    aria-label={isSigned ? 'Signed' : 'Not signed'}
                  >
                    {isSigned ? (
                      <CheckCircleIcon color="success" fontSize="small" />
                    ) : (
                      <CircleIcon color="warning" fontSize="small" />
                    )}
                  </span>
                  <Typography variant="body2" color="text.secondary">
                    {isSigned ? 'Signed' : 'Not signed'}
                  </Typography>
                </div>

                <div className="flex flex-row items-center gap-1.5">
                  <Tooltip title={isSent ? 'Sent' : 'Not sent'} placement="top">
                    <span
                      className={`inline-flex items-center ${
                        isSent ? 'text-secondary' : 'text-info'
                      }`}
                      aria-label={isSent ? 'Sent' : 'Not sent'}
                    >
                      {isSent ? (
                        <SendIcon color="success" fontSize="small" />
                      ) : (
                        <DraftsIcon fontSize="small" />
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
      </CardActionArea>
    </Link>
  );
};
