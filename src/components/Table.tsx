import React, { ReactNode } from 'react';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface TableProps {
  children: ReactNode;
}

const Table: React.FC<TableProps> = ({ children }) => (
  <div className="Table">
    {children}
  </div>
);

interface HeadProps {
  children: ReactNode;
}

const Head: React.FC<HeadProps> = ({ children }) => (
  <div className="TableHead">
    {children}
  </div>
);

interface BodyProps {
  children: ReactNode;
}

const Body: React.FC<BodyProps> = ({ children }) => (
  <div className="TableBody">
    {children}
  </div>
);

interface RowProps {
  children: ReactNode;
}

const Row: React.FC<RowProps> = ({ children }) => (
  <div className="TableRow">
    {children}
  </div>
);

interface CellProps {
  children: ReactNode;
}

const Cell: React.FC<CellProps> = ({ children }) => (
  <div className="p-2">
    {children}
  </div>
);

export {
  Table,
  Head,
  Body,
  Row,
  Cell
};
