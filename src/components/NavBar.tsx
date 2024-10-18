import Image from "next/image";
import { NavItem } from "./NavItem";
import { AptosConnect } from "./AptosConnect";
import {
  MODULE_URL
} from "../config/constants";

export function NavBar() {
  return (
    <nav className="navbar py-4 px-4 bg-base-100">
      <div className="flex-1">
        <a href="https://move-game-kit.rootmud.xyz" target="_blank">
          <Image src="/logo.png" width={64} height={64} alt="logo" />
        </a>
        <ul className="menu menu-horizontal p-0 ml-5">
          <li className="dropdown">
            <label tabIndex={0} className="btn btn-ghost m-1">Services Ops▼</label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <NavItem href="/service_manager" title="Service Manager" />
              <NavItem href="/service_events" title="Service Events" />
            </ul>
          </li>
          <li className="dropdown">
            <label tabIndex={0} className="btn btn-ghost m-1">Address Ops▼</label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <NavItem href="/addr_manager" title="Addr Manager" />
              <NavItem href="/addr_events" title="Addr Events" />
            </ul>
          </li>
          <li className="dropdown">
            <label tabIndex={0} className="btn btn-ghost m-1">Github Ops▼</label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <NavItem href="/" title="Github Binder" />
              <NavItem href="/github_repo_binder" title="Github Repo Binder" />
            </ul>
          </li>
          <li className="dropdown">
            <label tabIndex={0} className="btn btn-ghost m-1">DAO Ops▼</label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <NavItem href="/lightweight_dao_manager" title="DAO Manager" />
            </ul>
          </li>
          {/* Commented out items remain unchanged */}
          <li className="font-sans font-semibold text-lg">
            <a href="https://github.com/NonceGeek/move-game-kit" target="_blank">Source Code</a>
            <a href={MODULE_URL} target="_blank">Contract on Explorer</a>
          </li>
        </ul>

        {/*
        <NavItem href="/create_did_events" title="CreateDIDEvents" /> 
        <NavItem href="/did_querier" title="DIDQuerier" />  */}
      </div>
      <AptosConnect />
    </nav>
  );
}
