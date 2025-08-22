export interface INote {
  id: number;
  note: string;
  created: string;
  user: number;
}
export interface ICustomField {
  id: number;
  field: number;
  value: string;
}
export interface IPaperlessDocument {
  id: number;
  correspondent: number;
  document_type: number;
  storage_path: number;
  title: string;
  content: string;
  tags: number[];
  created: string;
  created_date: string;
  modified: string;
  added: string;
  archive_serial_number: number;
  original_file_name: string;
  archived_file_name: string;
  owner: number;
  user_can_change: boolean;
  notes: INote[];
  custom_fields: ICustomField[];
}

export interface IPaperlessDocuments {
  count: number;
  next: string;
  previous: string;
  results: IPaperlessDocument[];
}