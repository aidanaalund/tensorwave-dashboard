import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TARGET_STOCKS } from "@/lib/api/stocks";

export function StocksTableSkeleton() {
  return (
    <Table>
      <TableCaption>Loading stock data...</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[56px] border-r border-white/15">Logo</TableHead>
          <TableHead className="w-[100px]">Symbol</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price ($)</TableHead>
          <TableHead>Change (1D)</TableHead>
          <TableHead>Change % (1D)</TableHead>
          <TableHead>Volume</TableHead>
          <TableHead>Market Cap</TableHead>
          <TableHead className="text-right">Exchange</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {TARGET_STOCKS.map((stock) => (
          <TableRow key={stock.symbol}>
            <TableCell className="border-r border-white/10"><Skeleton className="h-7 w-7 rounded-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
            <TableCell>
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-6 w-[72px]" />
              </div>
            </TableCell>
            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[70px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[90px]" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-4 w-[50px] ml-auto" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}