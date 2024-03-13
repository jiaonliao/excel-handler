import {Button, Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";
import {Link, useLocation} from "react-router-dom";
import {CgClose} from "react-icons/cg";
import {BsApp} from "react-icons/bs";
import {FaRegWindowMinimize} from "react-icons/fa";

const moveStyle = {
    "-webkit-app-region": "drag",
}
const noMoveStyle = {
    "-webkit-app-region": "no-drag",
}

export default function Navigation() {
    const location = useLocation();
    return (
        <Navbar isBordered={true} position={"sticky"} style={moveStyle}>
            <NavbarBrand>
                <p className="font-bold">
                    Excel Handler
                </p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem isActive={
                    location.pathname === "/excel-template" || location.pathname === "/"
                }>
                    <Link to="/excel-template" style={noMoveStyle}>
                        表格模板
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={
                    location.pathname === "/upload-excel"
                }>
                    <Link to="/upload-excel" style={noMoveStyle}>
                        上传表格
                    </Link>
                </NavbarItem>
                <NavbarItem className={"float-right"}>
                    <div className={"float-right"} style={noMoveStyle}>
                        <Button className={"ml-3"} isIconOnly onClick={() => {
                            console.log(window.min)
                            window.windowsCtrl.min();
                        }}> <FaRegWindowMinimize/>
                        </Button>
                        <Button className={"ml-3"} isIconOnly onClick={() => {
                            window.windowsCtrl.max();
                        }}><BsApp/></Button>
                        <Button className={"ml-3"} isIconOnly onClick={() => {
                            window.windowsCtrl.close();
                        }}><CgClose></CgClose></Button>
                    </div>
                </NavbarItem>
            </NavbarContent>

        </Navbar>
    )
}