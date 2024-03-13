import {useMemo, useState} from "react";
import {Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";

export default function TableView({data = [], cols}) {
    const [page, setPage] = useState(1);
    const rowsPerPage = 4;

    const pages = Math.ceil(data.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return data.slice(start, end);
    }, [page, data]);

    return (
        <Table
            aria-label="Example table with client side pagination"
            bottomContent={
                <div className="flex w-full justify-center">
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="secondary"
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                    />
                </div>
            }
            classNames={{
                wrapper: "min-h-[222px]",
            }}
        >
            <TableHeader>
                {
                    cols.map((col, i) => {
                        return <TableColumn width={col.width} key={i}>
                            {col.title}
                        </TableColumn>
                    })
                }
            </TableHeader>
            <TableBody items={items}>
                {
                    items && items.length > 0 ?
                        items.map((row, index) => {
                            return <TableRow key={index}>
                                {
                                    Object
                                        .keys(row)
                                        .map((col, index) => {
                                            return <TableCell key={col}
                                                              align={"center"}>{row[col]}</TableCell>
                                        })
                                }
                            </TableRow>
                        }) : ""
                }
            </TableBody>
        </Table>
    );

}