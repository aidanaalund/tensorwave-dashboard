import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchAllStocks } from "@/lib/api/stocks";
import { StockRow } from "./stock-row";

export async function StocksTable() {
  const stocks = await fetchAllStocks();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[56px] border-r border-white/15">Logo</TableHead>
          <TableHead className="w-[100px]">Symbol</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Change (1D)</TableHead>
          <TableHead>Change % (1D)</TableHead>
          <TableHead>Volume</TableHead>
          <TableHead>Market Cap</TableHead>
          <TableHead className="text-right">Exchange</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stocks.map((stock) => (
          <StockRow key={stock.symbol} stock={stock} />
        ))}
      </TableBody>
    </Table>
  );
}