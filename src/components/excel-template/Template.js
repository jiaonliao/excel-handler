import {
    Button, Card, CardBody, Divider,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs, Link, Select, SelectItem
} from "@nextui-org/react";
import ReactCodeMirror from "@uiw/react-codemirror";
import {javascript} from "@codemirror/lang-javascript";
import {abcdef} from "@uiw/codemirror-theme-abcdef";
import {useCallback, useEffect, useState} from "react";
import localTemplates from "../../local-templates";
import {BsArrowDown, BsArrowUp} from "react-icons/bs";
import {toast} from 'sonner'

export default function Template({
                                     templateIsOpen = false,
                                     setTemplateIsOpen,
                                     template,
                                     setTemplate,
                                     loadTemplates
                                 }) {
    const [tables, setTables] = useState([]);
    const [col, setCol] = useState({
        index: null,
        name: '',
        title: '',
        with: 300
    })
    const [colIsOpen, setColIsOpen] = useState(false);

    useEffect(() => {
        localTemplates
            .fetchTemplates()
            .then(templates => {
                setTables(templates.map(template => template.name));
            })
    }, [])

    const codeChange = useCallback((val) => {
        setTemplate({...template, convertCode: val});
    }, [setTemplate, template]);
    const nameValueChange = (val) => {
        setTemplate({...template, name: val});
    };
    const rowStartValueChange = (val) => {
        setTemplate({...template, rowStart: val});
    }
    const dependencyTablesChange = (val) => {
        setTemplate({...template, dependencyTables: Array.from(val)});
    }

    const saveTemplate = () => {
        localTemplates
            .saveTemplate(template)
            .then(() => {
                setTemplateIsOpen(false);
                loadTemplates();
            })
    }
    const moveDown = (index) => {
        if (index < template.cols.length - 1) {
            const temp = template.cols[index];
            template.cols[index] = template.cols[index + 1];
            template.cols[index + 1] = temp;
            setTemplate({...template});
        }
    }
    const moveUp = (index) => {
        if (index > 0) {
            const temp = template.cols[index];
            template.cols[index] = template.cols[index - 1];
            template.cols[index - 1] = temp;
            setTemplate({...template});
        }
    }


    return (
        <Modal size={"3xl"}
               backdrop={"blur"}
               isOpen={templateIsOpen}
               onClose={() => {
                   setTemplateIsOpen(false);
               }}>
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Table Template</ModalHeader>
                        <ModalBody>
                            <div>模板基础数据</div>
                            <Divider/>
                            <div className={"p-2"}>
                                <Input type="text" size={"sm"} label="表名称" value={template.name}
                                       onValueChange={nameValueChange}/>
                                <Input className={"pt-4"} type="number" size={"sm"} label={"数据起始行"}
                                       onValueChange={rowStartValueChange}
                                       value={template.rowStart}/>
                            </div>
                            <div>列设置</div>
                            <Divider/>
                            <div className={"p-2"}>
                                <Button color="primary" onClick={() => {
                                    setCol({
                                        index: null,
                                        name: '',
                                        title: '',
                                        with: 300
                                    });
                                    setColIsOpen(true);
                                }}>添加列</Button>
                                <Tabs className={"float-right"} aria-label="Options">

                                    <Tab key="photos" title="列名设置">
                                        <Table
                                            isHeaderSticky
                                            aria-label="Example static collection table"
                                            classNames={{
                                                base: "max-h-[300px] overflow-y-auto",
                                                table: "min-h-[250]",
                                            }}>
                                            <TableHeader>
                                                <TableColumn>列序号</TableColumn>
                                                <TableColumn>列编码</TableColumn>
                                                <TableColumn>列名称</TableColumn>
                                                <TableColumn>执行操作</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                {
                                                    template
                                                        .cols
                                                        .map((col, i) => {
                                                            return (
                                                                <TableRow key={i}>
                                                                    <TableCell>
                                                                        <div className={"flex items-center"}>
                                                                            <span>{i + 1}</span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>{col.name}</TableCell>
                                                                    <TableCell>{col.title}</TableCell>
                                                                    <TableCell>
                                                                        <Link isBlock
                                                                              underline="always"
                                                                              href="#"
                                                                              color="foreground"
                                                                              onClick={() => moveUp(i)}
                                                                        >
                                                                            <BsArrowUp/>
                                                                        </Link>
                                                                        <Link isBlock
                                                                              underline="always"
                                                                              href="#"
                                                                              color="foreground"
                                                                              onClick={() => moveDown(i)}
                                                                        >

                                                                            <BsArrowDown/>

                                                                        </Link>
                                                                        <Link isBlock
                                                                              underline="always"
                                                                              href="#"
                                                                              color="foreground"
                                                                              onClick={() => {
                                                                                  setCol({index: i, ...col});
                                                                                  setColIsOpen(true);
                                                                              }}
                                                                        >
                                                                            修改
                                                                        </Link>
                                                                        <Link isBlock
                                                                              underline="always"
                                                                              href="#"
                                                                              color="danger"
                                                                              onClick={() => {
                                                                                  template.cols = template
                                                                                      .cols
                                                                                      .filter(c => c.name !== col.name);
                                                                                  setTemplate({...template});
                                                                              }}
                                                                        >

                                                                            删除
                                                                        </Link>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                }
                                            </TableBody>
                                        </Table>

                                    </Tab>
                                    <Tab key="music" title="列转换设置">
                                        <Card>
                                            <CardBody>
                                                <Select
                                                    label="选择表格"
                                                    placeholder="请选择依赖表格"
                                                    selectionMode="multiple"
                                                    className="max-w-xs mt-2 mb-5"
                                                    selectedKeys={template.dependencyTables}
                                                    onSelectionChange={dependencyTablesChange}
                                                >
                                                    {
                                                        tables
                                                            .map((table) => (
                                                                <SelectItem key={table} value={table}>
                                                                    {table}
                                                                </SelectItem>
                                                            ))
                                                    }
                                                </Select>
                                                <ReactCodeMirror
                                                    height={"200px"}
                                                    theme={abcdef}
                                                    value={template.convertCode}
                                                    onChange={codeChange}
                                                    extensions={[javascript()]}
                                                ></ReactCodeMirror>
                                            </CardBody>
                                        </Card>
                                    </Tab>
                                </Tabs>

                            </div>

                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onClick={
                                () => {
                                    setTemplateIsOpen(false);
                                }
                            }>
                                Close
                            </Button>
                            <Button color="primary" onClick={saveTemplate}>
                                Action
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
            <Modal isOpen={colIsOpen} onClose={() => {
                setColIsOpen(false)
            }}>
                <ModalContent>
                    <ModalHeader>Column Modify</ModalHeader>
                    <ModalBody>
                        <Input type={"text"} value={col.name} onValueChange={(val) => {
                            setCol({...col, name: val});
                        }} label={"列属性名"} size={"sm"}></Input>
                        <Input type={"text"} value={col.title} label={"列名"} size={"sm"} onValueChange={
                            (val) => {
                                setCol({...col, title: val});
                            }
                        }></Input>
                        <Input type={"number"} value={col.with} label={"列宽"} size={"sm"} onValueChange={
                            (val) => {
                                setCol({...col, with: val});
                            }
                        }></Input>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" variant="light" onClick={() => {
                            if (col) {
                                const save = col.index === null;
                                const nameExist = template.cols.find(c => c.name === col.name);
                                if (save) {
                                    if (nameExist) {
                                        toast.error('Column name already exists!')
                                        return;
                                    }
                                    template.cols.push({
                                        name: col.name,
                                        title: col.title,
                                        with: col.with
                                    })
                                } else {
                                    if (template.cols[col.index].name === col.name || !nameExist ) {
                                        template.cols[col.index] = {
                                            name: col.name,
                                            title: col.title,
                                            with: col.with
                                        }
                                    } else {
                                        toast.error('Column name already exists!')
                                        return;
                                    }

                                }
                            }
                            setTemplate(template);
                            setColIsOpen(false);
                        }}>
                            Save
                        </Button>
                        <Button color="error" onClick={
                            () => {
                                setColIsOpen(false);
                            }
                        }>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Modal>
    )
}