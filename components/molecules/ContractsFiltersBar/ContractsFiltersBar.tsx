'use client';

import type { GetContractInput } from '@/app/lib/api/validation/contracts';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import type { TemplatesResponse } from '@/app/lib/api/validation/templates';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { FC } from 'react';
import Paper from '@mui/material/Paper';

export type SentFilter = 'any' | 'sent' | 'notSent';
export type DeadlineMode = 'none' | 'before' | 'after';

export interface ContractsFiltersState {
  searchTerm: string;
  sortBy: GetContractInput['sortBy'];
  sortDir: GetContractInput['sortDir'];
  sentFilter: SentFilter;
  deadlineMode: DeadlineMode;
  /** `yyyy-mm-dd` from date input */
  deadlineDate: string;
  templateId: number | '';
}

const SORT_OPTIONS: { value: GetContractInput['sortBy']; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'signerName', label: 'Signer name' },
  { value: 'signerEmail', label: 'Signer email' },
  { value: 'createdAt', label: 'Created' },
  { value: 'signedDate', label: 'Signed date' },
  { value: 'isSent', label: 'Sent status' },
  { value: 'updatedAt', label: 'Last updated' },
];

export interface ContractsFiltersBarProps {
  filters: ContractsFiltersState;
  onChange: (patch: Partial<ContractsFiltersState>) => void;
  templates: TemplatesResponse;
}

export const ContractsFiltersBar: FC<ContractsFiltersBarProps> = ({
  filters,
  onChange,
  templates,
}) => {
  const deadlineNeedsDate = filters.deadlineMode !== 'none';

  return (
    <Paper className="sticky top-0 z-20 px-5 py-5">
      <div className="flex flex-wrap items-end gap-3">
        <TextField
          size="small"
          label="Search"
          placeholder="Name, signer, email…"
          value={filters.searchTerm}
          onChange={(e) => onChange({ searchTerm: e.target.value })}
          className="min-w-[min(100%,18rem)] flex-[1_1_14rem]"
        />

        <FormControl size="small" className="min-w-42">
          <InputLabel id="contracts-sort-by">Sort by</InputLabel>
          <Select
            labelId="contracts-sort-by"
            label="Sort by"
            value={filters.sortBy}
            onChange={(e) =>
              onChange({
                sortBy: e.target.value as GetContractInput['sortBy'],
              })
            }
          >
            {SORT_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" className="min-w-34">
          <InputLabel id="contracts-sort-dir">Direction</InputLabel>
          <Select
            labelId="contracts-sort-dir"
            label="Direction"
            value={filters.sortDir}
            onChange={(e) =>
              onChange({
                sortDir: e.target.value as GetContractInput['sortDir'],
              })
            }
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" className="min-w-40">
          <InputLabel id="contracts-sent">Sent</InputLabel>
          <Select
            labelId="contracts-sent"
            label="Sent"
            value={filters.sentFilter}
            onChange={(e) =>
              onChange({ sentFilter: e.target.value as SentFilter })
            }
          >
            <MenuItem value="any">Any</MenuItem>
            <MenuItem value="sent">Sent</MenuItem>
            <MenuItem value="notSent">Not sent</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" className="min-w-44">
          <InputLabel id="contracts-deadline-mode">Deadline</InputLabel>
          <Select
            labelId="contracts-deadline-mode"
            label="Deadline"
            value={filters.deadlineMode}
            onChange={(e) =>
              onChange({
                deadlineMode: e.target.value as DeadlineMode,
                deadlineDate:
                  e.target.value === 'none' ? '' : filters.deadlineDate,
              })
            }
          >
            <MenuItem value="none">No date filter</MenuItem>
            <MenuItem value="before">Before end of day</MenuItem>
            <MenuItem value="after">After end of day</MenuItem>
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Deadline date"
            value={filters.deadlineDate ? dayjs(filters.deadlineDate) : null}
            onChange={(newValue) =>
              onChange({
                deadlineDate:
                  newValue != null && newValue.isValid()
                    ? newValue.format('YYYY-MM-DD')
                    : '',
              })
            }
            disabled={!deadlineNeedsDate}
            className="min-w-44"
            slotProps={{ textField: { size: 'small' } }}
          />
        </LocalizationProvider>

        <FormControl size="small" className="min-w-48">
          <InputLabel id="contracts-template">Template</InputLabel>
          <Select
            labelId="contracts-template"
            label="Template"
            value={filters.templateId === '' ? '' : String(filters.templateId)}
            onChange={(e) => {
              const v = e.target.value;
              onChange({
                templateId: v === '' ? '' : Number(v),
              });
            }}
          >
            <MenuItem value="">Any template</MenuItem>
            {templates.map((template) => (
              <MenuItem key={template.id} value={String(template.id)}>
                {template.name ? template.name : `Template #${template.id}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </Paper>
  );
};
