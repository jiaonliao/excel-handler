import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider, Select,
    SelectItem, Tab,
    Tabs
} from "@nextui-org/react";
import localTemplates from "../local-templates";
import {useEffect, useState} from "react";
import {LuUploadCloud} from "react-icons/lu";
import xlsx from 'node-xlsx';
import {BsCheckAll} from "react-icons/bs";
import TableView from "../components/TableView";
import {BiExport} from "react-icons/bi";

const fs = window.fs;

export default function UploadExcel() {
    const [tables, setTables] = useState([])
    const [table, setTable] = useState({})
    const [tableSets, setTableSets] = useState({})
    const [resultSet, setResultSet] = useState([])
    const [exportStep, setExportStep] = useState(0)
    const loadTemplates = () => {
        localTemplates
            .fetchTemplates()
            .then(templates => {
                setTables(templates);
            });

    }
    const fileUpload = (dependencyTable) => {
        // 👇️ open file input box on click of other element
        document.querySelector(`#${dependencyTable}-input-file`).click();
    };
    const fileChange = (dependencyTable, event) => {
        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) {
            return;
        }
        console.log("dependencyTable", dependencyTable)
        console.log("fileObj", fileObj)
        fs.readFile(fileObj.path).then(f => {
            const data = xlsx.parse(f);
            const sheet = data[0].data;
            const dependencyTableConf = tables.find(table => table.name === dependencyTable);
            console.log(dependencyTableConf);
            const objects = [];
            for (let i = 0; i < sheet.length; i++) {
                const row = sheet[i];
                if (i < dependencyTableConf.rowStart) {
                    continue;
                }
                const rowData = {};
                for (let j = 0; j < row.length; j++) {
                    const col = dependencyTableConf.cols[j];
                    if (col) {
                        rowData[col.name] = row[j];
                    }
                }
                objects.push(rowData);
            }
            tableSets[dependencyTable] = objects;
            setTableSets({...tableSets});
            console.log("dependencyTable", dependencyTable, tableSets[dependencyTable])
            // 👇️ reset file input
            event.target.value = null;
        })
    };
    const exportTable = () => {
        const cellWith = {
            '!cols': table.cols.map(col => {
                return {wpx: parseInt(col.with)}
            })
        }
        const map = resultSet.map(row => table.cols.map(col => row[col.name]));
        const buffer = xlsx.build([
            {
                name: table.name,
                data: [table.cols.map(col => col.title), ...map]
            }
        ], {sheetOptions: cellWith});
        console.log(cellWith);
        const blob = new Blob([buffer], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
        const url = URL.createObjectURL(blob);
        const downDocument = document.createElement("a");
        downDocument.href = url;
        downDocument.download = table.name + ".xlsx";
        downDocument.click();
        if (downDocument) {
            downDocument.remove();
        }
    };
    const exportTableView = () => {
        const convertCode = table.convertCode;
        // eslint-disable-next-line no-eval
        setResultSet(eval(convertCode));
        console.log(resultSet);
        setExportStep(1);
    }
    useEffect(() => {
        loadTemplates();
    }, [])
    return (
        <div>
            <Card className={"p-10"}>
                <Select className={"w-1/2"} size={"md"} label={"请选择要导出的表格"} onChange={(val) => {
                    setTable(tables.find(table => table.name === val.target.value));
                    setResultSet([])
                    setTableSets({})
                }}>
                    {tables
                        .map(table => {
                            return <SelectItem key={table.name} value={table.name}>{table.name}</SelectItem>
                        })}
                </Select>
                <Divider className={"mt-10"}/>
                <div className={"pt-5"}>
                    表格上传
                </div>
                <div className={"mt-5 flex flex-wrap"}>
                    {
                        table && table.dependencyTables ? table.dependencyTables.map(
                            (dependencyTable) => {
                                return (
                                    <Card key={dependencyTable}
                                          className={`w-72 mx-5 my-5`}>
                                        <CardHeader>
                                            {dependencyTable}
                                        </CardHeader>
                                        <Divider/>
                                        <CardBody className={"flex items-center h-40 justify-center cursor-pointer"}
                                                  onClick={() => {
                                                      fileUpload(dependencyTable)
                                                  }}>

                                            {
                                                tableSets[dependencyTable] ?

                                                    (<div className={"flex flex-col justify-center items-center"}>
                                                            <BsCheckAll size={30}/>
                                                            <div>File uploaded</div>
                                                        </div>
                                                    ) :
                                                    (<div className={"flex flex-col justify-center items-center"}>
                                                        <LuUploadCloud size={30}/>
                                                        <div>Upload file</div>
                                                    </div>)
                                            }
                                            <input id={`${dependencyTable}-input-file`} type={"file"}
                                                   hidden
                                                   onChange={event => {
                                                       fileChange(event.target.id.split("-")[0], event);
                                                   }}/>
                                        </CardBody>
                                    </Card>
                                )
                            }
                        ) : ""
                    }
                </div>
                <Divider className={"mt-10"}/>
                <div className={"pt-5"}>
                    数据预览
                </div>
                <Tabs className={"pt-5"}>
                    {

                        table && table.dependencyTables ? table.dependencyTables.map(depdTab => {
                            return <Tab key={depdTab} title={depdTab}>
                                <TableView data={
                                    tableSets[depdTab]
                                } cols={
                                    tables.find(tab => tab.name === depdTab).cols
                                }></TableView>
                            </Tab>
                        }) : ""
                    }
                </Tabs>
                <Divider className={"mt-10"}/>
                <div className={"pt-5"}>
                    表格导出
                </div>
                <div className={"mb-5"}>
                    {
                        exportStep === 0 ?
                            <Button className={"mt-5"} onClick={exportTableView}>
                                <div className={"flex items-center justify-center"}>
                                    <BiExport></BiExport>
                                    <span className={"pl-3"}> Generate Export Table</span>
                                </div>
                            </Button> :
                            <Button className={"mt-5"} onClick={exportTable}>
                                <div className={"flex items-center justify-center"}>
                                    <BiExport></BiExport>
                                    <span className={"pl-3"}> Export</span>
                                </div>
                            </Button>

                    }
                </div>
                {resultSet && table && resultSet.length > 0 && table.cols && table.cols.length > 0 ?
                    <TableView
                        data={resultSet}
                        cols={table.cols
                        }></TableView>
                    : ""}
            </Card>
        </div>
    )
}