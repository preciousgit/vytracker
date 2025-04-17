// src/components/ui/table.tsx

import React from "react";

interface TableProps {
  children: React.ReactNode;
}

interface TableHeaderProps {
  children: React.ReactNode;
}

interface TableRowProps {
  children: React.ReactNode;
}

interface TableHeadProps {
  children: React.ReactNode;
}

interface TableCellProps {
  children: React.ReactNode;
}

interface TableBodyProps {
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ children }) => {
  return <table className="min-w-full divide-y divide-gray-200">{children}</table>;
};

const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  return <thead className="bg-gray-50">{children}</thead>;
};

const TableRow: React.FC<TableRowProps> = ({ children }) => {
  return <tr className="bg-white border-b">{children}</tr>;
};

const TableHead: React.FC<TableHeadProps> = ({ children }) => {
  return (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
    >
      {children}
    </th>
  );
};

const TableCell: React.FC<TableCellProps> = ({ children }) => {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
      {children}
    </td>
  );
};

const TableBody: React.FC<TableBodyProps> = ({ children }) => {
  return <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>;
};

export { Table, TableHeader, TableRow, TableHead, TableCell, TableBody };