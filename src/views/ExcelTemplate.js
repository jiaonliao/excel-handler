import {Button, Card, CardBody, CardFooter, CardHeader, Divider, Listbox, ListboxItem} from "@nextui-org/react";
import {TbTemplate} from "react-icons/tb";
import {GrChapterAdd} from "react-icons/gr";
import Template from "../components/excel-template/Template";
import {useEffect, useState} from "react";
import localTemplates from "../local-templates";

const cardStyle = {
    width: "300px",
    height: "320px"

}
export default function ExcelTemplate() {
    const [templateIsOpen, setTemplateIsOpen] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [template, setTemplate] = useState({});

    useEffect(() => {
        loadTemplates();
    }, [])
    const loadTemplates = () => {
        localTemplates
            .fetchTemplates()
            .then(templates => {
                setTemplates(templates);
            });
    }

    const deleteTemplate = (template) => {
        localTemplates
            .deleteTemplate(template.name)
            .then(() => {
                loadTemplates();
            })
    }
    const openTemplate = () => {
        setTemplateIsOpen(true);
    }
    const updateTemplate = (template) => {
        setTemplate(({...template}));
        openTemplate();
    }
    return (
        <div>
            <div className="flex flex-wrap justify-center">
                {templates
                    .map(template => {
                        return (<Card className={"mx-10 my-5"} key={template.name} isHoverable={true} style={
                            cardStyle
                        }>
                            <CardHeader>
                                <div className={"flex items-center"}>
                                    <div>
                                        <TbTemplate/>
                                    </div>
                                    <div>
                                        <p className={"ml-3 font-bold"}>{template.name}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <Divider/>
                            <CardBody>
                                <Listbox aria-label={"col-label"}>
                                    {template
                                        .cols
                                        .map(col => {
                                            return (
                                                <ListboxItem key={col.name}>
                                                    {col.title}
                                                </ListboxItem>
                                            )
                                        })}
                                </Listbox>
                            </CardBody>
                            <Divider/>
                            <CardFooter>
                                <div className={"flex w-full justify-end"}>
                                    <Button className={"mr-4"} onClick={() => {
                                        updateTemplate(template);
                                    }}>修改</Button>
                                    <Button onClick={() => {
                                        deleteTemplate(template)
                                    }}>删除</Button>
                                </div>
                            </CardFooter>
                        </Card>)
                    })}
                <Card className={"mx-10 my-5 flex flex-col items-center"} style={cardStyle}>
                    <CardBody>

                        <div className={"flex h-full items-center flex-col justify-center"}>
                            <span className={"pb-10"}>新增表格模板</span>
                            <Button color={"primary"} onClick={() => {
                                setTemplate({
                                    name: "",
                                    rowStart: '',
                                    cols: [],
                                    dependencyTables: [],
                                    convertCode: `function convert(tables) { return tables[0];}`
                                });
                                openTemplate();
                            }} variant="faded">
                                <GrChapterAdd/> Create New Template
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
            <Template templateIsOpen={templateIsOpen}
                      setTemplateIsOpen={setTemplateIsOpen}
                      template={template}
                      setTemplate={setTemplate}
                      loadTemplates={loadTemplates}/>
        </div>
    )
}