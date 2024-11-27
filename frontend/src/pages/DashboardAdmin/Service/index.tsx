import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  RowSelectionState,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { toast } from "sonner";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ROW_PER_PAGE_OPTIONS } from "@/lib/variables";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useGetServices } from "@/service/queries";
import { TService } from "@/types/types";

const columnService = [
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Order no",
    accessorKey: "orderNo",
  },
  {
    header: "Visible",
    accessorKey: "visible",
  },
  {
    header: "Created at",
    accessorKey: "createdAt",
  },
];

const Services = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [rowPerPage, setRowPerPage] = useState(6);
  const { data, isLoading } = useGetServices();
  const allServices: TService[] = useMemo(() => data?.data || [], [data]);
  // const deleteAllDoctor = useDeleteAllDoctor();
  // const deleteDoctor = useDeleteDoctor();
  const table = useReactTable({
    data: allServices,
    columns: columnService,
    initialState: {
      pagination: {
        pageSize: rowPerPage,
      },
    },
    state: {
      rowSelection,
      sorting,
    },
    getRowId: (row) => row.serviceId,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
  });

  const selectedServiceRow = Object.keys(table.getState().rowSelection);

  useEffect(() => {
    table.setPageSize(rowPerPage);
  }, [rowPerPage, table]);

  const handleRowPerPageChange = (value: number) => {
    setRowPerPage(value);
  };

  const onOpenModalChange = () => {
    setIsModalOpen((prev) => !prev);
  };

  const onOpenDeleteAllModalChange = () => {
    setIsDeleteAllModalOpen((prev) => !prev);
  };

  const handleDeleteService = async ({
    serviceId,
    title,
  }: {
    doctorID: TDoctorID;
    title: string;
  }) => {
    try {
      await deleteDoctor.mutate(serviceId);
      toast.success(`"${title}" doctor has been deleted!`);
      setIsModalOpen(false);
      navigate(location.pathname, { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAllDoctor = async (doctorIDs: TDoctorIDs) => {
    try {
      if (selectedServiceRow.length) {
        setIsDeleteAllModalOpen(false);
        await deleteAllDoctor.mutate(doctorIDs);
        toast.success(`Selected doctor(s) has been deleted!`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return <div>Services</div>;
};

export default Services;
