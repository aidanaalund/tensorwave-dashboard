import Image from "next/image";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Home() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center p-24">
      <div className="flex items-center self-start">
        <Image
          // className="dark:invert"
          src="/logo.svg"
          alt="TensorWave logo"
          width={200}
          height={40}
          priority
        />
        <h1 className="ml-4 font-barlow text-3xl font-semibold leading-10 tracking-tight">
          Stocks
        </h1>
      </div>
      <div className="mt-8 w-full">
        <Table>
          <TableCaption>Not affiliated with TensorWave.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Symbol</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead>Price ($)</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Change %</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Market Cap</TableHead>
              <TableHead className="text-right">Exchange</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

          </TableBody>
        </Table>
      </div>
    </main>
  );
}
